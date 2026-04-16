// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createCashfreeOrder } from '@/server/actions/payment.action';
import { currentUser } from '@/lib/authDetails';
import { dataBasePrisma } from '@/lib/dbPrisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, courseIds, bundleIds, couponCode, utmParams } = body;
        const authenticatedUser = await currentUser();

        if (!name || !email || !phone) {
            return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
        }

        // Must have either courseIds or bundleIds
        if ((!courseIds || courseIds.length === 0) && (!bundleIds || bundleIds.length === 0)) {
            return NextResponse.json({ success: false, error: 'No items to purchase' }, { status: 400 });
        }

        const courseIdArray = Array.isArray(courseIds) ? courseIds : courseIds ? [courseIds] : [];
        const bundleIdArray = Array.isArray(bundleIds) ? bundleIds : bundleIds ? [bundleIds] : [];

        // Track all course IDs for enrollment (including bundle courses)
        let allCourseIdsForEnrollment: string[] = [...courseIdArray];
        let bundleItemsData: { bundleId: string; price: number }[] = [];
        let bundleTotal = 0;

        // 1. Fetch and Validate Bundles
        if (bundleIdArray.length > 0) {
            const bundles = await dataBasePrisma.bundle.findMany({
                where: { id: { in: bundleIdArray }, isActive: true, isPublished: true },
            });

            if (bundles.length !== bundleIdArray.length) {
                return NextResponse.json({ success: false, error: 'Some bundles are unavailable' }, { status: 404 });
            }

            // Expand bundle courses and calculate bundle total
            for (const bundle of bundles) {
                allCourseIdsForEnrollment = [...allCourseIdsForEnrollment, ...bundle.courseIds];
                bundleItemsData.push({
                    bundleId: bundle.id,
                    price: bundle.price
                });
                bundleTotal += bundle.price;
            }

            // Remove duplicates
            allCourseIdsForEnrollment = [...new Set(allCourseIdsForEnrollment)];
        }

        // 2. Fetch and Validate Individual Courses (only ones not from bundles)
        let individualCourseTotal = 0;
        let courses: any[] = [];

        if (courseIdArray.length > 0) {
            courses = await dataBasePrisma.course.findMany({
                where: { id: { in: courseIdArray }, isPublished: true },
            });

            if (courses.length !== courseIdArray.length) {
                return NextResponse.json({ success: false, error: 'Some courses are unavailable' }, { status: 404 });
            }

            individualCourseTotal = courses.reduce((sum, course) => sum + course.price, 0);
        }

        // 3. Calculate Totals (Pre-discount)
        const subtotal = bundleTotal + individualCourseTotal;
        let discountAmount = 0;
        let couponId = null;

        // 4. Apply Coupon if provided
        if (couponCode) {
            const coupon = await dataBasePrisma.coupon.findUnique({
                where: { code: couponCode, isEnabled: true },
            });

            if (coupon) {
                // Validate expiry
                if (new Date() > coupon.expiryDate) {
                    return NextResponse.json({ success: false, error: 'Coupon expired' }, { status: 400 });
                }
                // Validate usage limit
                if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                    return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 });
                }
                // Validate min amount
                if (subtotal < coupon.minAmount) {
                    return NextResponse.json({ success: false, error: `Minimum order amount of ₹${coupon.minAmount} required` }, { status: 400 });
                }

                // Check if coupon applies to selected items
                const hasRestrictedItems =
                    (coupon.applicableCourseIds?.length > 0) ||
                    (coupon.applicableBundleIds?.length > 0);

                if (hasRestrictedItems) {
                    const hasApplicableCourse = courseIdArray.some((id: string) =>
                        coupon.applicableCourseIds?.includes(id)
                    );
                    const hasApplicableBundle = bundleIdArray.some((id: string) =>
                        coupon.applicableBundleIds?.includes(id)
                    );

                    if (!hasApplicableCourse && !hasApplicableBundle) {
                        return NextResponse.json({
                            success: false,
                            error: 'Coupon not applicable to selected items'
                        }, { status: 400 });
                    }
                }

                // Calculate discount
                if (coupon.discountType === "PERCENTAGE") {
                    let calculatedDiscount = (subtotal * coupon.discount) / 100;
                    if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
                        calculatedDiscount = coupon.maxDiscount;
                    }
                    discountAmount = calculatedDiscount;
                } else {
                    discountAmount = coupon.discount;
                }

                // Ensure discount doesn't exceed subtotal
                if (discountAmount > subtotal) {
                    discountAmount = subtotal;
                }

                couponId = coupon.id;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 400 });
            }
        }

        const finalAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

        // 5. User Identity Resolution
        let targetUserId: string | null = authenticatedUser?.id || null;
        let targetLeadId: string | null = null;

        if (!targetUserId) {
            // Check if user exists but isn't logged in
            const existingUser = await dataBasePrisma.user.findUnique({ where: { email } });

            if (existingUser) {
                targetUserId = existingUser.id;
            } else {
                // New Guest: Create/Update Lead
                const lead = await dataBasePrisma.lead.upsert({
                    where: { email },
                    update: { name, phone, courseIds: allCourseIdsForEnrollment },
                    create: { email, name, phone, courseIds: allCourseIdsForEnrollment, source: 'checkout' }
                });
                targetLeadId = lead.id;
            }
        }

        const orderId = `ORDER_CF_${uuidv4()}`;

        // 6. Create Pending Order with both course items and bundle items
        await dataBasePrisma.order.create({
            data: {
                orderId,
                userId: targetUserId,
                leadId: targetLeadId,
                guestEmail: email,
                guestPhone: phone,
                totalAmount: finalAmount,
                discountAmount: discountAmount,
                couponId: couponId,
                status: 'PENDING',
                // Individual course items
                items: courseIdArray.length > 0 ? {
                    create: courses.map((c) => ({
                        courseId: c.id,
                        price: c.price
                    }))
                } : undefined,
                // Bundle items
                bundleItems: bundleItemsData.length > 0 ? {
                    create: bundleItemsData
                } : undefined
            }
        });

        // 7. Cashfree Initiation
        const cashfreeRes = await createCashfreeOrder(orderId, finalAmount, { name, email, phone }, utmParams);

        if (!cashfreeRes.success) throw new Error(cashfreeRes.error);

        return NextResponse.json({
            success: true,
            orderId,
            paymentSession: cashfreeRes.data
        });

    } catch (error: any) {
        console.error("Checkout Error Detailed:", JSON.stringify(error, null, 2));
        console.error("Checkout Error Message:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}