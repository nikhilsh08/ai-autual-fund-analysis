import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");

    const allowedOrigins = [
        "http://localhost:5173",
        "https://www.cashflowcrew.in",
        "https://ai-mutual-fund-analysis.vercel.app",
        "https://admin-cashflowcrew-othh.vercel.app",
        process.env.ADMIN_PANNEL_URL
    ];

    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // Dynamic headers based on what the client requests, plus defaults
    const defaultHeaders = "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, x-uploadthing-package, x-uploadthing-version, x-uploadthing-fe-package, b3, traceparent, uploadthing-hook";

    // Handle preflight requests
    if (request.method === "OPTIONS") {
        const response = new NextResponse(null, { status: 200 });

        if (isAllowedOrigin) {
            const requestHeaders = request.headers.get("Access-Control-Request-Headers") || defaultHeaders;

            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Credentials", "true");
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", requestHeaders);
            response.headers.set("Access-Control-Max-Age", "86400");
        }

        return response;
    }

    // Handle standard requests
    const response = NextResponse.next();

    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", defaultHeaders);
    }

    return response;
}

export const config = {
    matcher: [
        // Match all API routes EXCEPT /api/uploadthing (UploadThing handles its own auth/CORS)
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ],
};
