import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { getDateRange } from "@/lib/analytics-helper";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || 'month';
        const { start, end } = getDateRange(period);

        // 1. Payment Status Counts
        const paidCount = await dataBasePrisma.order.count({ where: { status: "PAID", createdAt: { gte: start, lte: end } } });
        const pendingCount = await dataBasePrisma.order.count({ where: { status: "PENDING", createdAt: { gte: start, lte: end } } });
        const failedCount = await dataBasePrisma.order.count({ where: { status: "FAILED", createdAt: { gte: start, lte: end } } });

        // Revenue sum
        const paidOrders = await dataBasePrisma.order.findMany({
            where: { status: "PAID", createdAt: { gte: start, lte: end } },
            select: { totalAmount: true }
        });
        const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);

        const paymentStatus = [
            { _id: true, count: paidCount, totalValue: totalRevenue }, // "true" maps to transaction=true in snippet
            { _id: false, count: pendingCount + failedCount, totalValue: 0 } // "false" maps to pending
        ];

        // 2. Revenue By Day
        // Reuse JS grouping logic
        const revenueMap = new Map<string, number>();
        const orders = await dataBasePrisma.order.findMany({
            where: { status: "PAID", createdAt: { gte: start, lte: end } },
            select: { createdAt: true, totalAmount: true }
        });

        orders.forEach(o => {
            const key = o.createdAt.toISOString().split('T')[0];
            revenueMap.set(key, (revenueMap.get(key) || 0) + o.totalAmount);
        });

        const revenueByDay = Array.from(revenueMap.entries())
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // 3. Top Users
        // This is hard without aggregation.
        // Fetch all users with Paid orders and sort manually?
        // Or fetch top orders.
        // Let's fetch top 10 orders by amount? No, top users by total spend.
        // For scalability this is bad in JS. But for now...
        // We can query "Users with Purchases" and summing up orders.
        // Or just top single orders as a proxy if we assume one course per user mostly.
        // Let's grab orders, group by user, sum, sort.

        // Actually, `groupBy` is supported in Prisma for basic aggregations!
        // await prisma.order.groupBy({ by: ['userId'], _sum: { totalAmount: true }, orderBy: ... })

        const topSpenders = await dataBasePrisma.order.groupBy({
            by: ['userId'],
            where: { status: "PAID", userId: { not: null } },
            _sum: { totalAmount: true },
            orderBy: { _sum: { totalAmount: 'desc' } },
            take: 5
        });

        // Fetch user details for these IDs
        const topUserIds = topSpenders.map(i => i.userId).filter(id => id !== null) as string[];
        const topUsersDetails = await dataBasePrisma.user.findMany({
            where: { id: { in: topUserIds } },
            select: { id: true, name: true, email: true, sessions: { select: { id: true } } } // Sessions count needed?
        });

        const topUsers = topSpenders.map(s => {
            const user = topUsersDetails.find(u => u.id === s.userId);
            return {
                name: user?.name || "Unknown",
                email: user?.email || "",
                amount: s._sum.totalAmount || 0,
                sessions: user?.sessions.length || 0 // Proxy for 'totalSessionAttended'
            };
        });

        return NextResponse.json({
            success: true,
            analytics: {
                paymentStatus,
                revenueByDay,
                topUsers
            }
        });

    } catch (error) {
        console.error("Payment analytics error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
