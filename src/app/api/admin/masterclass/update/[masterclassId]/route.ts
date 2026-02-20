import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function PUT(
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

        // Remove immutable fields if necessary, or trusted admin input
        const updateData: any = { ...body };
        if (body.price) updateData.price = parseFloat(body.price);
        if (body.originalPrice) updateData.originalPrice = parseFloat(body.originalPrice);
        if (body.startDate) updateData.startDate = new Date(body.startDate);

        // Prevent unique constraint collision if staticRoute is sent as empty string
        if (updateData.staticRoute === "") {
            updateData.staticRoute = undefined; // Prisma will ignore updating it
            // Ideally if we want to unset it, we'd use null or unset, but undefined is safer if they just left it blank
        }

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

    } catch (error) {
        console.error("Update masterclass error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
