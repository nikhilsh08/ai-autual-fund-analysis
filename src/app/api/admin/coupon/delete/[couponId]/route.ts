import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { couponId } = await params;

        await dataBasePrisma.coupon.delete({
            where: { id: couponId }
        });

        return NextResponse.json({
            success: true,
            message: "Coupon deleted successfully"
        });

    } catch (error) {
        console.error("Delete coupon error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
