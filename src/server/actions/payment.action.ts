// server/actions/payment.action.ts
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";

// Initialize Cashfree with correct parameters
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);

cashfree.XApiVersion = "2023-08-01";

export const createCashfreeOrder = async (
  orderId: string,
  amount: number,
  customerDetails: { name: string; email: string; phone: string },
) => {
  try {
    const generateUserId = uuidv4(); // Generate a unique customer ID for Cashfree
    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: generateUserId,
        customer_phone: customerDetails.phone,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback?order_id=${orderId}`,
      },
    };

    console.log("📤 Creating Cashfree Order:", JSON.stringify(request, null, 2));

    const response = await cashfree.PGCreateOrder(request);

    console.log("✅ Cashfree Order Created:", JSON.stringify(response.data, null, 2));

    return {
      success: true,
      data: response.data
    };

  } catch (error: any) {
    console.error("❌ Cashfree Error:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Full Error:", JSON.stringify(error.response?.data, null, 2));

    return {
      success: false,
      error: error.response?.data?.message || error.message || "Payment gateway error",
      errorDetails: error.response?.data
    };
  }
};

import { dataBasePrisma } from "@/lib/dbPrisma";

export const verifyCashfreePayment = async (orderId: string) => {
  try {
    console.log(`🔍 Verifying payment for Order ID: ${orderId}`);

    // 1. Fetch Order Details from Cashfree (Check if order exists)
    let orderDetails;
    try {
      const orderResponse = await cashfree.PGFetchOrder(orderId);
      orderDetails = orderResponse.data;
      console.log("✅ Cashfree Order Details:", JSON.stringify(orderDetails, null, 2));
    } catch (error: any) {
      console.error("❌ Error fetching order details:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new Error("Order not found in Cashfree system");
      }
      throw error;
    }

    // 2. Fetch Payment Attempts for the Order
    let transactions: any[] = [];
    try {
      const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId);
      transactions = paymentsResponse.data as any[];
      console.log("✅ Cashfree Payments:", JSON.stringify(transactions, null, 2));
    } catch (error: any) {
      console.warn("⚠️ Error fetching payments (might be 0 attempts):", error.response?.data || error.message);
      // If 404 on payments, it might mean no payments made yet, but we should treat it as PENDING/FAILED
    }

    // 3. Determine Status based on Order Details AND Payments
    // Priority: Check Order Status directly first
    let internalStatus: "PAID" | "FAILED" | "PENDING" = "PENDING";
    let paymentId = "";
    let paymentMethod = "";
    let latestTransaction = null;

    if (orderDetails.order_status === "PAID") {
      internalStatus = "PAID";
      // Try to find the successful transaction
      const successTx = transactions.find((t: any) => t.payment_status === "SUCCESS");
      if (successTx) {
        latestTransaction = successTx;
        paymentId = successTx.cf_payment_id;
        paymentMethod = successTx.payment_group;
      }
    } else if (orderDetails.order_status === "EXPIRED") {
      internalStatus = "FAILED";
    } else {
      // If order covers pending/active, check latest transaction for failure
      if (transactions.length > 0) {
        latestTransaction = transactions[0]; // Assuming sorted by latest? API docs say list.
        // Actually usually the API returns list. We just take first one if we can't find a success one.
        if (!latestTransaction) latestTransaction = transactions[0];

        paymentId = latestTransaction?.cf_payment_id || "";
        // If the latest transaction status is FAILED, we can say FAILED, but the user might retry. 
        // So we keep PENDING unless the ORDER itself is finalized or expired.
        // But for UI feedback "Payment Failed" is good if the verify request comes after a failure redirect.
      }
    }

    // ... (rest of the database update logic) ...

    // 4. Find the local order to link
    const localOrder = await dataBasePrisma.order.findUnique({
      where: { orderId: orderId },
      include: {
        items: true,
        lead: true
      }
    });

    if (!localOrder) {
      throw new Error(`Local order not found for Order ID: ${orderId}`);
    }

    // 5. Update Database
    await dataBasePrisma.$transaction(async (tx) => {
      // Update local order status
      if (localOrder.status !== internalStatus) {
        await tx.order.update({
          where: { id: localOrder.id },
          data: {
            status: internalStatus,
            paymentId: paymentId ? String(paymentId) : undefined
          }
        });
      }

      // --- LEAD TO USER CONVERSION & PURCHASE LOGIC ---
      if (internalStatus === "PAID") {
        const customerEmail = localOrder.guestEmail || localOrder.lead?.email;
        const customerPhone = localOrder.guestPhone || localOrder.lead?.phone;
        const customerName = localOrder.lead?.name || "Valued User"; // Fallback name

        if (customerEmail) {
          // 1. Check if User exists
          let user = await tx.user.findUnique({
            where: { email: customerEmail }
          });

          // 2. If not, create new User
          if (!user) {
            console.log(`👤 Creating new user for email: ${customerEmail}`);
            user = await tx.user.create({
              data: {
                email: customerEmail,
                name: customerName,
                phone: customerPhone,
                role: "USER",
                // specific fields can be added here (e.g. random password or verified)
              }
            });
          }

          // 3. Link Order to User
          // We update the order to link to the user.
          // Note: If order was already linked, this is idempotent-ish (just overwrites same ID).
          await tx.order.update({
            where: { id: localOrder.id },
            data: { userId: user.id }
          });

          // 4. Create Purchases (Enrollment)
          if (localOrder.items && localOrder.items.length > 0) {
            for (const item of localOrder.items) {
              // Check if purchase already exists to avoid unique constraint errors
              const existingPurchase = await tx.purchase.findUnique({
                where: {
                  userId_courseId: {
                    userId: user.id,
                    courseId: item.courseId
                  }
                }
              });

              if (!existingPurchase) {
                await tx.purchase.create({
                  data: {
                    userId: user.id,
                    courseId: item.courseId
                  }
                });
                console.log(`📚 Enrolled user ${user.email} in course ${item.courseId}`);
              }
            }
          }
        }
      }
      // -----------------------------------------------

      // Log transaction if we have payment details
      if (latestTransaction) {
        const existingTx = await tx.paymentTransaction.findUnique({
          where: { orderId: localOrder.id }
        });

        if (!existingTx) {
          await tx.paymentTransaction.create({
            data: {
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
      }
    });

    return {
      success: true,
      status: internalStatus,
      orderId: orderId
    };

  } catch (error: any) {
    console.error("❌ Verify Payment Error:", error);
    return {
      success: false,
      error: error.message || "Failed to verify payment"
    };
  }
};