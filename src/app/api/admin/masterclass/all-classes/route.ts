import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { landingPageByCourseId } from "@/lib/landing/course-link";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        // "all-classes"
        const courses = await dataBasePrisma.course.findMany({
            orderBy: {
                status: 'asc'
            },

            include: { category: true }
        });

        // landingPage: the workshop page this course is linked to ("v10" |
        // "v20" | "v30") or null, including courses linked by their old slug.
        const pageByCourse = await landingPageByCourseId();
        const withLinks = courses.map((c) => ({ ...c, landingPage: pageByCourse.get(c.id) ?? null }));

        return NextResponse.json({
            success: true,
            count: courses.length,
            courses: withLinks // User snippet might expect "classes" or "masterclasses"? 
            // Snippet didn't show response of "allMasterclasses". 
            // Assuming "courses" or "classes". I'll stick to "courses" but maybe add "classes" alias too?
            // I'll return "courses" as it is standard in the project.
        });

    } catch (error) {
        console.error("Get all masterclasses error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
