import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("authjs.session-token")?.value;
    console.log("Token:", token);
    const origin = request.headers.get("origin");
    console.log("Origin:", origin);

    const allowedOrigins = [
        "http://localhost:5173",
        "https://www.cashflowcrew.in",
        "https://ai-mutual-fund-analysis.vercel.app",
    ];

    // Handle preflight requests
    if (request.method === "OPTIONS") {
        const response = new NextResponse(null, { status: 200 });

        if (origin && allowedOrigins.includes(origin)) {
            response.headers.set("Access-Control-Allow-Origin", origin);
        } else {
            // If origin is not in allowed list, you might check if correct or just set null/default.
            // For security, strictly checking allowedOrigins is best.
            // However, if origin is null (e.g. server-to-server), we generally don't set AC headers or set * if public.
            // Assuming strict mode for specified origins.
        }

        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version"
        );
        response.headers.set("Access-Control-Max-Age", "86400");
        response.headers.set("Access-Control-Allow-Credentials", "true");

        return response;
    }

    const response = NextResponse.next();

    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version"
        );
    }

    return response;
}

export const config = {
    matcher: "/api/:path*",
};
