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

            const expected = Buffer.from(computedSignature);
            const received = Buffer.from(signature);
            if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
                // Never log the computed signature: it is the valid one for this body.
                console.error("Invalid Webhook Signature");
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        } catch (err) {
            console.error("Error verifying signature:", err);
            return NextResponse.json({ error: "Invalid signature check" }, { status: 401 });
        }

        const data = JSON.parse(rawBody);
        const orderId = data?.data?.order?.order_id;
        // Events that carry no order (for example a dashboard test ping) are
        // acknowledged, so Cashfree does not keep retrying them.
        if (!orderId) return NextResponse.json({ status: "ignored" }, { status: 200 });

        console.log(`🔔 Webhook received for Order: ${orderId}`);

        // 2. Trigger your existing verification logic
        // Our verification logic is idempotent (safe to run multiple times)
        const result = await verifyCashfreePayment(orderId);

        if (result.success) {
            return NextResponse.json({ status: "success" }, { status: 200 });
        } else {
            return NextResponse.json({ status: "failed", error: (result as any).error }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}