import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");

    const allowedOrigins = [
        "http://localhost:5173",
        "https://www.cashflowcrew.in",
        "https://ai-mutual-fund-analysis.vercel.app",
        "https://admin-cashflowcrew-othh.vercel.app",
        "https://admin-cashflowcrew.vercel.app",
        // The admin panel hosted on Render (testing before go-live).
        "https://admin-cashflowcrew.onrender.com",
        process.env.ADMIN_PANNEL_URL
    ];

    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // Dynamic headers based on what the client requests, plus defaults
    const defaultHeaders = "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, x-uploadthing-package, x-uploadthing-version, x-uploadthing-fe-package, b3, traceparent, uploadthing-hook";

    // Admin writes are accepted only from the admin panel or from this site.
    // The admin session cookie is SameSite=None (the panel is on another
    // domain), so without this check any website an admin visits could send a
    // POST carrying that cookie: close the batch on sale, create a coupon.
    // Requests with no Origin header (scripts, server-to-server) carry no
    // browser cookie and are left to the route's own admin check.
    const isAdminWrite =
        request.nextUrl.pathname.startsWith("/api/admin/") && !["GET", "HEAD", "OPTIONS"].includes(request.method);
    if (isAdminWrite && origin && !isAllowedOrigin && origin !== request.nextUrl.origin) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

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
        // Matches every route except Next static assets. This middleware only
        // adds CORS headers; it does not authenticate anything. Admin routes
        // enforce auth themselves (verifyAdmin / auth()).
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ],
};
