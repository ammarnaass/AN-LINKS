import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AdminSidebar,
  AdminGatewaysTab,
  AdminPlansTab,
  AdminQuotasTab,
  AdminCurrenciesTab,
  AdminCouponsTab,
  AdminTransactionsTab,
} from "@/features/admin";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("Admin Financial & Subscriptions Sidebar Partition Test Suite", () => {
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "admin-1",
          name: "مدير المنظومة",
          username: "sysadmin",
          email: "admin@anlinks.dev",
          role: "ADMIN",
        },
      },
      status: "authenticated",
    } as any);
  });

  it("should render all 6 financial and subscriptions subsystems in AdminSidebar", () => {
    const handleTabChange = vi.fn();
    const html = renderToStaticMarkup(
      <AdminSidebar
        activeTab="gateways"
        onTabChange={handleTabChange}
        plansCount={4}
      />
    );

    // Section Headers
    expect(html).toContain("إدارة النظام");
    expect(html).toContain("المنظومة المالية والاشتراكات");

    // All 6 financial partition items
    expect(html).toContain("بوابات الدفع");
    expect(html).toContain("باقات واشتراكات المنصة");
    expect(html).toContain("الصلاحيات والمحددات");
    expect(html).toContain("العملات وأسعار الصرف");
    expect(html).toContain("أكواد وقسائم الخصم");
    expect(html).toContain("المالية وبوابات الدفع");

    // Badges
    expect(html).toContain("4");
  });

  it("should highlight active financial tab properly", () => {
    const html = renderToStaticMarkup(
      <AdminSidebar
        activeTab="currencies"
        onTabChange={() => {}}
      />
    );

    expect(html).toContain("bg-primary-container text-on-primary-container");
    expect(html).toContain("العملات وأسعار الصرف");
  });

  it("should render tooltips and aria-labels for all financial items in collapsed mode", () => {
    const html = renderToStaticMarkup(
      <AdminSidebar
        activeTab="quotas"
        onTabChange={() => {}}
        isCollapsed={true}
      />
    );

    expect(html).toContain('title="بوابات الدفع"');
    expect(html).toContain('title="باقات واشتراكات المنصة"');
    expect(html).toContain('title="الصلاحيات والمحددات"');
    expect(html).toContain('title="العملات وأسعار الصرف"');
    expect(html).toContain('title="أكواد وقسائم الخصم"');
    expect(html).toContain('title="المالية وبوابات الدفع"');
  });

  it("should mount all 6 dedicated tab wrapper components without crashing", () => {
    const gatewaysHtml = renderToStaticMarkup(<AdminGatewaysTab />);
    expect(gatewaysHtml).toContain("بوابات الدفع");

    const plansHtml = renderToStaticMarkup(<AdminPlansTab />);
    expect(plansHtml).toContain("باقات واشتراكات المنصة");

    const quotasHtml = renderToStaticMarkup(<AdminQuotasTab />);
    expect(quotasHtml).toContain("باقات واشتراكات المنصة");

    const currenciesHtml = renderToStaticMarkup(<AdminCurrenciesTab />);
    expect(currenciesHtml).toBeDefined();

    const couponsHtml = renderToStaticMarkup(<AdminCouponsTab />);
    expect(couponsHtml).toContain("باقات واشتراكات المنصة");

    const transactionsHtml = renderToStaticMarkup(<AdminTransactionsTab />);
    expect(transactionsHtml).toBeDefined();
  });
});
