import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { buildIcs } from "@/lib/batches/ics";
import { addMinutes } from "@/lib/ist";

export const dynamic = "force-dynamic";

const SUMMARY = "Master Mutual Funds — live workshop";
const PREP = "You need a stable internet connection and a computer, tablet or phone with audio.";

// Join links go into the description only when ?order= names a PAID order
// for this batch.
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const orderRef = new URL(req.url).searchParams.get("order");

    const batch = await dataBasePrisma.batch.findUnique({ where: { id } });
    if (!batch) {
        return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    let joinLinkDay1: string | null = null;
    let joinLinkDay2: string | null = null;
    if (orderRef) {
        const order = await dataBasePrisma.order.findUnique({
            where: { orderId: orderRef },
            select: { id: true, status: true, items: { select: { batchId: true } } },
        });
        const paidForBatch = order?.status === "PAID" && order.items.some((item) => item.batchId === batch.id);
        if (paidForBatch && order) {
            const registration = await dataBasePrisma.batchRegistration.findUnique({
                where: { orderId: order.id },
                select: { joinLinkDay1: true, joinLinkDay2: true },
            });
            joinLinkDay1 = registration?.joinLinkDay1 ?? null;
            joinLinkDay2 = registration?.joinLinkDay2 ?? null;
        }
    }

    const describe = (link: string | null) => (link ? `Join link: ${link}\n${PREP}` : PREP);

    const ics = buildIcs([
        {
            uid: `mmf-${batch.id}-day1@cashflowcrew.in`,
            start: batch.day1StartAt,
            end: addMinutes(batch.day1StartAt, batch.durationMinutes),
            summary: `${SUMMARY} (Day 1)`,
            description: describe(joinLinkDay1),
            url: joinLinkDay1 ?? undefined,
        },
        {
            uid: `mmf-${batch.id}-day2@cashflowcrew.in`,
            start: batch.day2StartAt,
            end: addMinutes(batch.day2StartAt, batch.durationMinutes),
            summary: `${SUMMARY} (Day 2)`,
            description: describe(joinLinkDay2),
            url: joinLinkDay2 ?? undefined,
        },
    ]);

    return new NextResponse(ics, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="master-mutual-funds-batch-${batch.batchNumber}.ics"`,
            "Cache-Control": "no-store",
        },
    });
}
