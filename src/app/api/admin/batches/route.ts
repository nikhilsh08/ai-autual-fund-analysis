import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { AdminError, batchCreateSchema, createBatch, listBatches } from "@/lib/batches/admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const courseId = new URL(req.url).searchParams.get("courseId");
    const batches = await listBatches(courseId);
    return NextResponse.json({ success: true, batches });
}

export async function POST(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const parsed = batchCreateSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid batch", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    try {
        const batch = await createBatch(parsed.data, admin.id);
        return NextResponse.json({ success: true, batch }, { status: 201 });
    } catch (error) {
        if (error instanceof AdminError) return NextResponse.json({ message: error.message }, { status: error.status });
        console.error("[admin:batches] create failed", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
