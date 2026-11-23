import type { NextConfig } from "next";
import { LANDING_PAGES, LANDING_PUBLIC_PATH } from "./src/lib/landing/sources";

// The site's own address: Cashfree returns the buyer to it after payment, and
// canonical links and the admin panel's landing page links are built from it.
// NEXT_PUBLIC_APP_URL wins when it is set. When it is not, a deployment on
// Render uses the address Render gives the service (RENDER_EXTERNAL_URL), so
// a test deployment never sends buyers to another site.
const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL;

const nextConfig: NextConfig = {
  ...(appUrl ? { env: { NEXT_PUBLIC_APP_URL: appUrl } } : {}),
  // Development only: lets the dev server's live-reload connection work when
  // the local site is shared through a VS Code port-forward link. Without it
  // Next.js blocks that connection and React pages keep reloading.
  allowedDevOrigins: ["**.devtunnels.ms"],
  // The workshop landing route reads its HTML template from disk at request
  // time; make sure the file ships with the serverless function on Vercel.
  outputFileTracingIncludes: {
    "/v10": ["./src/landing/**/*"],
    "/v20": ["./src/landing/**/*"],
    "/v20/checkout": ["./src/landing/**/*"],
    "/v20/thank-you": ["./src/landing/**/*"],
    "/v30": ["./src/landing/**/*"],
    "/v30/checkout": ["./src/landing/**/*"],
    "/v30/thank-you": ["./src/landing/**/*"],
    "/v30/refund-policy": ["./src/landing/**/*"],
  },
  // The addresses the workshop pages are advertised on (/personalfinance,
  // /personalfinance1, /personalfinance2) show the /v10, /v20 and /v30 pages
  // without changing the address in the browser. The pages under each one
  // (/personalfinance/checkout, /personalfinance/thank-you, ...) are served
  // the same way, so a buyer stays on the advertised address from the first
  // click to the thank-you page. The list is in src/lib/landing/sources.ts.
  async rewrites() {
    return LANDING_PAGES.flatMap((page) => [
      { source: LANDING_PUBLIC_PATH[page], destination: `/${page}` },
      { source: `${LANDING_PUBLIC_PATH[page]}/:path*`, destination: `/${page}/:path*` },
    ]);
  },
  // v20 static files, from the designer's _headers: images and the smooth-
  // scroll script are cached for a year (rename a file when it changes). The
  // v20 pages themselves are dynamic and set their own Cache-Control, because
  // they carry the live price, dates and seats.
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/mpf/assets/:path*", headers: immutable },
      { source: "/mpf/lenis.min.js", headers: immutable },
      // v30 (designer build v28): images, self-hosted fonts and lenis.min.js.
      { source: "/mpf30/assets/:path*", headers: immutable },
      { source: "/mpf30/fonts/:path*", headers: immutable },
      { source: "/mpf30/lenis.min.js", headers: immutable },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'y6aq91jvva.ufs.sh',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
