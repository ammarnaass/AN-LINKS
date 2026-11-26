import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DashboardPlanBadge,
  useDashboardPlan,
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

  it("renders the free plan badge with link to subscription settings tab", () => {
    setCachedDashboardPlan({
      planName: "الباقة المجانية",
      planSlug: "free",
      isSubscribed: false,
      billingCycle: "MONTHLY",
      badgeAr: null,
    });

    const html = renderToStaticMarkup(<DashboardPlanBadge />);
    expect(html).toContain('href="/dashboard/settings?tab=subscription"');
    expect(html).toContain("الباقة المجانية");
    expect(html).toContain("ترقية");
  });

  it("renders the PRO plan badge accurately when active", () => {
    setCachedDashboardPlan({
      planName: "باقة المحترف",
      planSlug: "pro",
      isSubscribed: true,
      billingCycle: "MONTHLY",
      badgeAr: "PRO",
    });

    const html = renderToStaticMarkup(<DashboardPlanBadge />);
    expect(html).toContain('href="/dashboard/settings?tab=subscription"');
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
    });

    const html = renderToStaticMarkup(<DashboardPlanBadge />);
    expect(html).toContain('href="/dashboard/settings?tab=subscription"');
    expect(html).toContain("باقة كبار الشخصيات");
    expect(html).toContain("VIP");
  });

  it("renders inside DashboardShell top header bar alongside theme toggle and user dropdown", () => {
    const html = renderToStaticMarkup(
      <DashboardShell>
        <div>test content</div>
      </DashboardShell>
    );
    expect(html).toContain('href="/dashboard/settings?tab=subscription"');
    expect(html).toContain("test content");
  });
});
