"use server"
// ============================================================================
// PAYMENT ACTION - CASHFREE INTEGRATION
// ============================================================================
// This file handles:
// 1. Creating Cashfree payment orders with UTM tracking
// 2. Verifying payments from Cashfree callbacks
// 3. Converting Leads → Users after successful payment
// 4. Creating Purchase records (idempotent)
// 5. Enrolling users in Trainer Central courses (external API)
// ============================================================================

import { Cashfree, CFEnvironment } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { enrollUserInTrainerCentral } from "@/lib/trainer-central";

// --- CASHFREE SDK CONFIGURATION ---
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX, // Change to PRODUCTION for live
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);
cashfree.XApiVersion = "2023-08-01";

// --- TYPE DEFINITIONS ---
export interface PaymentVerificationResult {
  success: boolean;
  data?: any;
  status?: string;
  error?: string;
}


// ============================================================================
// CREATE CASHFREE ORDER
// ============================================================================
// Called when user clicks "Pay Now" button
// Creates a Cashfree payment session and saves UTM tracking data
// ============================================================================
export const createCashfreeOrder = async (
  orderId: string,
  amount: number,
  customerDetails: { name: string; email: string; phone: string },
  utmParams?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  }
) => {
  try {
    // --- STEP 1: SAVE UTM TRACKING DATA TO DATABASE ---
    // Update the existing local order with marketing attribution data
    // This helps track which campaigns are driving sales
    if (utmParams) {
      await dataBasePrisma.order.update({
        where: { orderId },
        data: {
          utmSource: utmParams.utmSource,
          utmMedium: utmParams.utmMedium,
          utmCampaign: utmParams.utmCampaign,
          utmTerm: utmParams.utmTerm,
          utmContent: utmParams.utmContent,
        }
      }).catch((err: any) => console.error("Failed to save UTMs", err));
    }

    // --- STEP 2: CREATE CASHFREE PAYMENT SESSION ---
    // Generate a payment link that redirects back to our callback URL
    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: uuidv4(),
        customer_phone: customerDetails.phone.replace(/[^0-9+]/g, ""),
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id=${orderId}`,
      },
    };

    // Create the payment session in Cashfree
    const response = await cashfree.PGCreateOrder(request);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Gateway error" };
  }
};

// ============================================================================
// VERIFY CASHFREE PAYMENT
// ============================================================================
// Called after user completes payment on Cashfree page
//
// ARCHITECTURE:
// 1. Fetch payment status from Cashfree API
// 2. Update local database in a FAST transaction (< 5 seconds)
// 3. Process external API calls (Trainer Central) AFTER transaction
//
// WHY THIS MATTERS:
// - Prisma transactions timeout after 5 seconds
// - External API calls can take 2-10 seconds each
// - Delays inside transactions = "Transaction already closed" error
// - Solution: Queue enrollments, then process AFTER transaction commits
// ============================================================================
export const verifyCashfreePayment = async (orderId: string): Promise<PaymentVerificationResult> => {
  try {
    // --- STEP 1: FETCH PAYMENT STATUS FROM CASHFREE ---
    // Get order details and all payment attempts for this order
    const orderResponse = await cashfree.PGFetchOrder(orderId);
    const cfOrder = orderResponse.data;

    const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId);
    const transactions = paymentsResponse.data as any[];

    // --- STEP 2: DETERMINE PAYMENT STATUS ---
    // Map Cashfree status to our internal status (PAID/FAILED/PENDING)
    let internalStatus: "PAID" | "FAILED" | "PENDING" = "PENDING";
    let paymentId = "";
    let latestTransaction = null;

    if (cfOrder.order_status === "PAID") {
      internalStatus = "PAID";
      latestTransaction = transactions.find((t: any) => t.payment_status === "SUCCESS") || transactions[0];
      paymentId = latestTransaction?.cf_payment_id ? String(latestTransaction.cf_payment_id) : "";
    } else if (cfOrder.order_status === "EXPIRED") {
      internalStatus = "FAILED";
    }

    // --- STEP 3: FETCH LOCAL ORDER FROM DATABASE ---
    // Get our database record with all related items (courses, bundles, lead info)
    const localOrder = await dataBasePrisma.order.findUnique({
      where: { orderId },
      include: {
        items: {
          include: {
            course: true
          }
        },
        bundleItems: {
          include: {
            bundle: true
          }
        },
        lead: true
      }
    });

    if (!localOrder) throw new Error("Local order not found");

    // --- ARCHITECTURE: ENROLLMENT QUEUE ---
    // We collect all enrollments to process AFTER the transaction
    // WHY? External API calls (Trainer Central) can take 2-10 seconds each
    // If we call them inside the transaction, it will timeout (Prisma limit: 5 seconds)
    // SOLUTION: Queue enrollments during transaction, process them after it commits
    const enrollmentTasks: Array<{
      type: string;
      email: string;
      name: string;
      tcCourseId: string;
      courseTitle: string;
      isBundle: boolean;
    }> = [];

    // --- HELPER: DELAY FOR RATE-LIMITING ---
    // Used AFTER transaction to avoid hitting external API rate limits
    // DO NOT use this inside the transaction block!
    const delay = (ms: number): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // ========================================================================
    // DATABASE TRANSACTION - MUST COMPLETE IN < 5 SECONDS
    // ========================================================================
    // This block updates the database atomically (all-or-nothing)
    // Only FAST operations allowed here (no external API calls, no delays)
    // ========================================================================
    const result = await dataBasePrisma.$transaction(async (tx: any) => {
      // --- TRANSACTION STEP 1: UPDATE ORDER STATUS ---
      // Mark order as PAID/FAILED/PENDING and save payment ID
      await tx.order.update({
        where: { id: localOrder.id },
        data: { status: internalStatus, paymentId: paymentId || undefined }
      });

      if (internalStatus === "PAID") {
        // --- TRANSACTION STEP 2: GET CUSTOMER EMAIL ---
        // Ensuring we have an email for enrollment
        const email = localOrder.guestEmail || localOrder.lead?.email;
        if (!email) throw new Error("No customer email available for enrollment");

        // --- TRANSACTION STEP 3: LEAD → USER CONVERSION ---
        // If user doesn't exist, create a new User account from Lead/Guest data
        let user = await tx.user.findUnique({ where: { email } });

        if (!user) {
          // Create new user account from lead/guest information
          user = await tx.user.create({
            data: {
              email: email,
              name: localOrder.lead?.name || "Guest User",
              phone: localOrder.guestPhone || localOrder.lead?.phone || "",
              role: "USER"
            }
          });
        }

        // --- TRANSACTION STEP 4: LINK ORDER TO USER ---
        // Connect the order to the user account
        await tx.order.update({
          where: { id: localOrder.id },
          data: { userId: user.id }
        });

        // --- TRANSACTION STEP 5: CREATE PURCHASE RECORDS (INDIVIDUAL COURSES) ---
        // For each course purchased individually, create a Purchase record
        // Uses upsert to make this operation idempotent (safe to retry)
        for (const item of localOrder.items) {
          // Create purchase record (idempotent - won't duplicate if already exists)
          await tx.purchase.upsert({
            where: { userId_courseId: { userId: user.id, courseId: item.courseId } },
            update: {},
            create: { userId: user.id, courseId: item.courseId }
          });

          // Queue enrollment for processing AFTER transaction commits
          // (Trainer Central API calls take 2-10 seconds, can't run inside transaction)
          if (item.course?.tcCourseId) {
            enrollmentTasks.push({
              type: item.course.type,
              email: user.email,
              name: user.name || "Student",
              tcCourseId: item.course.tcCourseId,
              courseTitle: item.course.title,
              isBundle: false
            });
          }
        }

        // --- TRANSACTION STEP 6: CREATE PURCHASE RECORDS (BUNDLE COURSES) ---
        // For bundle purchases, enroll user in ALL courses within the bundle
        // Example: "Complete Finance Bundle" might contain 5 individual courses
        if (localOrder.bundleItems && localOrder.bundleItems.length > 0) {
          for (const bundleItem of localOrder.bundleItems) {
            const bundle = bundleItem.bundle;
            if (!bundle || !bundle.courseIds || bundle.courseIds.length === 0) continue;

            // Fetch all courses that are part of this bundle
            const bundleCourses = await tx.course.findMany({
              where: { id: { in: bundle.courseIds } }
            });

            // Create individual purchase records for each bundle course
            for (const course of bundleCourses) {
              // Upsert makes this idempotent (safe to retry without duplicates)
              await tx.purchase.upsert({
                where: { userId_courseId: { userId: user.id, courseId: course.id } },
                update: {},
                create: { userId: user.id, courseId: course.id }
              });

              // Queue enrollment for processing AFTER transaction commits
              // (Trainer Central API calls are too slow for transaction block)
              if (course.tcCourseId) {
                enrollmentTasks.push({
                  type: course.type,
                  email: user.email,
                  name: user.name || "Student",
                  tcCourseId: course.tcCourseId,
                  courseTitle: course.title,
                  isBundle: true
                });
              }
            }
          }
        }
      }

      // --- TRANSACTION STEP 7: LOG PAYMENT TRANSACTION DETAILS ---
      // Save raw Cashfree payment data for reconciliation and debugging
      // This helps with disputes, refunds, and accounting
      if (latestTransaction) {
        await tx.paymentTransaction.upsert({
          where: { orderId: localOrder.id },
          update: { status: latestTransaction.payment_status },
          create: {
            orderId: localOrder.id,
            paymentId: String(latestTransaction.cf_payment_id),
            amount: latestTransaction.payment_amount,
            currency: latestTransaction.payment_currency,
            status: latestTransaction.payment_status,
            paymentMethod: latestTransaction.payment_group,
            rawResponse: latestTransaction as any
          }
        });
      }

      // Return transaction result
      return { success: true, data: localOrder, status: internalStatus };
    }); // <-- END OF TRANSACTION BLOCK

    // ========================================================================
    // POST-TRANSACTION: EXTERNAL API CALLS
    // ========================================================================
    // Transaction has committed successfully. Now we can safely make slow
    // external API calls without risking transaction timeout
    // ========================================================================

    // --- STEP 4: PROCESS TRAINER CENTRAL ENROLLMENTS ---
    // Now that database is updated, enroll users in courses via external API
    // We use delay() between calls to respect rate limits (avoid 429 errors)
    for (const task of enrollmentTasks) {
      try {
        console.log(`Attempting TC enrollment${task.isBundle ? ' (from bundle)' : ''} for ${task.email} -> ${task.tcCourseId} (${task.type})`);

        // Call Trainer Central API to enroll user in course
        // This grants them access to course content on Zoho platform
        await enrollUserInTrainerCentral(
          task.type,
          task.email,
          task.name,
          task.tcCourseId
        );

        // Rate-limiting delay: wait 2 seconds before next enrollment
        // Prevents hitting Zoho API rate limits (typically 100 req/min)
        await delay(1000);
      } catch (err) {
        // Log error but don't throw - we don't want to fail payment verification
        // Admin can manually enroll users if this fails
        console.error(`Failed to enroll in TC for course ${task.courseTitle}${task.isBundle ? ' (bundle)' : ''}`, err);
      }
    }

    // --- STEP 5: UPDATE COUPON USAGE COUNT ---
    // Increment coupon usage counter (done outside transaction to avoid locking)
    // If this fails, it's not critical - the payment already succeeded
    if (internalStatus === "PAID" && localOrder.couponId) {
      try {
        // Increment the usage counter for analytics
        await dataBasePrisma.coupon.update({
          where: { id: localOrder.couponId },
          data: { usedCount: { increment: 1 } }
        });
      } catch (err) {
        // Non-critical error - log and continue
        console.error("Failed to increment coupon usage", err);
      }
    }

    // --- STEP 6: RETURN VERIFICATION RESULT ---
    // Return the transaction result to the caller
    return result;

  } catch (error: any) {
    // --- ERROR HANDLING ---
    // Log the full error for debugging, return generic message to client
    console.error("Verification Error:", error);
    return { success: false, error: "Verification failed" };
  }
};