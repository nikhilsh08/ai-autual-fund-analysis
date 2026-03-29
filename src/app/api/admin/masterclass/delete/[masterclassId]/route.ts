import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { verifyAdmin } from "@/lib/auth-admin";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ masterclassId: string }> }
) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        const { masterclassId } = await params;

        await dataBasePrisma.course.delete({
            where: { id: masterclassId }
        });

        return NextResponse.json({
            success: true,
            message: "Masterclass deleted successfully"
        });

    } catch (error) {
        console.error("Delete masterclass error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
