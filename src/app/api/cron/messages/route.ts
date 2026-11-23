import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import { runMessagesJob } from "@/lib/batches/jobs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    if (!isCronAuthorized(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const report = await runMessagesJob();
        return NextResponse.json({ ok: true, ...report });
    } catch (error) {
        console.error("[cron:messages] failed", error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
