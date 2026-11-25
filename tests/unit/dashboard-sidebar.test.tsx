import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DashboardSidebar,
  DashboardSidebarNav,
  DASHBOARD_NAV_ITEMS,
  resolveDashboardPageTitle,
} from "@/features/dashboard";
import DashboardLayout from "@/app/(dashboard)/layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/appearance",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { username: "faisal_tech", role: "ADMIN" } },
    status: "authenticated",
  }),
  signOut: vi.fn(),
}));

describe("Dashboard Sidebar Suite", () => {
  it("renders all 4 dashboard navigation links in sidebar", () => {
    const html = renderToStaticMarkup(<DashboardSidebar currentPath="/dashboard" />);
    expect(DASHBOARD_NAV_ITEMS).toHaveLength(4);
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('href="/dashboard/appearance"');
    expect(html).toContain('href="/dashboard/analytics"');
    expect(html).toContain('href="/dashboard/settings"');
    expect(html).toContain("الروابط");
    expect(html).toContain("المظهر");
    expect(html).toContain("التحليلات");
    expect(html).toContain("الإعدادات");
  });

  it("highlights the active route accurately via aria-current", () => {
    const appearanceHtml = renderToStaticMarkup(
      <DashboardSidebarNav currentPath="/dashboard/appearance" isCollapsedView={false} />
    );
    expect(appearanceHtml).toContain('href="/dashboard/appearance"');
    expect(appearanceHtml).toContain('aria-current="page"');
    expect(resolveDashboardPageTitle("/dashboard/analytics")).toBe("التحليلات");
    expect(resolveDashboardPageTitle("/dashboard/settings")).toBe("الإعدادات");
    expect(resolveDashboardPageTitle("/dashboard")).toBe("الروابط");
  });

  it("supports collapsed desktop width and mobile drawer states", () => {
    const collapsedHtml = renderToStaticMarkup(
      <DashboardSidebar currentPath="/dashboard" isCollapsed={true} />
    );
    expect(collapsedHtml).toContain("w-20");

    const drawerHtml = renderToStaticMarkup(
      <DashboardSidebar
        currentPath="/dashboard/settings"
        isOpenMobile={true}
        onCloseMobile={vi.fn()}
        isAdmin={true}
        username="faisal_tech"
      />
    );
    expect(drawerHtml).toContain("لوحة مدير النظام");
    expect(drawerHtml).toContain('href="/faisal_tech"');
    expect(drawerHtml).toContain("إغلاق القائمة");
  });

  it("mounts DashboardLayout with DashboardShell sidebar and topbar", () => {
    const layoutHtml = renderToStaticMarkup(
      <DashboardLayout>
        <div>workspace-content</div>
      </DashboardLayout>
    );
    expect(layoutHtml).toContain("workspace-content");
    expect(layoutHtml).toContain("المظهر");
    expect(layoutHtml).toContain("لوحة صانع المحتوى");
    expect(layoutHtml).toContain("فتح القائمة الجانبية");
  });
});
