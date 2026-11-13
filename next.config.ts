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
