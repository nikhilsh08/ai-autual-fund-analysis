import { NextResponse } from "next/server";
import { verifyCashfreePayment } from "@/server/actions/payment.action";

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const result = await verifyCashfreePayment(orderId);

        // This endpoint is public (anyone with an order ID can call it), so it
        // must never echo the order or lead record back.
        return NextResponse.json(
            { success: result.success, status: result.status ?? null },
            { status: result.success ? 200 : 400 },
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
