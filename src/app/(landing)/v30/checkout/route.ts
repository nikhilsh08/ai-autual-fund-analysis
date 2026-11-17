import { NextResponse } from "next/server";
import { renderV30Checkout } from "@/lib/landing/render-v30";
import { MPF_V30_LANDING_PATH } from "@/lib/landing/v30";
import {
    cashfreeMode,
    getV20BatchOnSale,
    getPageCourse,
    htmlResponse,
    isDevPreview,
    loadV20Template,
    previewBatchFor,
    redirectTo,
    v20Common,
} from "@/lib/landing/v20-data";

export const dynamic = "force-dynamic";

const HOOKS = { initiateUrl: "/api/payment/cashfree/initiate", couponUrl: "/api/coupons/validate" };

// GET /v30/checkout — loads the batch on sale on every request, so the price
// and dates are never stale. With nothing on sale the buyer goes back to the
// landing page, which shows "Booking for the next batch opens soon".
// Development only: /v30/checkout?preview=1 (payment switched off).
export async function GET(req: Request) {
    const url = new URL(req.url);
    const template = loadV20Template("mpf-v30-checkout.html");

    if (isDevPreview(url.searchParams.get("preview"))) {
        const p = await previewBatchFor("v30");
        if (!p.batch) return redirectTo("/v30?preview=1#seat");
        const html = renderV30Checkout(template, p.batch, v20Common(p.courseId ?? "preview"), {
            ...HOOKS,
            cashfreeMode: "sandbox",
            preview: true,
        });
        return htmlResponse(html, "no-store");
    }

    const course = await getPageCourse("v30");
    if (!course || !course.isPublished) return new NextResponse("Not found", { status: 404 });

    const batch = await getV20BatchOnSale(course);
    if (!batch) return redirectTo(`${MPF_V30_LANDING_PATH}#seat`);

    const html = renderV30Checkout(template, batch, v20Common(course.id), { ...HOOKS, cashfreeMode: cashfreeMode() });
    return htmlResponse(html, "no-store");
}
