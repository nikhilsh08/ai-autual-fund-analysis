import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { CourseType } from "@prisma/client";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ masterclassId: string }> }
) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { masterclassId } = await params;
        const body = await req.json();

        // Build updateData with ONLY the fields the frontend explicitly sent
        // If a field is absent from body, it is NOT included → Prisma leaves it unchanged
        const updateData: Record<string, any> = {};

        // Nullable string fields — safe to set to null to clear them
        const nullableStringFields = ["subHeading", "description", "thumbnail",
            "status", "tcCourseId", "tcCourseUrl",
            "staticRoute", "visibility", "duration"];
        for (const field of nullableStringFields) {
            if (field in body) {
                updateData[field] = body[field] ?? null;
            }
        }

        // Required string fields — only update if a non-empty value is sent
        const requiredStringFields = ["title", "categoryId"];
        for (const field of requiredStringFields) {
            if (field in body && body[field]) {
                updateData[field] = body[field];
            }
        }

        // Enum: type must match CourseType (RECORDED | LIVE | HYBRID)
        if ("type" in body && body.type) {
            updateData.type = body.type as CourseType;
        }

        const boolFields = ["isPublished"];
        for (const field of boolFields) {
            if (field in body) updateData[field] = Boolean(body[field]);
        }

        if ("price" in body) updateData.price = parseFloat(body.price);
        if ("originalPrice" in body) updateData.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
        if ("maxSeats" in body) updateData.maxSeats = body.maxSeats ? parseInt(body.maxSeats) : null;
        if ("startDate" in body) updateData.startDate = body.startDate ? new Date(body.startDate) : null;

        console.log(updateData, "updateData — only fields sent by frontend");

        // Check existence
        const existing = await dataBasePrisma.course.findUnique({ where: { id: masterclassId } });
        if (!existing) {
            return NextResponse.json({ message: "Masterclass not found" }, { status: 404 });
        }

        const updatedCourse = await dataBasePrisma.course.update({
            where: { id: masterclassId },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            course: updatedCourse,
            message: "Masterclass updated successfully"
        });

    } catch (error: any) {
        console.error("Update masterclass error:", error?.message ?? error);
        return NextResponse.json({ message: error?.message ?? "Server error" }, { status: 500 });
    }
}
