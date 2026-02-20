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
            title, subHeading, status, description, price, originalPrice,
            thumbnail, type, tcCourseId,
            tcCourseUrl, startDate, maxSeats, categoryId,
            staticRoute, visibility
        } = body;
        let slug = title.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        let uniqueSlug = slug;
        let count = 1;

        while (await dataBasePrisma.course.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${count}`;
            count++;
        }

        slug = uniqueSlug;
        console.log(title,price,tcCourseId,categoryId)

        // Validation
        if (!title || !price || !tcCourseId || !categoryId) {
            console.log("Missing required fields", !title || !price || !tcCourseId || !categoryId)
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        console.log(staticRoute, "static route")
        const newCourse = await dataBasePrisma.course.create({
            data: {
                title,
                subHeading,
                status,
                description,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
                thumbnail,
                type: type as CourseType || "RECORDED",
                slug,
                tcCourseId,
                tcCourseUrl,
                startDate: startDate ? new Date(startDate) : undefined,
                maxSeats: maxSeats ? parseInt(maxSeats) : undefined,
                categoryId,
                isPublished: true, // Default to true?
                staticRoute: staticRoute || undefined,
                visibility: visibility || "show"


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
