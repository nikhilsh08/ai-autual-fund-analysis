import { NextResponse } from "next/server";
import { signOut } from "@/server/auth/auth";

// POST /api/admin/logout — ends the admin panel's session by clearing the
// session cookie. The panel runs on another domain, so it cannot clear an
// httpOnly cookie itself, and Auth.js's own /api/auth/signout needs a CSRF
// cookie the browser does not send across domains.
//
// No admin check: clearing your own cookie is always allowed. Middleware
// already refuses this POST from any website other than the panel and this
// site, so another site cannot sign an admin out.
export async function POST() {
    try {
        await signOut({ redirect: false });
    } catch (error) {
        console.error("Admin logout error:", error);
        return NextResponse.json({ message: "Could not sign out" }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
