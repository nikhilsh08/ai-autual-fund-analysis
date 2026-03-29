import { deleteCoupon, toggleCouponStatus } from "@/server/actions/coupon.action";
import { auth } from "@/server/auth/auth";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { couponId } = await params;
        const result = await deleteCoupon(couponId);

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { couponId } = await params;
        const body = await req.json();

        // Check if we are toggling status
        if (typeof body.isEnabled === "boolean") {
            const result = await toggleCouponStatus(couponId, body.isEnabled);
            if (result.success) {
                return NextResponse.json({ success: true });
            } else {
                return NextResponse.json({ error: result.error }, { status: 500 });
            }
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
