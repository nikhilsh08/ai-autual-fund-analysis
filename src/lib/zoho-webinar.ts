import axios from "axios";
import { dataBasePrisma } from "@/lib/dbPrisma";

// Zoho Webinar REST API v2. Data centre comes from ZW_DC ("in" for India).
const dc = () => process.env.ZW_DC || "in";
const authUrl = () => `https://accounts.zoho.${dc()}/oauth/v2/token`;
const apiBase = () => `https://webinar.zoho.${dc()}/api/v2/${process.env.ZW_ORG_ID}`;

export function isZohoWebinarConfigured(): boolean {
    return Boolean(
        process.env.ZW_CLIENT_ID &&
        process.env.ZW_CLIENT_SECRET &&
        process.env.ZW_REFRESH_TOKEN &&
        process.env.ZW_ORG_ID,
    );
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

    const params = new URLSearchParams({
        refresh_token: process.env.ZW_REFRESH_TOKEN!,
        client_id: process.env.ZW_CLIENT_ID!,
        client_secret: process.env.ZW_CLIENT_SECRET!,
        grant_type: "refresh_token",
    });
    const response = await axios.post(authUrl(), params);
    cachedToken = response.data.access_token as string;
    tokenExpiresAt = Date.now() + 55 * 60 * 1000;
    return cachedToken;
}

// Same rules as TrainerCentral: Zoho rejects digits and symbols in names.
export function sanitizeName(raw: string): { firstName: string; lastName: string } {
    let name = raw?.trim() || "";
    if (name.includes("@")) name = name.split("@")[0];
    name = name.replace(/[.\-_0-9]/g, " ").replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim();
    const parts = name.split(" ").filter(Boolean);
    const firstName = parts[0] || "Attendee";
    const lastName = parts.slice(1).join(" ") || firstName;
    return { firstName, lastName };
}

interface ZohoRegistrant {
    email?: string;
    joinLink?: string;
}

function extractJoinLink(data: unknown, email: string): string | null {
    const d = data as Record<string, unknown> | ZohoRegistrant[] | null;
    const candidates: ZohoRegistrant[] = Array.isArray(d)
        ? d
        : ((d?.registrant as ZohoRegistrant[]) ?? (d?.registrants as ZohoRegistrant[]) ?? []);
    const match =
        candidates.find((r) => r.email?.toLowerCase() === email.toLowerCase() && r.joinLink) ??
        candidates.find((r) => r.joinLink);
    return match?.joinLink ?? null;
}

export interface RegisterInput {
    webinarKey: string;
    instanceId?: string | null;
    email: string;
    fullName: string;
}

// POST /api/v2/{zsoid}/register/{webinarKey}.json
// Body is an array under "registrant" (confirmed in Phase 0).
export async function registerAttendee(input: RegisterInput): Promise<string> {
    const token = await getAccessToken();
    const { firstName, lastName } = sanitizeName(input.fullName);
    const sendMail = (process.env.ZW_SEND_MAIL ?? "true") !== "false";

    const query = new URLSearchParams({ sendMail: String(sendMail) });
    if (input.instanceId) query.set("instanceId", input.instanceId);

    const url = `${apiBase()}/register/${input.webinarKey}.json?${query.toString()}`;
    const response = await axios.post(
        url,
        { registrant: [{ email: input.email, firstName, lastName }] },
        { headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" } },
    );

    const link = extractJoinLink(response.data, input.email);
    if (link) return link;

    // Duplicate registrations are not documented; fall back to the registrant
    // list so a second attempt for the same email still yields a link.
    const existing = await findExistingJoinLink(input.webinarKey, input.email, token);
    if (existing) return existing;

    throw new Error("zoho_no_join_link");
}

async function findExistingJoinLink(webinarKey: string, email: string, token: string): Promise<string | null> {
    try {
        const response = await axios.get(`${apiBase()}/registration/${webinarKey}`, {
            headers: { Authorization: `Zoho-oauthtoken ${token}` },
        });
        return extractJoinLink(response.data, email);
    } catch {
        return null;
    }
}

function shortError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const code = (error.response?.data as { code?: string; error?: string } | undefined)?.code;
        return `http_${status ?? "err"}${code ? `_${code}` : ""}`;
    }
    const message = error instanceof Error ? error.message : String(error);
    return message.slice(0, 80);
}

// Idempotent: a REGISTERED row is left alone. Failures are recorded on the
// row and never thrown, so payment confirmation is never blocked.
export async function registerInZohoWebinar(registrationId: string): Promise<void> {
    const registration = await dataBasePrisma.batchRegistration.findUnique({
        where: { id: registrationId },
        include: { batch: true },
    });
    if (!registration || registration.zohoState === "REGISTERED") return;

    const { batch } = registration;
    const fail = async (reason: string) => {
        await dataBasePrisma.batchRegistration.update({
            where: { id: registrationId },
            data: { zohoState: "FAILED", zohoAttempts: { increment: 1 }, zohoLastError: reason },
        });
        console.error(`[zoho] registration ${registrationId} failed: ${reason}`);
    };

    if (!batch.zohoWebinarKeyDay1 || !batch.zohoWebinarKeyDay2) {
        await fail("no_webinar_key");
        return;
    }
    if (!isZohoWebinarConfigured()) {
        await fail("zoho_not_configured");
        return;
    }

    try {
        const joinLinkDay1 =
            registration.joinLinkDay1 ??
            (await registerAttendee({
                webinarKey: batch.zohoWebinarKeyDay1,
                instanceId: batch.zohoInstanceIdDay1,
                email: registration.email,
                fullName: registration.name,
            }));
        // Persist day 1 immediately so a day-2 failure does not redo day 1.
        if (!registration.joinLinkDay1) {
            await dataBasePrisma.batchRegistration.update({
                where: { id: registrationId },
                data: { joinLinkDay1 },
            });
        }

        const joinLinkDay2 =
            registration.joinLinkDay2 ??
            (await registerAttendee({
                webinarKey: batch.zohoWebinarKeyDay2,
                instanceId: batch.zohoInstanceIdDay2,
                email: registration.email,
                fullName: registration.name,
            }));

        await dataBasePrisma.batchRegistration.update({
            where: { id: registrationId },
            data: { joinLinkDay1, joinLinkDay2, zohoState: "REGISTERED", zohoLastError: null },
        });
        console.log(`[zoho] registration ${registrationId} registered (order ${registration.orderId})`);
    } catch (error) {
        await fail(shortError(error));
    }
}
