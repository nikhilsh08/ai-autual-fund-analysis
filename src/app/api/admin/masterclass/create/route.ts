import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { CourseType } from "@prisma/client";

export async function POST(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const {
            title, description, price, originalPrice,
            thumbnail, type, theme, slug, tcCourseId,
            tcCourseUrl, startDate, maxSeats, categoryId
        } = body;

        // Validation
        if (!title || !price || !slug || !tcCourseId || !categoryId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newCourse = await dataBasePrisma.course.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                thumbnail,
                type: type as CourseType || "RECORDED",
                theme: theme || "standard",
                slug,
                tcCourseId,
                tcCourseUrl,
                startDate: startDate ? new Date(startDate) : null,
                maxSeats: maxSeats ? parseInt(maxSeats) : null,
                categoryId,
                isPublished: true // Default to true?
            }
        });

        return NextResponse.json({
            success: true,
            course: newCourse,
            message: "Masterclass created successfully"
        });

    } catch (error) {
        console.error("Create masterclass error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
