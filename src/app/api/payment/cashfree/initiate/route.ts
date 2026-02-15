// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createCashfreeOrder } from '@/server/actions/payment.action';
import { currentUser } from '@/lib/authDetails';
import { dataBasePrisma } from '@/lib/dbPrisma';

const TAX_RATE = 0.18;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, courseIds, couponCode } = body;
        const authenticatedUser = await currentUser();

        if (!name || !email || !phone || !courseIds) {
            return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
        }

        const courseIdArray = Array.isArray(courseIds) ? courseIds : [courseIds];

        // 1. Fetch and Validate Courses
        const courses = await dataBasePrisma.course.findMany({
            where: { id: { in: courseIdArray }, isPublished: true },
        });

        if (courses.length !== courseIdArray.length) {
            return NextResponse.json({ success: false, error: 'Courses unavailable' }, { status: 404 });
        }

        // 2. Calculate Totals (Pre-discount)
        const subtotal = courses.reduce((sum, course) => sum + course.price, 0);
        let discountAmount = 0;
        let couponId = null;

        // 3. Apply Coupon if provided
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

        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * TAX_RATE;
        const finalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

        // 4. User Identity Resolution
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
                    update: { name, phone, courseIds: courseIdArray },
                    create: { email, name, phone, courseIds: courseIdArray, source: 'checkout' }
                });
                targetLeadId = lead.id;
            }
        }

        const orderId = `ORDER_CF_${uuidv4()}`;

        // 5. Create Pending Order
        await dataBasePrisma.order.create({
            data: {
                orderId,
                userId: targetUserId,
                leadId: targetLeadId,
                guestEmail: email,
                guestPhone: phone,
                totalAmount: finalAmount,
                discountAmount: discountAmount, // Store discount
                couponId: couponId,             // Store coupon ID
                status: 'PENDING',
                items: {
                    create: courses.map((c) => ({
                        courseId: c.id,
                        price: c.price
                    }))
                }
            }
        });

        // 6. Cashfree Initiation
        const cashfreeRes = await createCashfreeOrder(orderId, finalAmount, { name, email, phone });
        console.log("Courses:");

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