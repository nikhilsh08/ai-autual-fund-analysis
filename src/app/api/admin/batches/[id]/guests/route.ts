import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { GUEST_CSV_HEADER, guestCsvRow, listGuests } from "@/lib/batches/admin";
import { toCsv } from "@/lib/batches/csv";

export const dynamic = "force-dynamic";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const { id } = await context.params;
    const params = new URL(req.url).searchParams;
    const batch = await dataBasePrisma.batch.findUnique({ where: { id }, select: { id: true, batchNumber: true } });
    if (!batch) return NextResponse.json({ message: "Batch not found" }, { status: 404 });

    const { rows, totals } = await listGuests(id, { search: params.get("search"), state: params.get("state") });

    if (params.get("format") === "csv") {
        return new NextResponse(toCsv(GUEST_CSV_HEADER, rows.map(guestCsvRow)), {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="batch-${batch.batchNumber}-guests.csv"`,
                "Cache-Control": "no-store",
            },
        });
    }

    return NextResponse.json(
        { success: true, batchNumber: batch.batchNumber, totals, guests: rows },
        { headers: { "Cache-Control": "no-store" } },
    );
}
