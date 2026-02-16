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
        const period = searchParams.get('period') || '7d';
        const { start, end } = getDateRange(period);

        // We can't use complex MongoDB aggregation pipelines directly in Prisma.
        // We fetch raw data or group by.
        // Grouping by date in Prisma is tricky without raw query.
        // Fetching all orders/users in range and aggregating in JS is safer for portability if dataset is not huge.
        // If dataset is huge, raw SQL/Mongo query is needed. Using finding all for now.

        const users = await dataBasePrisma.user.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: { createdAt: true }
        });

        const orders = await dataBasePrisma.order.findMany({
            where: { createdAt: { gte: start, lte: end }, status: "PAID" },
            select: { createdAt: true, totalAmount: true }
        });

        // Group in JS
        const trendMap = new Map<string, any>();

        const addToMap = (date: Date, data: any) => {
            const key = date.toISOString().split('T')[0]; // Daily grouping
            if (!trendMap.has(key)) {
                trendMap.set(key, { date: key, registrations: 0, revenue: 0, successfulPayments: 0 });
            }
            const entry = trendMap.get(key);
            if (data.type === 'registration') entry.registrations++;
            if (data.type === 'payment') {
                entry.successfulPayments++;
                entry.revenue += data.amount;
            }
        };

        users.forEach(u => addToMap(u.createdAt, { type: 'registration' }));
        orders.forEach(o => addToMap(o.createdAt, { type: 'payment', amount: o.totalAmount }));

        const trends = Array.from(trendMap.values())
            .map(t => ({
                ...t,
                averageRevenue: t.successfulPayments > 0 ? t.revenue / t.successfulPayments : 0
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({
            success: true,
            trends,
            period
        });

    } catch (error) {
        console.error("Registration trends error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
