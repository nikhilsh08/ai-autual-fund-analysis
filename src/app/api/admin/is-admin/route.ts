import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/lib/dbPrisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await dataBasePrisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.role !== "ADMIN") {
            return NextResponse.json({ message: "Access denied. Admin privileges required." }, { status: 403 });
        }

        return NextResponse.json({
            message: "User is an admin",
            isAdmin: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ").slice(1).join(" ") || "",
                role: "admin", // Map to lowercase as requested? standardizing on role
            },
        });
    } catch (error) {
        console.error("Admin check error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
