import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const LIMIT = 10;
const WINDOW_MS = 60_000;

// Same body and status for every email, whether or not the account exists or
// is an admin. The real admin check happens server-side on every /api/admin/*
// request and in GET /api/admin/session.
const GENERIC_RESPONSE = {
    message: "If this account has admin access, sign in to continue.",
};

export async function POST(req: Request) {
    const { ok, retryAfterSec } = rateLimit(`is-admin:${clientIp(req)}`, LIMIT, WINDOW_MS);
    if (!ok) {
        return NextResponse.json(
            { message: "Too many requests" },
            { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
        );
    }

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    return NextResponse.json(GENERIC_RESPONSE);
}
