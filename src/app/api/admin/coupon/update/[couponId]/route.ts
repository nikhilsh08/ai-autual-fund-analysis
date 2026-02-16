import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { NextRequest } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> } // Adapted for Next.js 15+ async params
) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { couponId } = await params;
        const body = await req.json();

        // Check if coupon exists
        const existingCoupon = await dataBasePrisma.coupon.findUnique({
            where: { id: couponId }
        });

        if (!existingCoupon) {
            return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
        }

        // Update fields logic
        const updateData: any = { ...body };
        if (body.expiryDate) updateData.expiryDate = new Date(body.expiryDate);
        if (body.discount) updateData.discount = parseFloat(body.discount);
        // ... other transformations if needed

        const updatedCoupon = await dataBasePrisma.coupon.update({
            where: { id: couponId },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            coupon: updatedCoupon,
            message: "Coupon updated successfully"
        });

    } catch (error) {
        console.error("Update coupon error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
