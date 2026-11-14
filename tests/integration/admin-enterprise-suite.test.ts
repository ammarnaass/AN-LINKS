import { describe, it, expect } from "vitest";
import { prisma } from "@/shared/db";
import {
  getPlatformSettings,
  updatePlatformSettings,
  getPlatformAnalyticsData,
  toggleUserRole,
} from "@/features/admin";

describe("Admin Enterprise Suite Integration (v3.1.0)", () => {
  it("1. should fetch platform analytics data including MRR, SVG chart points, and top creators", async () => {
    const analytics = await getPlatformAnalyticsData();

    expect(analytics).toBeDefined();
    expect(analytics.mrr).toBe(0);
    expect(analytics.totalUsers).toBeGreaterThan(0);
    expect(analytics.chartData.length).toBe(14);
    expect(analytics.chartData[0]).toHaveProperty("revenue");
    expect(analytics.chartData[0]).toHaveProperty("users");
    expect(analytics.chartData[0]).toHaveProperty("clicks");

    expect(Array.isArray(analytics.topCreators)).toBe(true);
    expect(Array.isArray(analytics.recentTransactions)).toBe(true);
  });

  it("2. should retrieve platform settings with all 5 default Saudi/Global gateways", () => {
    const settings = getPlatformSettings();

    expect(settings).toBeDefined();
    expect(settings.siteName).toBe("روابط | AN LINKS");
    expect(settings.canonicalDomain).toBe("rawabet.me");
    expect(settings.pricing.proMonthlyPrice).toBe(39);
    expect(settings.pricing.proYearlyPrice).toBe(349);
    expect(settings.pricing.storeCommissionRate).toBe(5);

    // Verify 5 Gateways exist
    const gatewayKeys = Object.keys(settings.gateways);
    expect(gatewayKeys).toContain("mada");
    expect(gatewayKeys).toContain("apple_pay");
    expect(gatewayKeys).toContain("visa_mastercard");
    expect(gatewayKeys).toContain("stc_pay");
    expect(gatewayKeys).toContain("tamara");

    expect(settings.gateways.mada.nameAr).toContain("مدى");
    expect(settings.gateways.apple_pay.nameAr).toBe("Apple Pay");
    expect(settings.gateways.mada.isEnabled).toBe(true);
  });

  it("3. should update platform settings and persist modifications", () => {
    const initial = getPlatformSettings();

    const updateRes = updatePlatformSettings({
      siteName: "روابط بلس الفاخرة | AN LINKS+",
      maintenanceMode: true,
      pricing: {
        ...initial.pricing,
        proMonthlyPrice: 49,
      },
    });

    expect(updateRes.ok).toBe(true);
    expect(updateRes.settings.siteName).toBe("روابط بلس الفاخرة | AN LINKS+");
    expect(updateRes.settings.maintenanceMode).toBe(true);
    expect(updateRes.settings.pricing.proMonthlyPrice).toBe(49);

    // Verify persistence on subsequent get
    const fetched = getPlatformSettings();
    expect(fetched.siteName).toBe("روابط بلس الفاخرة | AN LINKS+");
    expect(fetched.maintenanceMode).toBe(true);
    expect(fetched.pricing.proMonthlyPrice).toBe(49);

    // Revert back to clean state
    updatePlatformSettings({
      siteName: "روابط | AN LINKS",
      maintenanceMode: false,
      pricing: {
        ...initial.pricing,
        proMonthlyPrice: 39,
      },
    });
  });

  it("4. should upgrade a client user to ADMIN and verify in database", async () => {
    const client = await prisma.user.findUnique({ where: { username: "faisal_client" } });
    const admin = await prisma.user.findUnique({ where: { username: "sysadmin" } });
    expect(client).toBeDefined();
    expect(admin).toBeDefined();

    // Promote to ADMIN
    const promoteRes = await toggleUserRole(client!.id, "ADMIN", admin!.id);
    expect(promoteRes.ok).toBe(true);
    expect(promoteRes.user?.role).toBe("ADMIN");

    // Verify in DB
    const updatedDbUser = await prisma.user.findUnique({ where: { id: client!.id } });
    expect(updatedDbUser?.role).toBe("ADMIN");

    // Demote back to USER
    const demoteRes = await toggleUserRole(client!.id, "USER", admin!.id);
    expect(demoteRes.ok).toBe(true);
    expect(demoteRes.user?.role).toBe("USER");

    const finalDbUser = await prisma.user.findUnique({ where: { id: client!.id } });
    expect(finalDbUser?.role).toBe("USER");
  });

  it("5. should prevent an admin from modifying their own role (self-demotion protection)", async () => {
    const admin = await prisma.user.findUnique({ where: { username: "sysadmin" } });
    expect(admin).toBeDefined();

    const selfDemoteRes = await toggleUserRole(admin!.id, "USER", admin!.id);
    expect(selfDemoteRes.ok).toBe(false);
    expect(selfDemoteRes.status).toBe(400);
    expect(selfDemoteRes.error).toBe("لا يمكن للمشغّل تغيير رتبة حسابه الشخصي");
  });
});

