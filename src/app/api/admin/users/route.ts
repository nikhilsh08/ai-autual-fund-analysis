import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin"; // Optional if strictly following user snippet (middleware there)

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const users = await dataBasePrisma.user.findMany({
            where: { role: "USER" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Exclude password
            }
        });

        return NextResponse.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get users error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
