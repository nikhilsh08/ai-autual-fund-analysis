// server/actions/payment.action.ts
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";

// Initialize Cashfree with correct parameters
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);

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

    // 1. Fetch Order Status from Cashfree
    const response = await cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    console.log("✅ Cashfree Payment Fetch Response:", JSON.stringify(response.data, null, 2));

    // 2. Determine Transaction Status
    // Cashfree returns an array of transactions. We take the latest one.
    const transactions = response.data;
    const latestTransaction = transactions && transactions.length > 0 ? transactions[0] : null;

    if (!latestTransaction) {
      throw new Error("No payment transactions found for this order.");
    }

    const paymentStatus = latestTransaction.payment_status; // SUCCESS, FAILED, PENDING, USER_DROPPED
    const paymentId = latestTransaction.cf_payment_id;
    const paymentAmount = latestTransaction.payment_amount;
    const paymentCurrency = latestTransaction.payment_currency;
    // const paymentMessage = latestTransaction.payment_message;
    const paymentMethod = latestTransaction.payment_group; // credit_card, upi, etc.

    // 3. Map to our internal status
    let internalStatus: "PAID" | "FAILED" | "PENDING" = "PENDING";
    if (paymentStatus === "SUCCESS") internalStatus = "PAID";
    else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED") internalStatus = "FAILED";

    // 4. Find the local order to link
    // Only proceed if we can find the order.
    // We search by `orderId` (custom ID) not mongo ID
    const localOrder = await dataBasePrisma.order.findUnique({
      where: { orderId: orderId }
    });

    if (!localOrder) {
      throw new Error(`Local order not found for Order ID: ${orderId}`);
    }

    // 5. Update Database (Transaction + Order)
    // We use a transaction to ensure atomicity
    await dataBasePrisma.$transaction(async (tx) => {
      // A. Create Transaction Record
      // Check if transaction already exists to avoid duplicates (idempotency)
      const existingTx = await tx.paymentTransaction.findUnique({
        where: { orderId: localOrder.id }
      });

      if (!existingTx) {
        await tx.paymentTransaction.create({
          data: {
            orderId: localOrder.id,
            paymentId: String(paymentId),
            amount: paymentAmount,
            currency: paymentCurrency,
            status: paymentStatus,
            paymentMethod: paymentMethod,
            rawResponse: latestTransaction as any
          }
        });
      }

      // B. Update Order Status
      // Only update if status changed or it's currently pending
      if (localOrder.status !== internalStatus) {
        await tx.order.update({
          where: { id: localOrder.id },
          data: {
            status: internalStatus,
            paymentId: String(paymentId)
          }
        });
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