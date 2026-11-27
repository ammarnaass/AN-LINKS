import { NextResponse } from "next/server";
import { prisma } from "@/shared/db";

/**
 * Liveness & readiness healthcheck endpoint for container orchestrators and uptime probes.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        storageConfigured: Boolean(process.env.S3_BUCKET && process.env.S3_ENDPOINT),
        authConfigured: Boolean(process.env.NEXTAUTH_SECRET || process.env.NODE_ENV !== "production"),
        latencyMs: Date.now() - startedAt,
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("Healthcheck database probe failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
}
