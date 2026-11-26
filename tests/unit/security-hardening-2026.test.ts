import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  checkRateLimit,
  enforceRateLimit,
  getClientIp,
  resetRateLimitStore,
} from "@/lib/rate-limiter";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as analyticsExportGet } from "@/app/api/analytics/export/route";
import { middleware } from "@/middleware";
import { prisma } from "@/shared/db";
import { getServerSession } from "next-auth";

vi.mock("next-auth", () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

describe("2026 Security Hardening & Operations Suite", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.restoreAllMocks();
  });

  it("extracts client IP accurately from proxy headers", () => {
    const cfReq = new Request("http://localhost:3000", {
      headers: { "cf-connecting-ip": "203.0.113.5" },
    });
    expect(getClientIp(cfReq)).toBe("203.0.113.5");

    const xffReq = new Request("http://localhost:3000", {
      headers: { "x-forwarded-for": "198.51.100.2, 10.0.0.1" },
    });
    expect(getClientIp(xffReq)).toBe("198.51.100.2");
  });

  it("enforces sliding-window rate limits and returns 429 with Retry-After header", async () => {
    const req = new Request("http://localhost:3000/api/bio/verify-link", {
      headers: { "x-real-ip": "192.0.2.88" },
    });

    for (let i = 0; i < 3; i++) {
      const blocked = enforceRateLimit(req, "test_pin", {
        maxAttempts: 3,
        windowMs: 60_000,
      });
      expect(blocked).toBeNull();
    }

    const fourth = enforceRateLimit(req, "test_pin", {
      maxAttempts: 3,
      windowMs: 60_000,
    });
    expect(fourth).not.toBeNull();
    expect(fourth?.status).toBe(429);
    expect(Number(fourth?.headers.get("Retry-After"))).toBeGreaterThanOrEqual(1);

    // Different key stays allowed
    const check = checkRateLimit("test_pin:192.0.2.99", {
      maxAttempts: 3,
      windowMs: 60_000,
    });
    expect(check.allowed).toBe(true);
  });

  it("returns 200 healthy status with database connectivity from /api/health", async () => {
    const res = await healthGet();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("healthy");
    expect(json.database).toBe("connected");
  });

  it("protects /api/analytics/export with 401 and outputs UTF-8 BOM CSV for authenticated user", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);
    const unauthRes = await analyticsExportGet(
      new NextRequest("http://localhost:3000/api/analytics/export")
    );
    expect(unauthRes.status).toBe(401);

    const sampleUser = await prisma.user.findFirst({ select: { id: true } });
    if (sampleUser) {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: sampleUser.id },
      } as never);
      const authRes = await analyticsExportGet(
        new NextRequest("http://localhost:3000/api/analytics/export?range=7")
      );
      expect(authRes.status).toBe(200);
      expect(authRes.headers.get("Content-Type")).toContain("text/csv");
      const rawBytes = new Uint8Array(await authRes.clone().arrayBuffer());
      expect(Array.from(rawBytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
      const csv = await authRes.text();
      expect(csv).toContain("التاريخ");
    }
  });

  it("attaches Content-Security-Policy and security headers in middleware", async () => {
    const req = new NextRequest("http://localhost:3000/faisal_tech", {
      headers: { host: "anlinks.dev" },
    });
    const res = await middleware(req);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
  });
});
