import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/shared/db";
import { recordLinkClick, getNormalizedDate } from "@/features/analytics/services/tracking.service";
import { GET as handleGoRedirect } from "@/app/go/[id]/route";
import { NextRequest } from "next/server";

describe("Link Tracking & Atomic Redirection Integration Tests (Task 3)", () => {
  const timestamp = Date.now();
  const testEmail = `track_${timestamp}@anlinks.dev`;
  const testUsername = `track_${timestamp}`;
  const testPlatformSlug = `plat_${timestamp}`;
  const disabledPlatformSlug = `displat_${timestamp}`;

  let testUserId: string;
  let testPlatformId: string;
  let disabledPlatformId: string;
  let activeLinkId: string;
  let inactiveLinkId: string;
  let archivedLinkId: string;
  let disabledPlatformLinkId: string;
  let suspendedUserId: string;
  let suspendedUserLinkId: string;

  beforeAll(async () => {
    // 1. Create main test user
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: testUsername,
        role: "USER",
        isSuspended: false,
      },
    });
    testUserId = user.id;

    // 2. Create suspended test user
    const suspendedUser = await prisma.user.create({
      data: {
        email: `susp_${timestamp}@anlinks.dev`,
        username: `susp_${timestamp}`,
        role: "USER",
        isSuspended: true,
      },
    });
    suspendedUserId = suspendedUser.id;

    // 3. Create enabled platform
    const platform = await prisma.platform.create({
      data: {
        slug: testPlatformSlug,
        nameAr: "منصة اختبار",
        nameEn: "Test Platform",
        category: "SOCIAL",
        defaultIcon: "globe",
        brandColor: "#123456",
        domainPattern: "testplatform.com",
        urlPlaceholder: "https://testplatform.com/@user",
        isEnabled: true,
      },
    });
    testPlatformId = platform.id;

    // 4. Create disabled platform
    const disabledPlatform = await prisma.platform.create({
      data: {
        slug: disabledPlatformSlug,
        nameAr: "منصة معطلة",
        nameEn: "Disabled Platform",
        category: "SOCIAL",
        defaultIcon: "globe",
        brandColor: "#654321",
        domainPattern: "disabledplatform.com",
        urlPlaceholder: "https://disabledplatform.com/@user",
        isEnabled: false,
      },
    });
    disabledPlatformId = disabledPlatform.id;

    // 5. Create links
    const activeLink = await prisma.link.create({
      data: {
        userId: testUserId,
        platformId: testPlatformId,
        title: "Active Test Link",
        url: "https://testplatform.com/@user/active",
        isActive: true,
        isArchived: false,
        clicksCount: 0,
      },
    });
    activeLinkId = activeLink.id;

    const inactiveLink = await prisma.link.create({
      data: {
        userId: testUserId,
        platformId: testPlatformId,
        title: "Inactive Test Link",
        url: "https://testplatform.com/@user/inactive",
        isActive: false,
        isArchived: false,
        clicksCount: 0,
      },
    });
    inactiveLinkId = inactiveLink.id;

    const archivedLink = await prisma.link.create({
      data: {
        userId: testUserId,
        platformId: testPlatformId,
        title: "Archived Test Link",
        url: "https://testplatform.com/@user/archived",
        isActive: true,
        isArchived: true,
        clicksCount: 0,
      },
    });
    archivedLinkId = archivedLink.id;

    const disabledPlatLink = await prisma.link.create({
      data: {
        userId: testUserId,
        platformId: disabledPlatformId,
        title: "Disabled Platform Link",
        url: "https://disabledplatform.com/@user/hello",
        isActive: true,
        isArchived: false,
        clicksCount: 0,
      },
    });
    disabledPlatformLinkId = disabledPlatLink.id;

    const suspendedLink = await prisma.link.create({
      data: {
        userId: suspendedUserId,
        platformId: testPlatformId,
        title: "Suspended User Link",
        url: "https://testplatform.com/@user/suspended",
        isActive: true,
        isArchived: false,
        clicksCount: 0,
      },
    });
    suspendedUserLinkId = suspendedLink.id;
  });

  afterAll(async () => {
    // Cleanup in reverse dependency order
    const linkIds = [
      activeLinkId,
      inactiveLinkId,
      archivedLinkId,
      disabledPlatformLinkId,
      suspendedUserLinkId,
    ].filter(Boolean);

    await prisma.linkClick.deleteMany({ where: { linkId: { in: linkIds } } });
    await prisma.dailyLinkStat.deleteMany({ where: { linkId: { in: linkIds } } });
    await prisma.link.deleteMany({ where: { id: { in: linkIds } } });

    const platformIds = [testPlatformId, disabledPlatformId].filter(Boolean);
    await prisma.platform.deleteMany({ where: { id: { in: platformIds } } });

    const userIds = [testUserId, suspendedUserId].filter(Boolean);
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  });

  describe("recordLinkClick Service", () => {
    it("should atomically record click, increment link clicksCount, and upsert daily stat", async () => {
      const userAgent =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
      const headers = new Headers({
        "cf-ipcountry": "sa",
        "x-vercel-ip-city": "Riyadh",
        referer: "https://instagram.com/",
      });

      await recordLinkClick(activeLinkId, userAgent, headers, {
        country: "SA",
        city: "Riyadh",
        platformId: testPlatformId,
        referer: "https://instagram.com/",
      });

      // Verify LinkClick created
      const click = await prisma.linkClick.findFirst({
        where: { linkId: activeLinkId },
        orderBy: { createdAt: "desc" },
      });
      expect(click).toBeDefined();
      expect(click?.country).toBe("SA");
      expect(click?.city).toBe("Riyadh");
      expect(click?.device).toBe("MOBILE");
      expect(click?.os).toBe("iOS");
      expect(click?.browser).toBe("Safari");
      expect(click?.platformId).toBe(testPlatformId);
      expect(click?.referer).toBe("https://instagram.com/");

      // Verify Link.clicksCount incremented
      const updatedLink = await prisma.link.findUnique({
        where: { id: activeLinkId },
        select: { clicksCount: true },
      });
      expect(updatedLink?.clicksCount).toBe(1);

      // Verify DailyLinkStat upserted
      const today = getNormalizedDate();
      const dailyStat = await prisma.dailyLinkStat.findUnique({
        where: {
          linkId_date: {
            linkId: activeLinkId,
            date: today,
          },
        },
      });
      expect(dailyStat).toBeDefined();
      expect(dailyStat?.clicks).toBe(1);

      // Record a second click from Desktop Windows Chrome
      const desktopUA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
      await recordLinkClick(activeLinkId, desktopUA, new Headers(), {
        country: "AE",
        city: "Dubai",
        platformId: testPlatformId,
      });

      const updatedLink2 = await prisma.link.findUnique({
        where: { id: activeLinkId },
        select: { clicksCount: true },
      });
      expect(updatedLink2?.clicksCount).toBe(2);

      const dailyStat2 = await prisma.dailyLinkStat.findUnique({
        where: {
          linkId_date: {
            linkId: activeLinkId,
            date: today,
          },
        },
      });
      expect(dailyStat2?.clicks).toBe(2);
    });

    it("should resolve platformId from database when not provided in options", async () => {
      const userAgent =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
      const headers = new Headers();

      // Omit options entirely
      await recordLinkClick(activeLinkId, userAgent, headers);

      const click = await prisma.linkClick.findFirst({
        where: { linkId: activeLinkId },
        orderBy: { createdAt: "desc" },
      });
      expect(click?.platformId).toBe(testPlatformId);
      expect(click?.os).toBe("macOS");
      expect(click?.device).toBe("DESKTOP");
      expect(click?.browser).toBe("Chrome");
    });

    it("should filter out invalid country codes (XX and T1) and fallback to headers", async () => {
      const userAgent = "Mozilla/5.0 (Linux; Android 14) Chrome/120.0 Mobile";
      const headersXX = new Headers({
        "cf-ipcountry": "XX",
        "x-vercel-ip-city": "Unknown",
      });

      await recordLinkClick(activeLinkId, userAgent, headersXX);

      const clickXX = await prisma.linkClick.findFirst({
        where: { linkId: activeLinkId },
        orderBy: { createdAt: "desc" },
      });
      expect(clickXX?.country).toBeNull();
      expect(clickXX?.city).toBe("Unknown");

      const headersT1 = new Headers({
        "x-vercel-ip-country": "T1",
      });

      await recordLinkClick(activeLinkId, userAgent, headersT1);

      const clickT1 = await prisma.linkClick.findFirst({
        where: { linkId: activeLinkId },
        orderBy: { createdAt: "desc" },
      });
      expect(clickT1?.country).toBeNull();
    });

    it("should discard clicks from bots and prefetch triggers", async () => {
      const initialCount = (
        await prisma.link.findUnique({
          where: { id: activeLinkId },
          select: { clicksCount: true },
        })
      )?.clicksCount ?? 0;

      // Bot User Agent
      await recordLinkClick(
        activeLinkId,
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        new Headers()
      );

      // Prefetch header
      const prefetchHeaders = new Headers({ purpose: "prefetch" });
      await recordLinkClick(
        activeLinkId,
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
        prefetchHeaders
      );

      const postCount = (
        await prisma.link.findUnique({
          where: { id: activeLinkId },
          select: { clicksCount: true },
        })
      )?.clicksCount ?? 0;

      expect(postCount).toBe(initialCount);
    });
  });

  describe("GET /go/[id] Route Handler", () => {
    it("should return 302 redirect to link destination for active link", async () => {
      const request = new NextRequest(`http://localhost:3000/go/${activeLinkId}`, {
        headers: {
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          "cf-ipcountry": "SA",
          "x-vercel-ip-city": "Jeddah",
          referer: "https://twitter.com/",
        },
      });

      const response = await handleGoRedirect(request, {
        params: Promise.resolve({ id: activeLinkId }),
      });

      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe("https://testplatform.com/@user/active");
    });

    it("should return redirect to /not-found for inactive link", async () => {
      const request = new NextRequest(`http://localhost:3000/go/${inactiveLinkId}`);
      const response = await handleGoRedirect(request, {
        params: Promise.resolve({ id: inactiveLinkId }),
      });

      expect(response.headers.get("location")).toContain("/not-found");
    });

    it("should return redirect to /not-found for archived link", async () => {
      const request = new NextRequest(`http://localhost:3000/go/${archivedLinkId}`);
      const response = await handleGoRedirect(request, {
        params: Promise.resolve({ id: archivedLinkId }),
      });

      expect(response.headers.get("location")).toContain("/not-found");
    });

    it("should return redirect to /not-found when creator user is suspended", async () => {
      const request = new NextRequest(`http://localhost:3000/go/${suspendedUserLinkId}`);
      const response = await handleGoRedirect(request, {
        params: Promise.resolve({ id: suspendedUserLinkId }),
      });

      expect(response.headers.get("location")).toContain("/not-found");
    });

    it("should return redirect to /not-found for non-existent link id", async () => {
      const request = new NextRequest("http://localhost:3000/go/non-existent-id-999");
      const response = await handleGoRedirect(request, {
        params: Promise.resolve({ id: "non-existent-id-999" }),
      });

      expect(response.headers.get("location")).toContain("/not-found");
    });

    it("POLICY: should NOT block 302 redirect even if platform.isEnabled is false", async () => {
      const request = new NextRequest(`http://localhost:3000/go/${disabledPlatformLinkId}`, {
        headers: {
          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          "cf-ipcountry": "KW",
        },
      });

      const response = await handleGoRedirect(request, {
        params: Promise.resolve({ id: disabledPlatformLinkId }),
      });

      // Existing creator links must continue redirecting seamlessly!
      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe(
        "https://disabledplatform.com/@user/hello"
      );
    });
  });
});
