import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { istYmd } from "@/lib/ist";
import { AdminError, batchSettingsSchema, settingsPreview, upsertBatchSettings } from "@/lib/batches/admin";

export const dynamic = "force-dynamic";

function present(settings: { anchorDay1Date: Date; cadenceDays: number } & Record<string, unknown>) {
    return { ...settings, anchorDay1Date: istYmd(settings.anchorDay1Date), preview: settingsPreview(settings) };
}

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const courseId = new URL(req.url).searchParams.get("courseId");
    const settings = await dataBasePrisma.batchSettings.findMany(courseId ? { where: { courseId } } : undefined);
    const courses = await dataBasePrisma.course.findMany({
        where: { useBatches: true },
        select: { id: true, title: true, slug: true },
    });

    return NextResponse.json({ success: true, settings: settings.map(present), courses });
}

export async function PUT(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const parsed = batchSettingsSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid settings", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    try {
        const settings = await upsertBatchSettings(parsed.data);
        return NextResponse.json({ success: true, settings: present(settings) });
    } catch (error) {
        if (error instanceof AdminError) return NextResponse.json({ message: error.message }, { status: error.status });
        console.error("[admin:batch-settings] save failed", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
