import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminSidebarPullHandle } from "@/features/admin/components/AdminSidebarPullHandle";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("AdminSidebar Responsive Unit Tests", () => {
  const onTabChangeMock = vi.fn();
  const onToggleCollapseMock = vi.fn();
  const onCloseMobileMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe("Group 1: Desktop Expanded Mode (isCollapsed: false / default)", () => {
    it("renders default expanded w-72 desktop sidebar container", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          isCollapsed: false,
        })
      );

      expect(html).toContain("w-72");
      expect(html).toContain("hidden lg:block");
      expect(html).not.toContain("w-20");
    });

    it("displays full brand header texts and sub-brand label", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          isCollapsed: false,
        })
      );

      expect(html).toContain("AN LINKS");
      expect(html).toContain("Console المشغّل والمدير");
      expect(html).toContain("flex flex-col");
    });

    it("displays category section headers", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          isCollapsed: false,
        })
      );

      expect(html).toContain("إدارة النظام");
      expect(html).toContain("التنقل السريع");
    });

    it("displays all 6 full tab labels and quick links in expanded buttons", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          isCollapsed: false,
        })
      );

      expect(html).toContain("الإحصائيات والنمو");
      expect(html).toContain("المستخدمين");
      expect(html).toContain("الجلسات النشطة");
      expect(html).toContain("باقات واشتراكات المنصة");
      expect(html).toContain("المالية وبوابات الدفع");
      expect(html).toContain("إعدادات المنصة");
      expect(html).toContain("البلاغات والاعتدال");
      expect(html).toContain("لوحة صانع المحتوى");
      expect(html).toContain("الموقع الرئيسي");
      expect(html).toContain("w-full justify-between px-3.5 py-2.5");
    });

    it("displays full pill badges with counter numbers and styles", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          usersCount: 24,
          sessionsCount: 7,
          pendingReportsCount: 3,
          isCollapsed: false,
        })
      );

      expect(html).toContain("24");
      expect(html).toContain("7");
      expect(html).toContain("3");
      // Expanded pill badges use px-2 py-0.5 rounded-full
      expect(html).toContain("px-2 py-0.5 rounded-full font-mono font-bold");
      expect(html).toContain("bg-error text-white font-bold");
    });

    it("displays collapse toggle button with ChevronRight when onToggleCollapse is provided", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          isCollapsed: false,
          onToggleCollapse: onToggleCollapseMock,
        })
      );

      expect(html).toContain('title="طي القائمة الجانبية"');
      expect(html).toContain('aria-label="طي القائمة الجانبية"');
      expect(html).toContain("lucide-chevron-right");
    });

    it("does not render collapse toggle button when onToggleCollapse is not provided", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "analytics",
          onTabChange: onTabChangeMock,
          isCollapsed: false,
        })
      );

      expect(html).not.toContain('title="طي القائمة الجانبية"');
      expect(html).not.toContain('title="توسيع القائمة الجانبية"');
    });
  });

  describe("Group 2: Desktop Collapsed Rail Mode (isCollapsed: true)", () => {
    it("renders compact w-20 desktop rail container", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
          onToggleCollapse: onToggleCollapseMock,
        })
      );

      expect(html).toContain("w-20");
      expect(html).toContain("hidden lg:block");
    });

    it("hides brand text while keeping logo container centered", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
        })
      );

      // In collapsed view, brand text wrapper has class 'hidden'
      expect(html).toContain('<div class="hidden"><span class="font-black text-sm text-on-surface tracking-tight">AN LINKS</span>');
      expect(html).toContain("Console المشغّل والمدير");
      expect(html).toContain("p-3 flex-col items-center gap-3 justify-center");
    });

    it("replaces category text with horizontal dividers", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
        })
      );

      // Category text strings are not displayed in collapsed rail
      expect(html).not.toContain("إدارة النظام");
      expect(html).not.toContain("التنقل السريع");
      // Instead, dividers with border-t are rendered
      expect(html).toContain('class="my-2 border-t border-outline-variant/15" aria-hidden="true"');
    });

    it("centers nav item buttons with w-12 h-12 mx-auto justify-center", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
        })
      );

      expect(html).toContain("w-12 h-12 mx-auto justify-center px-0 relative");
      expect(html).not.toContain("w-full justify-between px-3.5 py-2.5");
    });

    it("hides tab label text spans while preserving title and aria-label tooltips", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
        })
      );

      // Accessible tooltip attributes are preserved on buttons
      expect(html).toContain('title="الإحصائيات والنمو"');
      expect(html).toContain('aria-label="الإحصائيات والنمو"');
      expect(html).toContain('title="المستخدمين"');
      expect(html).toContain('aria-label="المستخدمين"');
      expect(html).toContain('title="لوحة صانع المحتوى"');
      expect(html).toContain('aria-label="لوحة صانع المحتوى"');
      expect(html).toContain('title="الموقع الرئيسي"');
      expect(html).toContain('aria-label="الموقع الرئيسي"');

      // The inner <span>{item.label}</span> elements are not rendered
      expect(html).not.toContain("<span>الإحصائيات والنمو</span>");
      expect(html).not.toContain("<span>المستخدمين</span>");
      expect(html).not.toContain("<span>لوحة صانع المحتوى</span>");
      expect(html).not.toContain("<span>الموقع الرئيسي</span>");
    });

    it("renders corner miniature badges on collapsed icons", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          usersCount: 15,
          sessionsCount: 8,
          pendingReportsCount: 2,
          isCollapsed: true,
        })
      );

      expect(html).toContain("15");
      expect(html).toContain("8");
      expect(html).toContain("2");
      // Miniature badge positioning
      expect(html).toContain("absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px]");
    });

    it("displays expand toggle button with ChevronLeft when isCollapsed is true", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "users",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
          onToggleCollapse: onToggleCollapseMock,
        })
      );

      expect(html).toContain('title="توسيع القائمة الجانبية"');
      expect(html).toContain('aria-label="توسيع القائمة الجانبية"');
      expect(html).toContain("lucide-chevron-left");
    });
  });

  describe("Group 3: Architectural Isolation (Mobile Drawer vs Desktop Rail)", () => {
    it("renders mobile drawer in expanded mode even when desktop sidebar is collapsed", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "settings",
          onTabChange: onTabChangeMock,
          usersCount: 12,
          sessionsCount: 4,
          pendingReportsCount: 1,
          isCollapsed: true,
          isOpenMobile: true,
          onCloseMobile: onCloseMobileMock,
          onToggleCollapse: onToggleCollapseMock,
        })
      );

      // Desktop sidebar should be collapsed w-20
      expect(html).toContain("hidden lg:block w-20");

      // Mobile drawer should be rendered with expanded w-72 container
      expect(html).toContain("fixed inset-0 z-50 lg:hidden");
      expect(html).toContain("fixed inset-y-0 right-0 w-72 bg-surface-container-lowest shadow-2xl z-10");

      // Mobile drawer MUST render full section headers and labels
      expect(html).toContain("إدارة النظام");
      expect(html).toContain("التنقل السريع");
      expect(html).toContain("<span>إعدادات المنصة</span>");
      expect(html).toContain("<span>لوحة صانع المحتوى</span>");
      expect(html).toContain("<span>الموقع الرئيسي</span>");

      // Mobile drawer MUST include mobile close button X
      expect(html).toContain('aria-label="إغلاق القائمة"');
      expect(html).toContain("lucide-x");

      // Backdrop overlay must exist
      expect(html).toContain("fixed inset-0 bg-black/50 backdrop-blur-sm");
    });

    it("does not render mobile drawer markup when isOpenMobile is false", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebar, {
          activeTab: "settings",
          onTabChange: onTabChangeMock,
          isCollapsed: true,
          isOpenMobile: false,
          onCloseMobile: onCloseMobileMock,
        })
      );

      expect(html).not.toContain("fixed inset-0 z-50 lg:hidden");
      expect(html).not.toContain("slide-in-from-right");
      expect(html).not.toContain('aria-label="إغلاق القائمة"');
    });
  });

  describe("Group 4: Page Mount Integration (AdminConsolePage)", () => {
    it("mounts AdminSidebarPullHandle and header toggle controls in AdminConsolePage", async () => {
      const { default: AdminConsolePage } = await import("@/app/(admin)/admin/page");
      expect(AdminConsolePage).toBeDefined();

      const html = renderToStaticMarkup(React.createElement(AdminConsolePage));

      // 1. AdminSidebarPullHandle attributes
      expect(html).toContain('role="button"');
      expect(html).toContain('aria-label="فتح القائمة الجانبية"');
      expect(html).toContain("fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden");

      // 2. Mobile hamburger button in header
      expect(html).toContain('class="lg:hidden p-2 rounded-xl bg-surface-container');
      expect(html).toContain("lucide-menu");

      // 3. Desktop collapse toggle button in header
      expect(html).toContain('class="hidden lg:flex items-center justify-center p-2 rounded-xl bg-surface-container');
      expect(html).toContain('title="طي القائمة الجانبية"');
      expect(html).toContain('aria-label="طي القائمة الجانبية"');

      // 4. Initial desktop sidebar should be expanded w-72
      expect(html).toContain("hidden lg:block w-72");
      expect(html).toContain("لوحة المشغّل والمدير");
      expect(html).toContain("الإحصائيات والنمو والتحليلات");
    });
  });
});
