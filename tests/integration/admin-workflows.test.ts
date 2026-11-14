import { describe, it, expect } from "vitest";
import { getPublicProfileData } from "@/features/bio/services/profile.service";
import {
  getAdminUsersList,
  toggleUserSuspension,
  getAdminReports,
  updateReportStatus,
} from "@/features/admin/services/admin.service";
import { isBotOrPrefetch } from "@/lib/bot-detector";
import { prisma } from "@/shared/db";
import { authOptions } from "@/features/auth/server/auth.options";

interface NextAuthCredentialsProvider {
  options: {
    authorize: (cred: { email?: string; password?: string }) => Promise<{
      id: string;
      email: string;
      username: string;
      role: string;
    }>;
  };
}

describe("Admin & Client Workflows Integration (PRD ADM-1, ADM-3, Bio Public)", () => {
  const provider = authOptions.providers[0] as unknown as NextAuthCredentialsProvider;

  it("should retrieve Client public profile and strictly omit inactive links", async () => {
    const profileData = await getPublicProfileData("faisal_client");
    expect(profileData).not.toBeNull();
    expect(profileData?.user.username).toBe("faisal_client");
    expect(profileData?.profile.displayName).toBe("فيصل الشمري");
    expect(profileData?.profile.themeKey).toBe("layanDark");

    // Must have 3 active links, and draft link must be excluded
    expect(profileData?.links).toHaveLength(3);
    const linkTitles = profileData?.links.map((l) => l.title);
    expect(linkTitles).toContain("متجري الرقمي - قوالب وتطبيقات");
    expect(linkTitles).toContain("قناتي على يوتيوب");
    expect(linkTitles).toContain("حجز استشارة خاصة عبر واتساب");
    expect(linkTitles).not.toContain("رابط تجريبي مؤرشف");

    // 4 Social links
    expect(profileData?.socials).toHaveLength(4);
  });

  it("should filter search and list users in admin directory (ADM-1)", async () => {
    const searchResult = await getAdminUsersList({ search: "faisal_client" });
    expect(searchResult.length).toBeGreaterThanOrEqual(1);
    expect(searchResult[0].username).toBe("faisal_client");
    expect(searchResult[0].displayName).toBe("فيصل الشمري");
    expect(searchResult[0].linksCount).toBe(4); // 3 active + 1 draft = 4 total in DB
  });

  it("should execute full user suspension lifecycle: hide profile, block login, restore", async () => {
    const admin = await prisma.user.findUnique({ where: { username: "sysadmin" } });
    const client = await prisma.user.findUnique({ where: { username: "faisal_client" } });
    expect(admin).toBeDefined();
    expect(client).toBeDefined();

    // 1. Suspend client
    const suspendRes = await toggleUserSuspension(client!.id, true, admin!.id);
    expect(suspendRes.ok).toBe(true);
    expect(suspendRes.user?.isSuspended).toBe(true);

    // 2. Public profile must now return null (hidden)
    const hiddenProfile = await getPublicProfileData("faisal_client");
    expect(hiddenProfile).toBeNull();

    // 3. Login must be blocked
    await expect(
      provider.options.authorize({
        email: "client@anlinks.dev",
        password: "Client@123456",
      })
    ).rejects.toThrow("تم إيقاف هذا الحساب. يرجى التواصل مع الإدارة");

    // 4. Restore / Unsuspend client
    const restoreRes = await toggleUserSuspension(client!.id, false, admin!.id);
    expect(restoreRes.ok).toBe(true);
    expect(restoreRes.user?.isSuspended).toBe(false);

    // 5. Public profile is accessible again
    const restoredProfile = await getPublicProfileData("faisal_client");
    expect(restoredProfile).not.toBeNull();
  });

  it("should process abuse reports lifecycle: fetch pending, resolve report (ADM-3)", async () => {
    // 1. Create dedicated pending test report
    const testReport = await prisma.report.create({
      data: {
        username: "faisal_client",
        reason: "spam",
        details: "تقرير تجريبي للاختبار التلقائي",
        status: "PENDING",
      },
    });

    // 2. Fetch pending reports and find target
    const pendingReports = await getAdminReports("PENDING");
    const targetReport = pendingReports.find((r) => r.id === testReport.id);
    expect(targetReport).toBeDefined();

    // 3. Resolve report
    const resolveRes = await updateReportStatus(targetReport!.id, "RESOLVED");
    expect(resolveRes.ok).toBe(true);
    expect(resolveRes.report?.status).toBe("RESOLVED");

    // 4. Verify report is now resolved
    const resolvedReports = await getAdminReports("RESOLVED");
    expect(resolvedReports.some((r) => r.id === targetReport!.id)).toBe(true);

    // 5. Clean up
    await prisma.report.delete({ where: { id: testReport.id } });
  });

  it("should verify bot detection for redirection analytics (/go/[id])", () => {
    const emptyHeaders = new Headers();
    expect(isBotOrPrefetch("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", emptyHeaders)).toBe(true);
    expect(isBotOrPrefetch("Twitterbot/1.0", emptyHeaders)).toBe(true);
    expect(isBotOrPrefetch("facebookexternalhit/1.1", emptyHeaders)).toBe(true);
    expect(
      isBotOrPrefetch(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
        emptyHeaders
      )
    ).toBe(false);
  });
});
