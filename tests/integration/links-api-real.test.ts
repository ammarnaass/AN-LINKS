import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/shared/db";
import { GET as getProfile, PATCH as patchProfile } from "@/app/api/profile/route";
import { GET as getLinks, POST as postLink, PUT as putLinks } from "@/app/api/links/route";
import { PATCH as patchLink, DELETE as deleteLink } from "@/app/api/links/[id]/route";
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

describe("Real Links & Profile CRUD APIs (Task 2)", () => {
  let testUser: { id: string; email: string; username: string };

  beforeEach(async () => {
    vi.clearAllMocks();
    const existing = await prisma.user.findFirst({ where: { username: "client_demo" } });
    if (existing) {
      testUser = existing;
    } else {
      testUser = await prisma.user.create({
        data: {
          email: "client_demo@anlinks.dev",
          username: "client_demo",
          role: "USER",
          profile: {
            create: {
              displayName: "عميل تجريبي",
              bio: "بايو تجريبي",
            },
          },
        },
      });
    }
  });

  it("1. should return 401 when unauthenticated for profile and links", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue(null);

    const resProfile = await getProfile();
    expect(resProfile.status).toBe(401);

    const resLinks = await getLinks();
    expect(resLinks.status).toBe(401);
  });

  it("2. should retrieve profile and update phone & seoIndexing for authenticated user", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: testUser.id, email: testUser.email, name: "عميل", username: testUser.username, role: "USER" },
    });

    const res = await getProfile();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.profile.username).toBe(testUser.username);

    // Patch phone & seoIndexing
    const patchReq = new NextRequest("http://localhost:3000/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ phone: "+966551234567", seoIndexing: false }),
    });
    const patchRes = await patchProfile(patchReq);
    const patchData = await patchRes.json();
    expect(patchRes.status).toBe(200);
    expect(patchData.profile.phone).toBe("+966551234567");
    expect(patchData.profile.seoIndexing).toBe(false);
  });

  it("3. should create, reorder, patch, and delete a link for authenticated user", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: testUser.id, email: testUser.email, name: "عميل", username: testUser.username, role: "USER" },
    });

    // Create link
    const postReq = new NextRequest("http://localhost:3000/api/links", {
      method: "POST",
      body: JSON.stringify({ title: "رابط متجري", url: "https://my-store.sa" }),
    });
    const postRes = await postLink(postReq);
    const postData = await postRes.json();
    expect(postRes.status).toBe(201);
    expect(postData.link.title).toBe("رابط متجري");
    const linkId = postData.link.id;

    // Patch link
    const patchReq = new NextRequest(`http://localhost:3000/api/links/${linkId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: "متجري المحدث", isActive: false }),
    });
    const patchRes = await patchLink(patchReq, { params: Promise.resolve({ id: linkId }) });
    const patchData = await patchRes.json();
    expect(patchRes.status).toBe(200);
    expect(patchData.link.title).toBe("متجري المحدث");
    expect(patchData.link.isActive).toBe(false);

    // Put / Reorder
    const putReq = new NextRequest("http://localhost:3000/api/links", {
      method: "PUT",
      body: JSON.stringify({
        links: [{ id: linkId, position: 5 }],
      }),
    });
    const putRes = await putLinks(putReq);
    expect(putRes.status).toBe(200);

    // Delete link
    const delReq = new NextRequest(`http://localhost:3000/api/links/${linkId}`, { method: "DELETE" });
    const delRes = await deleteLink(delReq, { params: Promise.resolve({ id: linkId }) });
    expect(delRes.status).toBe(200);
  });

  it("4. should return clean zeroed metrics for user analytics", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: testUser.id, email: testUser.email, name: "عميل", username: testUser.username, role: "USER" },
    });

    const req = new NextRequest("http://localhost:3000/api/analytics");
    const res = await getAnalytics(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analytics.chartData).toHaveLength(14);
    expect(data.analytics).toHaveProperty("totalViews");
    expect(data.analytics).toHaveProperty("totalClicks");
  });
});
