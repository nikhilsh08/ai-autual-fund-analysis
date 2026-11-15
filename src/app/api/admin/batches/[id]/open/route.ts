import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { AdminError, openBatch } from "@/lib/batches/admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const { id } = await context.params;
    // { force: true } = "Open anyway": skips only the Zoho / WhatsApp requirement.
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;
    try {
        const batch = await openBatch(id, new Date(), { force });
        if (force) console.warn(`[admin:batches] batch ${id} opened without Zoho/WhatsApp setup`);
        return NextResponse.json({ success: true, batch });
    } catch (error) {
        if (error instanceof AdminError) {
            return NextResponse.json({ message: error.message, canForce: error.canForce }, { status: error.status });
        }
        console.error("[admin:batches] open failed", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
