import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("AdminSidebar Component", () => {
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "admin-1",
          name: "مدير النظام",
          username: "sysadmin",
          email: "admin@anlinks.dev",
          role: "ADMIN",
        },
      },
      status: "authenticated",
    } as any);
  });

  it("should render all 6 admin tabs with titles and count badges", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminSidebar, {
        activeTab: "analytics",
        onTabChange: vi.fn(),
        usersCount: 16,
        sessionsCount: 10,
        pendingReportsCount: 9,
        isOpenMobile: false,
        onCloseMobile: vi.fn(),
      })
    );

    expect(html).toContain("الإحصائيات والنمو");
    expect(html).toContain("المستخدمين");
    expect(html).toContain("16");
    expect(html).toContain("الجلسات النشطة");
    expect(html).toContain("10");
    expect(html).toContain("البلاغات والاعتدال");
    expect(html).toContain("9");
    expect(html).toContain("خطط وباقات الاشتراكات");
    expect(html).toContain("العمليات المالية والفواتير");
    expect(html).toContain("إعدادات المنصة");
    expect(html).toContain("لوحة صانع المحتوى");
    expect(html).toContain("الموقع الرئيسي");
  });

  it("should highlight active tab with primary styling", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminSidebar, {
        activeTab: "users",
        onTabChange: vi.fn(),
        usersCount: 16,
        sessionsCount: 10,
        pendingReportsCount: 0,
        isOpenMobile: false,
        onCloseMobile: vi.fn(),
      })
    );

    expect(html).toContain("المستخدمين");
    expect(html).toContain("bg-primary-container");
  });

  it("should render mobile slide-over drawer when isOpenMobile is true", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminSidebar, {
        activeTab: "settings",
        onTabChange: vi.fn(),
        usersCount: 5,
        sessionsCount: 2,
        pendingReportsCount: 1,
        isOpenMobile: true,
        onCloseMobile: vi.fn(),
      })
    );

    expect(html).toContain("fixed inset-0 z-50 lg:hidden");
    expect(html).toContain("slide-in-from-right");
  });

  it("should export and mount AdminConsolePage with responsive sidebar layout", async () => {
    const { default: AdminConsolePage } = await import("@/app/(admin)/admin/page");
    expect(AdminConsolePage).toBeDefined();

    const html = renderToStaticMarkup(React.createElement(AdminConsolePage));
    expect(html).toContain("لوحة المشغّل والمدير");
    expect(html).toContain("إدارة النظام");
  });
});
