import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { dataBasePrisma } from "@/lib/dbPrisma";
import { registerInZohoWebinar } from "@/lib/zoho-webinar";
import { sendConfirmation } from "@/lib/batches/messaging";

export const dynamic = "force-dynamic";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });

    const { id } = await context.params;
    const exists = await dataBasePrisma.batchRegistration.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return NextResponse.json({ message: "Registration not found" }, { status: 404 });

    await registerInZohoWebinar(id);
    await sendConfirmation(id);

    const registration = await dataBasePrisma.batchRegistration.findUnique({
        where: { id },
        select: {
            id: true,
            zohoState: true,
            zohoAttempts: true,
            zohoLastError: true,
            joinLinkDay1: true,
            joinLinkDay2: true,
            msgConfirmationAt: true,
        },
    });
    if (!registration) return NextResponse.json({ message: "Registration not found" }, { status: 404 });

    const { joinLinkDay1, joinLinkDay2, ...rest } = registration;
    return NextResponse.json({
        success: true,
        registration: { ...rest, joinLinkPresent: Boolean(joinLinkDay1 && joinLinkDay2) },
    });
}
