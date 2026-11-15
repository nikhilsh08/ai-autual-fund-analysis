import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
