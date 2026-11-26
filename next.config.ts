import type { NextConfig } from "next";

// Ensure DATABASE_URL is set in environments (like Vercel with Prisma Console)
// where it might be provided under DATABASE_URL_POOLED, POSTGRES_URL, or PRISMA_DATABASE_URL
if (!process.env.DATABASE_URL) {
  const fallback =
    process.env.DATABASE_URL_POOLED ||
    process.env.POSTGRES_URL ||
    process.env.PRISMA_DATABASE_URL;
  if (fallback) {
    process.env.DATABASE_URL = fallback;
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
