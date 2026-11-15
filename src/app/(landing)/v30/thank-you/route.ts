import { NextResponse } from "next/server";
import { renderV30ThankYou, type V30Order } from "@/lib/landing/render-v30";
import { MPF_V30_LANDING_PATH } from "@/lib/landing/v30";
import {
    htmlResponse,
    isDevPreview,
    loadThankYouOrder,
    loadV20Template,
    previewBatchFor,
    toV20Batch,
    v20Common,
} from "@/lib/landing/v20-data";

export const dynamic = "force-dynamic";

// GET /v30/thank-you?order_id=… — paid, pending and failed states.
// READ-ONLY: the Cashfree webhook and /payment/callback process the payment.
// Development only: /v30/thank-you?preview=1[&state=pending|failed][&links=0]
export async function GET(req: Request) {
    const url = new URL(req.url);
    const template = loadV20Template("mpf-v30-thank-you.html");
    const hooks = (orderId: string) => ({
        verifyUrl: "/api/payment/cashfree/verify",
        bookingUrl: `/api/orders/${encodeURIComponent(orderId)}/booking`,
    });

    if (isDevPreview(url.searchParams.get("preview"))) {
        const asked = url.searchParams.get("state");
        const state = asked === "pending" || asked === "verifying" ? "verifying" : asked === "failed" ? "failed" : "paid";
        const links = url.searchParams.get("links") !== "0";
        const p = await previewBatchFor("v30");
        if (!p.batch) return NextResponse.redirect(new URL("/v30?preview=1", url), 307);
        const order: V30Order = {
            state,
            orderId: "ORDER_PREVIEW_0000",
            name: "Your name",
            email: "you@example.com",
            amountRupees: p.batch.priceRupees,
            joinDay1: links ? "https://example.com/join/day1" : null,
            joinDay2: links ? "https://example.com/join/day2" : null,
            whatsappGroup: "https://chat.whatsapp.com/preview",
        };
        const html = renderV30ThankYou(template, p.batch, order, v20Common(p.courseId ?? "preview"), {
            ...hooks(order.orderId),
            preview: true,
        });
        return htmlResponse(html, "no-store");
    }

    const orderId = url.searchParams.get("order_id");
    const landing = () => NextResponse.redirect(new URL(MPF_V30_LANDING_PATH, url), 307);
    if (!orderId) return landing();

    const found = await loadThankYouOrder(orderId);
    if (found.kind === "missing") return landing();
    // Course orders keep the main site's confirmation page.
    if (found.kind === "not-batch") {
        return NextResponse.redirect(new URL(`/order-status?order_id=${encodeURIComponent(orderId)}`, url), 307);
    }

    const order: V30Order = {
        state: found.state,
        orderId: found.orderId,
        name: found.name,
        email: found.email,
        amountRupees: found.amountRupees,
        joinDay1: found.joinDay1,
        joinDay2: found.joinDay2,
        whatsappGroup: found.whatsappGroup,
    };

    const html = renderV30ThankYou(template, toV20Batch(found.batch), order, v20Common(found.courseId), hooks(order.orderId));
    return htmlResponse(html, "no-store, private");
}
