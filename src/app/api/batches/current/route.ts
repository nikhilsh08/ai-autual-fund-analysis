import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { getCurrentBatch } from "@/lib/batches/current";
import { batchDisplay } from "@/lib/batches/display";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const courseId = new URL(req.url).searchParams.get("courseId");
    if (!courseId) {
        return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const course = await dataBasePrisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, useBatches: true },
    });
    if (!course || !course.useBatches) {
        return NextResponse.json({ onSale: false }, { status: 404 });
    }

    const batch = await getCurrentBatch(course.id);
    if (!batch) {
        return NextResponse.json({ onSale: false }, { status: 404 });
    }

    return NextResponse.json(
        { onSale: true, batch: batchDisplay(batch) },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
}
