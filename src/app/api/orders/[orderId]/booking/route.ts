import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { batchDisplay } from "@/lib/batches/display";
import { groupLinkFor } from "@/lib/batches/messaging";

export const dynamic = "force-dynamic";

// Thank-you page data. Links appear only once the order is PAID; no email,
// phone or name is ever returned.
export async function GET(_req: Request, context: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await context.params;

    const order = await dataBasePrisma.order.findUnique({
        where: { orderId },
        select: {
            id: true,
            status: true,
            items: { select: { batchId: true, batch: true } },
        },
    });
    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const batchItem = order.items.find((item) => item.batchId && item.batch);
    if (!batchItem?.batch) {
        return NextResponse.json(
            { status: order.status, isBatchOrder: false },
            { headers: { "Cache-Control": "no-store" } },
        );
    }

    const base = {
        status: order.status,
        isBatchOrder: true,
        batch: batchDisplay(batchItem.batch),
    };
    if (order.status !== "PAID") {
        return NextResponse.json(base, { headers: { "Cache-Control": "no-store" } });
    }

    const registration = await dataBasePrisma.batchRegistration.findUnique({
        where: { orderId: order.id },
        select: { zohoState: true, joinLinkDay1: true, joinLinkDay2: true },
    });

    return NextResponse.json(
        {
            ...base,
            zohoState: registration?.zohoState ?? "PENDING",
            joinLinkDay1: registration?.joinLinkDay1 ?? null,
            joinLinkDay2: registration?.joinLinkDay2 ?? null,
            whatsappGroupLink: await groupLinkFor(batchItem.batch),
        },
        { headers: { "Cache-Control": "no-store" } },
    );
}
