import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const coupons = await dataBasePrisma.coupon.findMany({
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({
            success: true,
            count: coupons.length,
            coupons
        });

    } catch (error) {
        console.error("Get all coupons error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
