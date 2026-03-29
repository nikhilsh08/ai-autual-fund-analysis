import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { getDateRange, formatDate } from "@/lib/analytics-helper";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || 'week'; // default to week? snippet says 'week'

        const { start, end } = getDateRange(period);

        // Aggregate stats
        // Count users created in range
        const totalRegistrations = await dataBasePrisma.user.count({
            where: { createdAt: { gte: start, lte: end } }
        });

        // Completed payments: Orders with status PAID in range? Or Users with purchase?
        // Snippet aggregates User.transaction=true/false and sums User.Value. It seems User model in snippet has Value field.
        // Our schema: Order has totalAmount.
        // completedPayments count from Orders (PAID)
        const paidOrders = await dataBasePrisma.order.findMany({
            where: {
                status: "PAID",
                createdAt: { gte: start, lte: end }
            },
            select: { totalAmount: true }
        });

        const completedPaymentsCount = paidOrders.length;
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        // Pending payments
        const pendingPaymentsCount = await dataBasePrisma.order.count({
            where: {
                status: "PENDING",
                createdAt: { gte: start, lte: end }
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                completedPayments: completedPaymentsCount,
                pendingPayments: pendingPaymentsCount,
                totalRevenue: totalRevenue, // Snippet divided by 100 on frontend/backend mismatch? 
                // Snippet says: result.totalRevenue / 100. If stored in cents, yes. Float implies actual value?
                // Our schema uses Float for price. Assuming it's actual value. I will return actual value.
                totalRegistrations
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
