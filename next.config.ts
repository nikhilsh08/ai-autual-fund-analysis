import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The workshop landing route reads its HTML template from disk at request
  // time; make sure the file ships with the serverless function on Vercel.
  outputFileTracingIncludes: {
    "/master-mutual-funds": ["./src/landing/**/*"],
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
