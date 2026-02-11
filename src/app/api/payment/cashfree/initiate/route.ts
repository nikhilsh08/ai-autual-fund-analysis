import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createCashfreeOrder } from '@/server/actions/payment.action';
import { currentUser } from '@/lib/authDetails';
import { dataBasePrisma } from '@/lib/dbPrisma';

// Tax configuration
const TAX_RATE = 0.18; // 18% GST

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, courseIds } = body; // Remove amount from frontend

        // Validation
        if (!name || !email || !phone || !courseIds) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Ensure courseIds is an array
        const courseIdArray = Array.isArray(courseIds) ? courseIds : [courseIds];

        if (courseIdArray.length === 0) {
            return NextResponse.json(
                { success: false, error: 'At least one course must be selected' },
                { status: 400 }
            );
        }

        // fetch courses for price calculation and validation
        const courses = await dataBasePrisma.course.findMany({
            where: {
                id: { in: courseIdArray },
                isPublished: true // Only allow published courses
            },
            select: {
                id: true,
                title: true,
                price: true,
                type: true,
                maxSeats: true,
                seatsSold: true
            }
        });

        // Validate all courses exist
        if (courses.length !== courseIdArray.length) {
            return NextResponse.json(
                { success: false, error: 'One or more courses not found or unavailable' },
                { status: 404 }
            );
        }

        // Check seat availability for LIVE courses
        for (const course of courses) {
            if (course.type === 'LIVE') {
                if (course.maxSeats && course.seatsSold >= course.maxSeats) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: `Course "${course.title}" is sold out`
                        },
                        { status: 400 }
                    );
                }
            }
        }

        const subtotal = courses.reduce((sum: any, course: any) => sum + course.price, 0);
        const taxAmount = subtotal * TAX_RATE;
        const totalAmount = subtotal + taxAmount;

        const finalAmount = Math.round(totalAmount * 100) / 100;

        const orderId = `ORDER_CF_${uuidv4()}`;
        const user = await currentUser();

        // Save Lead or Order data
        if (!user) {
            const existingLead = await dataBasePrisma.lead.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    courseIds: true
                }
            });

            if (existingLead) {
                await dataBasePrisma.lead.update({
                    where: { email: email },
                    data: {
                        name: name,
                        phone: phone,
                        courseIds: {
                            set: [...new Set([...existingLead.courseIds, ...courseIdArray])]
                        }
                    }
                });
            } else {
                await dataBasePrisma.lead.create({
                    data: {
                        name: name,
                        email: email,
                        phone: phone,
                        courseIds: courseIdArray,
                        source: 'payment_page'
                    }
                });
            }

            // Create pending order for guest
            await dataBasePrisma.order.create({
                data: {
                    leadId: existingLead?.id,
                    guestEmail: email,
                    guestPhone: phone,
                    totalAmount: finalAmount,
                    status: 'PENDING',
                    orderId: orderId,
                    items: {
                        create: courses.map((course: any) => ({
                            courseId: course.id,
                            price: course.price
                        }))
                    }
                }
            });
        }
        // Create Cashfree payment
        const cashfreePaymentRes = await createCashfreeOrder(orderId, finalAmount, {
            name: name,
            email: email,
            phone: phone,
        });

        console.log("cashfreePaymentRes", cashfreePaymentRes);

        return NextResponse.json({
            success: true,
            message: "Payment initiated successfully",
            orderId: orderId,
            priceBreakdown: {
                subtotal: subtotal,
                tax: taxAmount,
                taxRate: `${TAX_RATE * 100}%`,
                total: finalAmount,
                courses: courses.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    price: c.price
                }))
            },
            paymentSession: cashfreePaymentRes
        });

    } catch (error) {
        console.error("Payment initiation error:", error);
        return NextResponse.json(
            { success: false, error: 'Failed to initiate payment' },
            { status: 500 }
        );
    }
}