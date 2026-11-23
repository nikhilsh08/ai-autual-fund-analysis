import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";
import { CourseType } from "@prisma/client";
import { getLandingCourse, landingPageByCourseId } from "@/lib/landing/course-link";
import { isLandingPageKey } from "@/lib/landing/sources";

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
            "staticRoute", "visibility", "duration", "content"];
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

        // Sold in batches: changed only when a real true/false is sent, so an
        // older admin form that does not know the field cannot switch it off.
        if (typeof body.useBatches === "boolean") {
            updateData.useBatches = body.useBatches;
            if (!body.useBatches) {
                // Turning it off while a batch is on sale would take the workshop
                // landing page (/v10, /v20) off sale without warning.
                const openBatches = await dataBasePrisma.batch.count({ where: { courseId: masterclassId, status: "OPEN" } });
                if (openBatches > 0) {
                    return NextResponse.json(
                        { message: "This course has an open batch. Close it in Batches before turning off 'Sold in batches'." },
                        { status: 409 },
                    );
                }
            }
        }
        // Workshop landing page link. "v10" | "v20" | "v30" links this course
        // to that page (one course per page); "none" / "" unlinks it.
        if ("landingPage" in body) {
            const current = (await landingPageByCourseId()).get(masterclassId) ?? null;
            const next = isLandingPageKey(body.landingPage) ? body.landingPage : null;
            if (next !== current) {
                // Moving or removing the link while a batch is on sale would
                // take that page off sale (or move the sale) without warning.
                const openOnPage = await dataBasePrisma.batch.count({ where: { courseId: masterclassId, status: "OPEN" } });
                if (current && openOnPage > 0) {
                    return NextResponse.json(
                        { message: `This course has an open batch on /${current}. Close it in Batches before changing its landing page.` },
                        { status: 409 },
                    );
                }
                if (next) {
                    const taken = await getLandingCourse(next);
                    if (taken && taken.id !== masterclassId) {
                        return NextResponse.json(
                            { message: `/${next} is already linked to "${taken.title}". Unlink it there first (set its landing page to None).` },
                            { status: 409 },
                        );
                    }
                    updateData.landingPage = next;
                    updateData.useBatches = true;
                } else {
                    // "none" (not null): a course found by its old slug stays unlinked.
                    updateData.landingPage = "none";
                }
            } else if (next) {
                // Same link: store it explicitly (older courses were linked by slug).
                updateData.landingPage = next;
                updateData.useBatches = true;
            }
        }
        // An empty TrainerCentral ID would break the unique index; keep the old one.
        if ("tcCourseId" in updateData && !updateData.tcCourseId) delete updateData.tcCourseId;

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
