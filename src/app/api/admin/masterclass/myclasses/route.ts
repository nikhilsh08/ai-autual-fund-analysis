import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        // "myclasses" - for now, same as all classes
        const courses = await dataBasePrisma.course.findMany({
            orderBy: { createdAt: "desc" },
            include: { category: true }
        });

        return NextResponse.json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        console.error("Get my masterclasses error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
