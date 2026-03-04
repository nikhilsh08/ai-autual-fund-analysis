import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ masterclassId: string }> }
) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { masterclassId } = await params;
        console.log(masterclassId, "masterclassId");

        if (!masterclassId) {
            return NextResponse.json({ message: "Masterclass ID is required" }, { status: 400 });
        }

        // Fetch course details with category string included
        const course = await dataBasePrisma.course.findUnique({
            where: { id: masterclassId },
            include: {
                category: true
            }
        });

        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        let notifications: any[] = [];
        let notificationsCount = 0;

        // If the course is upcoming, fetch the waitlist
        if (course.status === "Coming Soon") {
            const requests = await dataBasePrisma.notificationRequest.findMany({
                where: { courseId: masterclassId },
                orderBy: { createdAt: "desc" }
            });
            notifications = requests;
            notificationsCount = requests.length;
        }

        return NextResponse.json({
            success: true,
            course,
            waitlist: {
                count: notificationsCount,
                users: notifications
            }
        });

    } catch (error: any) {
        console.error("Get masterclass details error:", error?.message || error);
        return NextResponse.json({ message: error?.message || "Server error" }, { status: 500 });
    }
}
