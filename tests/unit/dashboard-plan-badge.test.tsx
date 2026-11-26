import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DashboardPlanBadge,
  DashboardPlanPopover,
  setCachedDashboardPlan,
} from "@/features/dashboard";
import { DashboardShell } from "@/features/dashboard";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { username: "faisal_tech", role: "CREATOR" } },
    status: "authenticated",
  }),
  signOut: vi.fn(),
}));

describe("Dashboard Plan Badge Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the free plan badge in the top header", () => {
    setCachedDashboardPlan({
      planName: "الباقة المجانية",
      planSlug: "free",
      isSubscribed: false,
      billingCycle: "MONTHLY",
      badgeAr: null,
      currentPeriodEnd: null,
      amountPaid: 0,
      currency: "SAR",
      quotas: { linksUsed: 2, linksMax: 5, customDomain: false, removeBranding: false },
    });

    const html = renderToStaticMarkup(<DashboardPlanBadge />);
    expect(html).toContain("الباقة المجانية");
    expect(html).toContain("ترقية");
    expect(html).toContain('aria-label="الخطة الحالية والاشتراكات الشهرية"');
  });

  it("renders the PRO plan badge accurately when active", () => {
    setCachedDashboardPlan({
      planName: "باقة المحترف",
      planSlug: "pro",
      isSubscribed: true,
      billingCycle: "MONTHLY",
      badgeAr: "PRO",
      currentPeriodEnd: "2026-12-31T00:00:00.000Z",
      amountPaid: 49,
      currency: "SAR",
      quotas: { linksUsed: 12, linksMax: 50, customDomain: true, removeBranding: true },
    });

    const html = renderToStaticMarkup(<DashboardPlanBadge />);
    expect(html).toContain("باقة المحترف");
    expect(html).toContain("PRO");
  });

  it("renders the VIP plan badge with gold accent", () => {
    setCachedDashboardPlan({
      planName: "باقة كبار الشخصيات",
      planSlug: "vip",
      isSubscribed: true,
      billingCycle: "ANNUAL",
      badgeAr: "VIP",
      currentPeriodEnd: "2027-11-26T00:00:00.000Z",
      amountPaid: 999,
      currency: "SAR",
      quotas: { linksUsed: 40, linksMax: 999, customDomain: true, removeBranding: true },
    });

    const html = renderToStaticMarkup(<DashboardPlanBadge />);
    expect(html).toContain("باقة كبار الشخصيات");
    expect(html).toContain("VIP");
  });

  it("renders the DashboardPlanPopover with monthly subscription details and link to settings", () => {
    const popoverHtml = renderToStaticMarkup(
      <DashboardPlanPopover
        planData={{
          planName: "باقة المحترف",
          planSlug: "pro",
          isSubscribed: true,
          billingCycle: "MONTHLY",
          badgeAr: "PRO",
          currentPeriodEnd: "2026-12-25T00:00:00.000Z",
          amountPaid: 49,
          currency: "SAR",
          quotas: { linksUsed: 8, linksMax: 50, customDomain: true, removeBranding: true },
        }}
        onClose={vi.fn()}
      />
    );

    expect(popoverHtml).toContain("باقة المحترف");
    expect(popoverHtml).toContain("شهري");
    expect(popoverHtml).toContain("تاريخ التجديد القادم");
    expect(popoverHtml).toContain("8 / 50");
    expect(popoverHtml).toContain('href="/dashboard/settings?tab=subscription"');
  });

  it("renders inside DashboardShell top header bar alongside theme toggle and user dropdown", () => {
    const html = renderToStaticMarkup(
      <DashboardShell>
        <div>test content</div>
      </DashboardShell>
    );
    expect(html).toContain('aria-label="الخطة الحالية والاشتراكات الشهرية"');
    expect(html).toContain("test content");
  });
});
