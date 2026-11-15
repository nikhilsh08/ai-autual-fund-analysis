import { NextResponse } from "next/server";
import { z } from "zod";
import { validateCoupon } from "@/server/actions/coupon.action";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
    code: z.string().trim().min(1).max(64),
    courseIds: z.array(z.string().min(1)).max(20).default([]),
    bundleIds: z.array(z.string().min(1)).max(20).default([]),
    amount: z.number().nonnegative(),
    batchId: z.string().min(1).nullable().optional(),
});

// POST /api/coupons/validate — the coupon check for pages that are plain HTML
// (the v20 checkout) and cannot call the validateCoupon server action. Same
// rules as the initiate route, so the preview and the charge agree; the
// amount charged is still decided by /api/payment/cashfree/initiate.
export async function POST(req: Request) {
    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    const { code, courseIds, bundleIds, amount, batchId } = parsed.data;
    const result = await validateCoupon(code, courseIds, amount, bundleIds, batchId ?? null);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
