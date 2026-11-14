import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

describe("AdminSidebar Component", () => {
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
    expect(html).toContain("طرق الدفع والاشتراكات");
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
});
