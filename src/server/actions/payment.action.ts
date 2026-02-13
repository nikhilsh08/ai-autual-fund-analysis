// server/actions/payment.action.ts
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { v4 as uuidv4 } from "uuid";
import { dataBasePrisma } from "@/lib/dbPrisma";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX, // Change to PRODUCTION for live
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
    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: uuidv4(),
        customer_phone: customerDetails.phone,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id=${orderId}`,
      },
    };

    const response = await cashfree.PGCreateOrder(request);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Gateway error" };
  }
};

export const verifyCashfreePayment = async (orderId: string) => {
  try {
    const orderResponse = await cashfree.PGFetchOrder(orderId);
    const cfOrder = orderResponse.data;

    const paymentsResponse = await cashfree.PGOrderFetchPayments(orderId);
    const transactions = paymentsResponse.data as any[];

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

    const localOrder = await dataBasePrisma.order.findUnique({
      where: { orderId },
      include: { items: true, lead: true }
    });

    if (!localOrder) throw new Error("Local order not found");

    await dataBasePrisma.$transaction(async (tx) => {
      // 1. Update Order Status
      await tx.order.update({
        where: { id: localOrder.id },
        data: { status: internalStatus, paymentId: paymentId || undefined }
      });

      if (internalStatus === "PAID") {
        // Narrowing types for TS: ensuring we have an email
        const email = localOrder.guestEmail || localOrder.lead?.email;
        if (!email) throw new Error("No customer email available for enrollment");

        // 2. Lead -> User Conversion
        let user = await tx.user.findUnique({ where: { email } });

        if (!user) {
          user = await tx.user.create({
            data: {
              email: email,
              name: localOrder.lead?.name || "Guest User",
              phone: localOrder.guestPhone || localOrder.lead?.phone || "",
              role: "USER"
            }
          });
        }

        // 3. Link User and Create Purchases (Idempotent)
        await tx.order.update({
          where: { id: localOrder.id },
          data: { userId: user.id }
        });

        for (const item of localOrder.items) {
          await tx.purchase.upsert({
            where: { userId_courseId: { userId: user.id, courseId: item.courseId } },
            update: {},
            create: { userId: user.id, courseId: item.courseId }
          });
        }
      }

      // 4. Log Transaction record
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
    });
    return { success: true, data: localOrder, status: internalStatus };
  } catch (error: any) {
    console.error("Verification Error:", error);
    return { success: false, error: "Verification failed", status: "FAILED" };
  }
};