import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { AdminError, batchPatchSchema, patchBatch } from "@/lib/batches/admin";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const { id } = await context.params;
    const parsed = batchPatchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid fields", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    try {
        const batch = await patchBatch(id, parsed.data);
        return NextResponse.json({ success: true, batch });
    } catch (error) {
        if (error instanceof AdminError) return NextResponse.json({ message: error.message }, { status: error.status });
        console.error("[admin:batches] patch failed", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
