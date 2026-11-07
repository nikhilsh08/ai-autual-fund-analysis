import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { runBatchesJob } from "@/lib/batches/jobs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    if (!isCronAuthorized(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const report = await runBatchesJob();
        return NextResponse.json({ ok: true, ...report });
    } catch (error) {
        console.error("[cron:batches] failed", error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
