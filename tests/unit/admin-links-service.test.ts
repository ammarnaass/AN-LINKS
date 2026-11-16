import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  getAdminPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getAdminLinks,
  updateAdminLink,
  getAdminPlatformAnalytics,
} from "@/features/admin/server/admin-links.service";
import { prisma } from "@/shared/db";
import { requireAdminSession } from "@/features/admin/server/admin.guard";

// Route handlers
import * as publicPlatformsRoute from "@/app/api/platforms/route";
import * as adminPlatformsRoute from "@/app/api/admin/platforms/route";
import * as adminPlatformIdRoute from "@/app/api/admin/platforms/[id]/route";
import * as adminLinksRoute from "@/app/api/admin/links/route";
import * as adminLinkIdRoute from "@/app/api/admin/links/[id]/route";
import * as adminLinksAnalyticsRoute from "@/app/api/admin/links/analytics/route";

vi.mock("@/features/admin/server/admin.guard", () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock("@/shared/db", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockPrisma: any = {
    platform: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    link: {
      count: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
      update: vi.fn(),
    },
    linkClick: {
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("Admin Links & Platforms Service and API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Platform Management Service", () => {
    it("should get admin platforms with aggregated counts", async () => {
      vi.mocked(prisma.platform.findMany).mockResolvedValueOnce([
        {
          id: "plat-1",
          slug: "youtube",
          nameAr: "يوتيوب",
          nameEn: "YouTube",
          category: "VIDEO",
          defaultIcon: "youtube",
          brandColor: "#FF0000",
          domainPattern: "youtube.com|youtu.be",
          urlPlaceholder: "https://youtube.com/@channel",
          isEnabled: true,
          isVerified: true,
          sortOrder: 1,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-02"),
          _count: { links: 42, clicks: 1200 },
        },
      ] as any);

      const platforms = await getAdminPlatforms();
      expect(platforms).toHaveLength(1);
      expect(platforms[0].slug).toBe("youtube");
      expect(platforms[0]._count?.links).toBe(42);
      expect(platforms[0]._count?.clicks).toBe(1200);
    });

    it("should prevent creating platform with duplicate slug", async () => {
      vi.mocked(prisma.platform.findUnique).mockResolvedValueOnce({
        id: "plat-existing",
        slug: "youtube",
      } as any);

      await expect(
        createPlatform({
          slug: "youtube",
          nameAr: "يوتيوب",
          nameEn: "YouTube",
          category: "VIDEO",
          defaultIcon: "youtube",
          brandColor: "#FF0000",
          domainPattern: "youtube.com",
          urlPlaceholder: "https://youtube.com",
        })
      ).rejects.toThrow("رمز المنصة (Slug) مستخدم بالفعل");
    });

    it("should create new platform successfully", async () => {
      vi.mocked(prisma.platform.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.platform.create).mockResolvedValueOnce({
        id: "plat-new",
        slug: "threads",
        nameAr: "ثريدز",
        nameEn: "Threads",
        category: "SOCIAL",
        defaultIcon: "at-sign",
        brandColor: "#000000",
        domainPattern: "threads.net",
        urlPlaceholder: "https://threads.net/@user",
        isEnabled: true,
        isVerified: true,
        sortOrder: 21,
      } as any);

      const created = await createPlatform({
        slug: "threads",
        nameAr: "ثريدز",
        nameEn: "Threads",
        category: "SOCIAL",
        defaultIcon: "at-sign",
        brandColor: "#000000",
        domainPattern: "threads.net",
        urlPlaceholder: "https://threads.net/@user",
      });

      expect(created.id).toBe("plat-new");
      expect(prisma.platform.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: "threads",
            nameAr: "ثريدز",
          }),
        })
      );
    });

    it("should update and delete platform by ID", async () => {
      vi.mocked(prisma.platform.update).mockResolvedValueOnce({
        id: "plat-1",
        nameAr: "يوتيوب المحدث",
      } as any);

      const updated = await updatePlatform("plat-1", { nameAr: "يوتيوب المحدث" });
      expect(updated.nameAr).toBe("يوتيوب المحدث");

      vi.mocked(prisma.platform.delete).mockResolvedValueOnce({ id: "plat-1" } as any);
      const deleted = await deletePlatform("plat-1");
      expect(deleted.id).toBe("plat-1");
    });
  });

  describe("Links Moderation & Analytics Service", () => {
    it("should get admin links with pagination and search", async () => {
      vi.mocked(prisma.link.count).mockResolvedValueOnce(1);
      vi.mocked(prisma.link.findMany).mockResolvedValueOnce([
        {
          id: "link-1",
          title: "قناتي على يوتيوب",
          url: "https://youtube.com/@channel",
          clicksCount: 150,
          isActive: true,
          isPinned: true,
          isArchived: false,
          createdAt: new Date("2026-02-01"),
          user: {
            id: "user-1",
            email: "creator@example.com",
            username: "creator",
            profile: { displayName: "المبدع" },
          },
          platform: {
            id: "plat-1",
            slug: "youtube",
            nameAr: "يوتيوب",
            nameEn: "YouTube",
            brandColor: "#FF0000",
          },
        },
      ] as any);

      const result = await getAdminLinks({ search: "قناتي", status: "pinned", page: 1, limit: 10 });
      expect(result.total).toBe(1);
      expect(result.items[0].title).toBe("قناتي على يوتيوب");
      expect(result.items[0].user.name).toBe("المبدع");
      expect(result.items[0].isPinned).toBe(true);
    });

    it("should build correct Prisma where clauses for diverse filter combinations", async () => {
      vi.mocked(prisma.link.count).mockResolvedValue(0);
      vi.mocked(prisma.link.findMany).mockResolvedValue([]);

      // 1. Filter: status "active" and specific platformId
      await getAdminLinks({ platformId: "plat-yt", status: "active" });
      expect(prisma.link.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            platformId: "plat-yt",
            isActive: true,
            isArchived: false,
          }),
        })
      );

      // 2. Filter: status "inactive" with platformId "all"
      await getAdminLinks({ platformId: "all", status: "inactive" });
      expect(prisma.link.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: false,
          }),
        })
      );
      // Ensure platformId was omitted from where when "all"
      const lastCallWhere = vi.mocked(prisma.link.findMany).mock.calls.at(-1)?.[0]?.where as any;
      expect(lastCallWhere.platformId).toBeUndefined();

      // 3. Filter: status "archived" and search
      await getAdminLinks({ status: "archived", search: "  creator@test.com  " });
      expect(prisma.link.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isArchived: true,
            OR: expect.arrayContaining([
              { title: { contains: "creator@test.com", mode: "insensitive" } },
              { url: { contains: "creator@test.com", mode: "insensitive" } },
              { user: { username: { contains: "creator@test.com", mode: "insensitive" } } },
              { user: { email: { contains: "creator@test.com", mode: "insensitive" } } },
              { user: { profile: { displayName: { contains: "creator@test.com", mode: "insensitive" } } } },
            ]),
          }),
        })
      );
    });

    it("should enforce pagination bounds and calculate skip & totalPages correctly", async () => {
      vi.mocked(prisma.link.count).mockResolvedValue(45);
      vi.mocked(prisma.link.findMany).mockResolvedValue([]);

      // Case A: Negative page and excessive limit (> 100)
      const resA = await getAdminLinks({ page: -5, limit: 500 });
      expect(resA.page).toBe(1);
      expect(prisma.link.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 100, // Clamped to 100 max
        })
      );
      expect(resA.totalPages).toBe(1); // 45 / 100 = 1 page

      // Case B: page 3 with limit 10
      const resB = await getAdminLinks({ page: 3, limit: 10 });
      expect(resB.page).toBe(3);
      expect(prisma.link.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({
          skip: 20, // (3 - 1) * 10
          take: 10,
        })
      );
      expect(resB.totalPages).toBe(5); // Math.ceil(45 / 10) = 5

      // Case C: zero total items should return totalPages 1
      vi.mocked(prisma.link.count).mockResolvedValueOnce(0);
      const resC = await getAdminLinks({ page: 1, limit: 20 });
      expect(resC.totalPages).toBe(1);
    });

    it("should update admin link status (pin, archive, active)", async () => {
      vi.mocked(prisma.link.update).mockResolvedValueOnce({
        id: "link-1",
        isPinned: true,
        isActive: false,
      } as any);

      const updated = await updateAdminLink("link-1", { isPinned: true, isActive: false });
      expect(updated.isPinned).toBe(true);
      expect(updated.isActive).toBe(false);
    });

    it("should calculate real platform analytics", async () => {
      vi.mocked(prisma.link.count).mockResolvedValueOnce(100);
      vi.mocked(prisma.linkClick.count).mockResolvedValueOnce(500);
      vi.mocked(prisma.link.aggregate).mockResolvedValueOnce({ _sum: { clicksCount: 450 } } as any);
      vi.mocked(prisma.platform.count).mockResolvedValueOnce(18);
      vi.mocked(prisma.platform.findMany).mockResolvedValueOnce([
        {
          slug: "youtube",
          nameAr: "يوتيوب",
          nameEn: "YouTube",
          brandColor: "#FF0000",
          _count: { links: 30, clicks: 250 },
        },
      ] as any);
      vi.mocked(prisma.linkClick.groupBy).mockResolvedValueOnce([
        { device: "MOBILE", _count: { _all: 350 } },
        { device: "DESKTOP", _count: { _all: 150 } },
      ] as any);
      vi.mocked(prisma.linkClick.groupBy).mockResolvedValueOnce([
        { country: "SA", _count: { _all: 400 } },
        { country: "AE", _count: { _all: 100 } },
      ] as any);
      vi.mocked(prisma.link.findMany).mockResolvedValueOnce([
        {
          id: "link-top-1",
          title: "رابط شهير",
          url: "https://example.com",
          clicksCount: 300,
          user: { username: "star", profile: { displayName: "نجم" } },
        },
      ] as any);

      const stats = await getAdminPlatformAnalytics();
      expect(stats.totalLinks).toBe(100);
      expect(stats.totalClicks).toBe(500);
      expect(stats.activePlatformsCount).toBe(18);
      expect(stats.platformBreakdown[0].slug).toBe("youtube");
      expect(stats.deviceBreakdown[0].device).toBe("MOBILE");
      expect(stats.deviceBreakdown[0].percentage).toBe(70);
      expect(stats.countryBreakdown[0].country).toBe("SA");
      expect(stats.countryBreakdown[0].percentage).toBe(80);
      expect(stats.topLinks[0].username).toBe("نجم");
    });
  });

  describe("API Route Handlers", () => {
    it("should handle public GET /api/platforms", async () => {
      vi.mocked(prisma.platform.findMany).mockResolvedValueOnce([
        {
          id: "plat-pub",
          slug: "youtube",
          nameAr: "يوتيوب",
          nameEn: "YouTube",
          category: "VIDEO",
          defaultIcon: "youtube",
          brandColor: "#FF0000",
          domainPattern: "youtube.com",
          urlPlaceholder: "https://youtube.com",
          isEnabled: true,
          isVerified: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any);

      const res = await publicPlatformsRoute.GET();
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.platforms).toHaveLength(1);
    });

    it("should enforce admin authorization on admin routes", async () => {
      vi.mocked(requireAdminSession).mockResolvedValueOnce({
        authorized: false,
        response: new Response(JSON.stringify({ success: false, error: "غير مصرح" }), {
          status: 401,
        }) as any,
      });

      const res = await adminPlatformsRoute.GET();
      expect(res.status).toBe(401);
    });

    it("should allow admin GET /api/admin/platforms when authorized", async () => {
      vi.mocked(requireAdminSession).mockResolvedValueOnce({
        authorized: true,
        user: { id: "admin-1", username: "admin", role: "ADMIN" },
      });
      vi.mocked(prisma.platform.findMany).mockResolvedValueOnce([]);

      const res = await adminPlatformsRoute.GET();
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("should handle admin POST /api/admin/platforms validation", async () => {
      vi.mocked(requireAdminSession).mockResolvedValueOnce({
        authorized: true,
        user: { id: "admin-1", username: "admin", role: "ADMIN" },
      });

      const req = new NextRequest("http://localhost/api/admin/platforms", {
        method: "POST",
        body: JSON.stringify({ slug: "" }),
      });

      const res = await adminPlatformsRoute.POST(req);
      const body = await res.json();
      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
    });

    it("should handle admin PATCH & DELETE /api/admin/platforms/[id]", async () => {
      vi.mocked(requireAdminSession).mockResolvedValue({
        authorized: true,
        user: { id: "admin-1", username: "admin", role: "ADMIN" },
      });
      vi.mocked(prisma.platform.update).mockResolvedValueOnce({ id: "plat-1" } as any);
      vi.mocked(prisma.platform.delete).mockResolvedValueOnce({ id: "plat-1" } as any);

      const patchReq = new NextRequest("http://localhost/api/admin/platforms/plat-1", {
        method: "PATCH",
        body: JSON.stringify({ isEnabled: false }),
      });
      const patchRes = await adminPlatformIdRoute.PATCH(patchReq, {
        params: Promise.resolve({ id: "plat-1" }),
      });
      const patchBody = await patchRes.json();
      expect(patchBody.success).toBe(true);

      const delReq = new NextRequest("http://localhost/api/admin/platforms/plat-1", {
        method: "DELETE",
      });
      const delRes = await adminPlatformIdRoute.DELETE(delReq, {
        params: Promise.resolve({ id: "plat-1" }),
      });
      const delBody = await delRes.json();
      expect(delBody.success).toBe(true);
    });

    it("should handle admin GET /api/admin/links", async () => {
      vi.mocked(requireAdminSession).mockResolvedValueOnce({
        authorized: true,
        user: { id: "admin-1", username: "admin", role: "ADMIN" },
      });
      vi.mocked(prisma.link.count).mockResolvedValueOnce(0);
      vi.mocked(prisma.link.findMany).mockResolvedValueOnce([]);

      const req = new NextRequest("http://localhost/api/admin/links?page=1&limit=10");
      const res = await adminLinksRoute.GET(req);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.items).toEqual([]);
    });

    it("should handle admin GET /api/admin/links/analytics", async () => {
      vi.mocked(requireAdminSession).mockResolvedValueOnce({
        authorized: true,
        user: { id: "admin-1", username: "admin", role: "ADMIN" },
      });
      vi.mocked(prisma.link.count).mockResolvedValueOnce(10);
      vi.mocked(prisma.linkClick.count).mockResolvedValueOnce(20);
      vi.mocked(prisma.link.aggregate).mockResolvedValueOnce({ _sum: { clicksCount: 20 } } as any);
      vi.mocked(prisma.platform.count).mockResolvedValueOnce(5);
      vi.mocked(prisma.platform.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.linkClick.groupBy).mockResolvedValue([]);
      vi.mocked(prisma.link.findMany).mockResolvedValueOnce([]);

      const res = await adminLinksAnalyticsRoute.GET();
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.totalLinks).toBe(10);
    });
  });
});

