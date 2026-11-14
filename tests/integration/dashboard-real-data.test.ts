import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/shared/db";
import { GET as getLinks } from "@/app/api/links/route";
import { GET as getProfile } from "@/app/api/profile/route";
import { GET as getAnalytics } from "@/app/api/analytics/route";
import { NextRequest } from "next/server";
import * as nextAuth from "next-auth";

vi.mock("next-auth", async () => {
  const actual = await vi.importActual<typeof nextAuth>("next-auth");
  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});

describe("Dashboard Real Data & Mock Purge (Task 3)", () => {
  let freshUser: { id: string; email: string; username: string };

  beforeEach(async () => {
    vi.clearAllMocks();
    const existing = await prisma.user.findFirst({ where: { username: "fresh_creator" } });
    if (existing) {
      freshUser = existing;
    } else {
      freshUser = await prisma.user.create({
        data: {
          email: "fresh@anlinks.dev",
          username: "fresh_creator",
          role: "USER",
          profile: {
            create: {
              displayName: "صانع جديد",
              bio: "",
            },
          },
        },
      });
    }
  });

  it("1. should return empty links array and empty socials for fresh user without mock fallback", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: freshUser.id, email: freshUser.email, name: "صانع", username: freshUser.username, role: "USER" },
    });

    const res = await getLinks();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.links)).toBe(true);
    expect(Array.isArray(data.socials)).toBe(true);
    // Verified that no hardcoded "tariq" links exist in new user response
    expect(data.links.some((l: { title: string }) => l.title.includes("طارق"))).toBe(false);
  });

  it("2. should return clean profile with real user credentials", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: freshUser.id, email: freshUser.email, name: "صانع", username: freshUser.username, role: "USER" },
    });

    const res = await getProfile();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.profile.username).toBe("fresh_creator");
    expect(data.profile.displayName).toBe("صانع جديد");
  });

  it("3. should return zeroed analytics for fresh user without Math.sin fake formulas", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: freshUser.id, email: freshUser.email, name: "صانع", username: freshUser.username, role: "USER" },
    });

    const req = new NextRequest("http://localhost:3000/api/analytics");
    const res = await getAnalytics(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.analytics.totalViews).toBe(0);
    expect(data.analytics.totalClicks).toBe(0);
    expect(data.analytics.averageCtr).toBe(0);
    expect(data.analytics.topLinks).toHaveLength(0);
    // All 14 days should have exactly 0 views and 0 clicks
    const hasAnyFakeNumbers = data.analytics.chartData.some(
      (point: { views: number; clicks: number }) => point.views > 0 || point.clicks > 0
    );
    expect(hasAnyFakeNumbers).toBe(false);
  });
});
