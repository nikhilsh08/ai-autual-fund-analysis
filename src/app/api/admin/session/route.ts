import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";

export async function GET(req: Request) {
    const admin = await verifyAdmin(req);
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const name = admin.name ?? "";
    const [firstName = "", ...rest] = name.split(" ");

    return NextResponse.json(
        {
            user: {
                id: admin.id,
                email: admin.email,
                name,
                firstName,
                lastName: rest.join(" "),
                role: "admin",
                isAdmin: true,
            },
        },
        { headers: { "Cache-Control": "no-store" } },
    );
}
