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
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id=${orderId}`,
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