import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        // 1. Total & Stats
        // Schema has 'Session' (Auth sessions). We use this as proxy for "Sessions Attended" or "Activity".
        // Or we use 0 if irrelevant.
        // Let's count Auth sessions per user.

        // Group by user to get distribution
        const sessionCounts = await dataBasePrisma.session.groupBy({
            by: ['userId'],
            _count: {
                userId: true // Number of sessions per user
            }
        });

        const totalSessions = sessionCounts.reduce((acc, curr) => acc + curr._count.userId, 0);
        const usersWithSessions = sessionCounts.length; // Distinct users with at least 1 session
        const avgSessions = usersWithSessions > 0 ? totalSessions / usersWithSessions : 0;
        const maxSessions = Math.max(...sessionCounts.map(s => s._count.userId), 0);

        // Distribution (Bucket)
        // 0, 1, 3, 5, 10, 20+
        const distributionMap = { '0': 0, '1': 0, '3': 0, '5': 0, '10': 0, '20+': 0 };

        // We need to account for users with 0 sessions (all users - usersWithSessions)
        const totalUsersCount = await dataBasePrisma.user.count();
        distributionMap['0'] = totalUsersCount - usersWithSessions;

        sessionCounts.forEach(s => {
            const count = s._count.userId;
            if (count >= 20) distributionMap['20+']++;
            else if (count >= 10) distributionMap['10']++;
            else if (count >= 5) distributionMap['5']++;
            else if (count >= 3) distributionMap['3']++;
            else if (count >= 1) distributionMap['1']++;
        });

        // Format for frontend
        const distribution = [
            { _id: 0, count: distributionMap['0'] },
            { _id: 1, count: distributionMap['1'] },
            { _id: 3, count: distributionMap['3'] },
            { _id: 5, count: distributionMap['5'] },
            { _id: 10, count: distributionMap['10'] },
            { _id: 20, count: distributionMap['20+'] }
        ];

        return NextResponse.json({
            success: true,
            stats: {
                totalSessions,
                averageSessions: avgSessions,
                maxSessions,
                usersWithSessions
            },
            distribution
        });

    } catch (error) {
        console.error("Session analytics error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
