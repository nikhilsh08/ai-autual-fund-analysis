// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createCashfreeOrder } from '@/server/actions/payment.action';
import { dataBasePrisma } from '@/lib/dbPrisma';
import { z } from 'zod';
import { applyCoupon, couponAppliesTo, roundRupees } from '@/lib/pricing';
import { isOnSale } from '@/lib/batches/schedule';
import { LANDING_SOURCES, isLandingSource, type LandingPageKey } from '@/lib/landing/sources';
import { landingPageOfCourse, seatLimitForPage } from '@/lib/landing/course-link';
import { metaMatchFromRequest } from '@/lib/meta-capi';
import { sameSiteOrigin } from '@/lib/request-origin';

const batchFieldsSchema = z.object({
    batchId: z.string().min(1).optional(),
    whatsappOptIn: z.boolean().optional(),
});

// The step a payment start has reached. Sent back when it fails, so a failure
// can be told apart ("the gateway refused" or "the order could not be saved")
// without the server log.
type Stage = "check" | "buyer" | "order" | "gateway";

// The error's class and code, never its message: a message can carry
// database or gateway internals, which must not reach the page.
function failureReason(error: unknown): string | undefined {
    const e = error as { gatewayCode?: unknown; name?: unknown; code?: unknown } | null;
    if (typeof e?.gatewayCode === "string" && e.gatewayCode) return e.gatewayCode.slice(0, 120);
    const parts = [
        typeof e?.name === "string" && e.name !== "Error" ? e.name : null,
        typeof e?.code === "string" ? e.code : null,
    ].filter(Boolean);
    return parts.length ? parts.join(" ").slice(0, 120) : undefined;
}

export async function POST(req: Request) {
    let stage: Stage = "check";
    try {
        const body = await req.json();
        const { name, email, phone, courseIds, bundleIds, couponCode, utmParams, landingSource } = body;
        const batchFields = batchFieldsSchema.safeParse(body);
        if (!batchFields.success) {
            return NextResponse.json({ success: false, error: 'Invalid batch fields' }, { status: 400 });
        }
        const { batchId, whatsappOptIn = false } = batchFields.data;

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
        const bundleItemsData: { bundleId: string; price: number }[] = [];
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

        // 2b. Batch courses are buy-now only. The price is the batch price —
        // never Course.price and never anything sent by the browser — and the
        // batch must be on sale right now.
        let batch: { id: string; priceRupees: number } | null = null;
        // The workshop landing page this course is linked to in the admin panel.
        let coursePage: LandingPageKey | null = null;
        const batchCourses = courses.filter((c) => c.useBatches);
        if (batchCourses.length > 0) {
            if (courses.length !== 1 || bundleIdArray.length > 0) {
                return NextResponse.json({ success: false, error: 'batch_course_must_be_alone' }, { status: 400 });
            }
            if (!batchId) {
                return NextResponse.json({ success: false, error: 'batch_required' }, { status: 400 });
            }
            const candidate = await dataBasePrisma.batch.findUnique({ where: { id: batchId } });
            if (!candidate || candidate.courseId !== batchCourses[0].id || !isOnSale(candidate, new Date())) {
                return NextResponse.json({ success: false, error: 'batch_not_on_sale' }, { status: 409 });
            }
            // /v20 and /v30 sell a fixed number of seats per batch.
            coursePage = await landingPageOfCourse(batchCourses[0]);
            const seatLimit = seatLimitForPage(coursePage);
            if (seatLimit !== null) {
                const paidSeats = await dataBasePrisma.orderItem.count({
                    where: { batchId: candidate.id, order: { status: 'PAID' } },
                });
                if (paidSeats >= seatLimit) {
                    return NextResponse.json({ success: false, error: 'batch_full' }, { status: 409 });
                }
            }
            batch = { id: candidate.id, priceRupees: candidate.priceRupees };
            individualCourseTotal = candidate.priceRupees;
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

                // Same rules as validateCoupon (checkout preview), including
                // batch scope.
                if (!couponAppliesTo(coupon, { courseIds: courseIdArray, bundleIds: bundleIdArray, batchId: batch?.id })) {
                    return NextResponse.json({
                        success: false,
                        error: 'Coupon not applicable to selected items'
                    }, { status: 400 });
                }

                discountAmount = applyCoupon(subtotal, coupon);
                couponId = coupon.id;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 400 });
            }
        }

        const finalAmount = roundRupees(subtotal - discountAmount);

        // 5. Buyer identity. The order belongs to the email typed at checkout,
        // never to whoever is signed in in this browser: an admin testing a
        // purchase is signed in on this site, and the order must not become
        // theirs. The typed name and phone are always kept on a Lead, so the
        // registration, the thank-you page and the Meta event use them.
        stage = "buyer";
        const existingUser = await dataBasePrisma.user.findUnique({ where: { email } });
        const targetUserId: string | null = existingUser?.id ?? null;
        const lead = await dataBasePrisma.lead.upsert({
            where: { email },
            update: { name, phone, courseIds: allCourseIdsForEnrollment },
            create: { email, name, phone, courseIds: allCourseIdsForEnrollment, source: 'checkout' }
        });
        const targetLeadId: string | null = lead.id;

        // Which landing page sold it. Only accepted when it is the page this
        // course is linked to, so a seat on /v20 can never be counted (or
        // thanked) as /v30.
        const orderSource =
            batch && isLandingSource(landingSource) && LANDING_SOURCES[landingSource].page === coursePage
                ? landingSource
                : null;

        const orderId = `ORDER_CF_${uuidv4()}`;

        // 6. Create Pending Order with both course items and bundle items
        stage = "order";
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
                whatsappOptIn: batch ? whatsappOptIn : false,
                // Which workshop landing page sold it (admin → Landing pages).
                landingSource: orderSource,
                // Meta CAPI match keys for the server-side Purchase event.
                ...metaMatchFromRequest(req),
                // Individual course items
                items: courseIdArray.length > 0 ? {
                    create: courses.map((c) => ({
                        courseId: c.id,
                        price: batch ? batch.priceRupees : c.price,
                        batchId: batch?.id ?? null,
                    }))
                } : undefined,
                // Bundle items
                bundleItems: bundleItemsData.length > 0 ? {
                    create: bundleItemsData
                } : undefined
            }
        });

        // 7. Cashfree Initiation
        stage = "gateway";
        const cashfreeRes = await createCashfreeOrder(orderId, finalAmount, { name, email, phone }, utmParams, orderSource ?? undefined,
            // After paying, the buyer returns to the site they are on.
            sameSiteOrigin(req) ?? undefined,
        );

        if (!cashfreeRes.success) {
            throw Object.assign(new Error(cashfreeRes.error), { gatewayCode: (cashfreeRes as { code?: string }).code });
        }

        return NextResponse.json({
            success: true,
            orderId,
            paymentSession: cashfreeRes.data
        });

    } catch (error: any) {
        console.error("Checkout Error Detailed:", JSON.stringify(error, null, 2));
        console.error("Checkout Error Message:", error.message);
        console.error("Checkout Error Stage:", stage);
        // Details stay in the server log; the browser gets a generic message
        // (database or Cashfree internals must not reach the page), plus the
        // step that failed and the error's code.
        const reason = failureReason(error);
        return NextResponse.json(
            { success: false, error: "payment_start_failed", stage, ...(reason ? { reason } : {}) },
            { status: 500 },
        );
    }
}