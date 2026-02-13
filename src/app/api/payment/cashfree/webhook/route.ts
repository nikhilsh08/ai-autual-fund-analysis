// app/api/webhook/cashfree/route.ts
import { NextResponse } from 'next/server';
import { verifyCashfreePayment } from '@/server/actions/payment.action';
// import { Cashfree } from "cashfree-pg"; // Not needed for manual verification if not used elsewhere, but keeping if used later or for types
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-webhook-signature');
        const timestamp = req.headers.get('x-webhook-timestamp');

        if (!signature || !timestamp) {
            return NextResponse.json({ error: "Missing signature headers" }, { status: 400 });
        }

        // 1. Verify Webhook Authenticity (Security Check)
        const secretKey = process.env.CASHFREE_SECRET_KEY;
        if (!secretKey) {
            console.error("CASHFREE_SECRET_KEY is not set");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        try {
            // Manual Verification
            // Signature = HMAC-SHA256(timestamp + rawBody, secretKey)
            // const crypto = require('crypto'); // Redundant

            const data = timestamp + rawBody;
            const computedSignature = crypto.createHmac('sha256', secretKey)
                .update(data)
                .digest('base64');

            if (computedSignature !== signature) {
                console.error("Invalid Webhook Signature. Computed:", computedSignature, "Received:", signature);
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        } catch (err) {
            console.error("Error verifying signature:", err);
            return NextResponse.json({ error: "Invalid signature check" }, { status: 401 });
        }

        const data = JSON.parse(rawBody);
        const orderId = data.data.order.order_id;

        console.log(`🔔 Webhook received for Order: ${orderId}`);

        // 2. Trigger your existing verification logic
        // Our verification logic is idempotent (safe to run multiple times)
        const result = await verifyCashfreePayment(orderId);

        if (result.success) {
            return NextResponse.json({ status: "success" }, { status: 200 });
        } else {
            return NextResponse.json({ status: "failed", error: result.error }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}