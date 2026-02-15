"use server";

import { dataBasePrisma } from "@/lib/dbPrisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth/auth";

export async function createCoupon(data: {
    code: string;
    discount: number;
    discountType: "PERCENTAGE" | "FIXED";
    expiryDate: Date;
    usageLimit?: number;
    minAmount?: number;
    description?: string;
    applicableCourseIds?: string[];
}) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const existing = await dataBasePrisma.coupon.findUnique({
            where: { code: data.code },
        });

        if (existing) {
            return { success: false, error: "Coupon code already exists" };
        }

        const coupon = await dataBasePrisma.coupon.create({
            data: {
                ...data,
                usageLimit: data.usageLimit || null, // handle optional/undefined
                minAmount: data.minAmount || 0,
                applicableCourseIds: data.applicableCourseIds || [],
            },
        });

        revalidatePath("/admin/coupons");
        return { success: true, data: coupon };
    } catch (error: any) {
        console.error("Create Coupon Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getAllCoupons() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const coupons = await dataBasePrisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: coupons };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCoupon(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await dataBasePrisma.coupon.delete({
            where: { id },
        });
        revalidatePath("/admin/coupons");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleCouponStatus(id: string, isEnabled: boolean) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await dataBasePrisma.coupon.update({
            where: { id },
            data: { isEnabled },
        });
        revalidatePath("/admin/coupons");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function validateCoupon(
    code: string,
    courseIds: string[],
    orderTotal: number
) {
    try {
        const coupon = await dataBasePrisma.coupon.findUnique({
            where: { code, isEnabled: true },
        });

        if (!coupon) {
            return { success: false, error: "Invalid coupon code" };
        }

        // 1. Check Expiry
        if (new Date() > coupon.expiryDate) {
            return { success: false, error: "Coupon expired" };
        }

        // 2. Check Usage Limit
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return { success: false, error: "Coupon usage limit reached" };
        }

        // 3. Check Minimum Amount
        if (orderTotal < coupon.minAmount) {
            return {
                success: false,
                error: `Minimum order amount of ₹${coupon.minAmount} required`,
            };
        }

        // 4. Check Applicable Courses (if restricted)
        if (coupon.applicableCourseIds && coupon.applicableCourseIds.length > 0) {
            const hasApplicableCourse = courseIds.some((id) =>
                coupon.applicableCourseIds.includes(id)
            );
            if (!hasApplicableCourse) {
                return {
                    success: false,
                    error: "Coupon not applicable to the selected courses",
                };
            }
        }

        // 5. Calculate Discount
        let discountAmount = 0;
        if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (orderTotal * coupon.discount) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discount;
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > orderTotal) {
            discountAmount = orderTotal;
        }

        return {
            success: true,
            data: {
                code: coupon.code,
                discountAmount,
                couponId: coupon.id,
            },
        };
    } catch (error: any) {
        console.error("Validate Coupon Error:", error);
        return { success: false, error: "Validation failed" };
    }
}
