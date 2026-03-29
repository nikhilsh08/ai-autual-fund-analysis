import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { courseId } = await params;

        if (!courseId) {
            return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
        }

        const notifications = await dataBasePrisma.notificationRequest.findMany({
            where: {
                courseId: courseId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error("Get notifications error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
