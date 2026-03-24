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

        const existing = await dataBasePrisma.coupon.findFirst({
            where: { code: { equals: data.code, mode: "insensitive" } },
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
    orderTotal: number,
    bundleIds: string[] = []
) {
    try {
        const coupon = await dataBasePrisma.coupon.findFirst({
            where: {
                code: { equals: code, mode: "insensitive" },
                isEnabled: true
            },
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

        // 4. Check Applicable Courses/Bundles (if restricted)
        const hasRestrictedCourses = coupon.applicableCourseIds && coupon.applicableCourseIds.length > 0;
        const hasRestrictedBundles = coupon.applicableBundleIds && coupon.applicableBundleIds.length > 0;

        if (hasRestrictedCourses || hasRestrictedBundles) {
            const hasApplicableCourse = courseIds.some((id) =>
                coupon.applicableCourseIds?.includes(id)
            );
            const hasApplicableBundle = bundleIds.some((id) =>
                coupon.applicableBundleIds?.includes(id)
            );

            if (!hasApplicableCourse && !hasApplicableBundle) {
                return {
                    success: false,
                    error: "Coupon not applicable to the selected items",
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
