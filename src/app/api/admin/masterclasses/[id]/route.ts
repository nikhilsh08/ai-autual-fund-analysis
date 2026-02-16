import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { id } = await params;

        // Check if ID is 'myclasses' or 'all-classes'? No, looking at routes, those are separate.
        // This is /masterclasses/:id -> fetch single.

        const course = await dataBasePrisma.course.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!course) {
            return NextResponse.json({ message: "Masterclass not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            course
        });

    } catch (error) {
        console.error("Get masterclass error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
