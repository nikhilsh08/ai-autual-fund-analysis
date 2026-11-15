import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { CourseType } from "@prisma/client";
import { getLandingCourse } from "@/lib/landing/course-link";
import { isLandingPageKey } from "@/lib/landing/sources";

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
            staticRoute, visibility,duration,content,
        } = body;
        // Sold in batches (a workshop landing page such as /v10 or /v20). Batch
        // courses register buyers with Zoho Webinar, not TrainerCentral, so the
        // TrainerCentral course ID is optional for them.
        // Workshop landing page link ("v10" | "v20" | "v30"): one course per
        // page. A linked course is always sold in batches.
        const landingPage = isLandingPageKey(body.landingPage) ? body.landingPage : null;
        const useBatches = body.useBatches === true || landingPage !== null;
        if (!title || typeof title !== "string") {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        if (landingPage) {
            const taken = await getLandingCourse(landingPage);
            if (taken) {
                return NextResponse.json(
                    { message: `/${landingPage} is already linked to "${taken.title}". Unlink it there first (set its landing page to None).` },
                    { status: 409 },
                );
            }
        }
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
        if (!title || !price || (!tcCourseId && !useBatches) || !categoryId) {
            console.log("Missing required fields", !title || !price || (!tcCourseId && !useBatches) || !categoryId)
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
                content,
                originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
                thumbnail,
                type: type as CourseType || "RECORDED",
                slug,
                // tcCourseId is required and unique in the schema; batch courses
                // without one get a placeholder (TrainerCentral is skipped for them
                // in payment.action.ts).
                tcCourseId: tcCourseId || `batch-${slug}`,
                tcCourseUrl,
                useBatches,
                landingPage,
                startDate: startDate ? new Date(startDate) : undefined,
                maxSeats: maxSeats ? parseInt(maxSeats) : undefined,
                categoryId,
                isPublished: true, // Default to true?
                duration,
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
