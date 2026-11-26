import { PrismaClient } from "@prisma/client";

// Resolve database URL across various provider conventions (Prisma Cloud, Supabase, Neon, Vercel Postgres)
const resolvedDbUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_POOLED ||
  process.env.POSTGRES_URL ||
  process.env.PRISMA_DATABASE_URL;

if (resolvedDbUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDbUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedDbUrl
      ? {
          db: {
            url: resolvedDbUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
