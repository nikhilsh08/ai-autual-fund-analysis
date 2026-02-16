import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function POST(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const {
            code,
            discount,
            discountType,
            expiryDate,
            usageLimit,
            minAmount,
            maxDiscount,
            description,
            applicableCourseIds
        } = body;

        // Validation
        if (!code || !discount || !expiryDate || !discountType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existingCoupon = await dataBasePrisma.coupon.findUnique({
            where: { code }
        });

        if (existingCoupon) {
            return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
        }

        const newCoupon = await dataBasePrisma.coupon.create({
            data: {
                code,
                discount: parseFloat(discount),
                discountType,
                expiryDate: new Date(expiryDate),
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                minAmount: minAmount ? parseFloat(minAmount) : 0,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                description,
                applicableCourseIds: applicableCourseIds || [],
                isEnabled: true
            }
        });

        return NextResponse.json({
            success: true,
            coupon: newCoupon,
            message: "Coupon created successfully"
        });

    } catch (error) {
        console.error("Create coupon error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
