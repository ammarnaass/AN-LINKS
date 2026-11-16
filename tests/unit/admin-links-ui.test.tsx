import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminNavTabs } from "@/features/admin/components/AdminNavTabs";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminLinksContainer } from "@/features/admin/components/links/AdminLinksContainer";
import { PlatformsTable } from "@/features/admin/components/links/PlatformsTable";
import { PlatformModal } from "@/features/admin/components/links/PlatformModal";
import { LinksModerationTable } from "@/features/admin/components/links/LinksModerationTable";
import { AnalyticsDeviceCountryCards } from "@/features/admin/components/links/AnalyticsDeviceCountryCards";
import { PlatformDTO } from "@/features/links/types/links.types";
import { AdminLinkItem } from "@/features/admin/types/admin.types";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: "admin-1",
        name: "مدير النظام",
        username: "admin",
        role: "ADMIN",
      },
    },
    status: "authenticated",
  })),
  signOut: vi.fn(),
}));

const mockPlatform: PlatformDTO = {
  id: "plat-yt",
  slug: "youtube",
  nameAr: "يوتيوب",
  nameEn: "YouTube",
  category: "VIDEO",
  defaultIcon: "youtube",
  brandColor: "#FF0000",
  domainPattern: "youtube.com|youtu.be",
  urlPlaceholder: "https://youtube.com/@channel",
  isEnabled: true,
  isVerified: true,
  sortOrder: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  _count: { links: 12, clicks: 350 },
};

const mockAdminLink: AdminLinkItem = {
  id: "link-1",
  title: "قناتي الرسمية",
  url: "https://youtube.com/@official",
  clicksCount: 88,
  isActive: true,
  isPinned: true,
  isArchived: false,
  user: {
    id: "user-1",
    name: "صانع محتوى",
    email: "creator@example.com",
    username: "creator_sa",
  },
  platform: {
    id: "plat-yt",
    slug: "youtube",
    nameAr: "يوتيوب",
    nameEn: "YouTube",
    brandColor: "#FF0000",
  },
  createdAt: "2026-02-01T00:00:00.000Z",
};

describe("Admin Links UI Components Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AdminNavTabs & AdminSidebar Integration", () => {
    it("renders 'links' tab in AdminNavTabs with badge count", () => {
      const html = renderToStaticMarkup(
        <AdminNavTabs
          activeTab="links"
          onTabChange={vi.fn()}
          linksCount={45}
        />
      );

      expect(html).toContain("إدارة الروابط والمنصات");
      expect(html).toContain("45");
      expect(html).toContain("bg-primary");
    });

    it("renders 'links' item in AdminSidebar with badge count", () => {
      const html = renderToStaticMarkup(
        <AdminSidebar
          activeTab="links"
          onTabChange={vi.fn()}
          linksCount={15}
          isCollapsed={false}
        />
      );

      expect(html).toContain("إدارة الروابط والمنصات");
      expect(html).toContain("15");
    });
  });

  describe("AdminLinksContainer", () => {
    it("renders sub-tabs navigation pills and default catalog sub-tab", () => {
      const html = renderToStaticMarkup(
        <AdminLinksContainer initialSubTab="platforms" />
      );

      expect(html).toContain("دليل المنصات");
      expect(html).toContain("الإشراف على الروابط ومراجعتها");
      expect(html).toContain("تحليلات المنصات");
      expect(html).toContain("دليل المنصات المعتمدة");
    });

    it("renders moderation sub-tab when initialized", () => {
      const html = renderToStaticMarkup(
        <AdminLinksContainer initialSubTab="moderation" />
      );

      expect(html).toContain("الإشراف على الروابط ومراجعتها");
      expect(html).toContain("جميع المنصات");
      expect(html).toContain("كل الحالات");
    });

    it("renders analytics sub-tab when initialized", () => {
      const html = renderToStaticMarkup(
        <AdminLinksContainer initialSubTab="analytics" />
      );

      expect(html).toContain("تحليلات المنصات");
      expect(html).toContain("تجميع بيانات التحليلات الفعلية");
    });
  });

  describe("PlatformsTable Component", () => {
    it("renders table rows with platform metadata, badge, and action buttons", () => {
      const html = renderToStaticMarkup(
        <PlatformsTable
          platforms={[mockPlatform]}
          isLoading={false}
          actionLoadingId={null}
          onToggleEnable={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      expect(html).toContain("يوتيوب");
      expect(html).toContain("YouTube");
      expect(html).toContain("youtube");
      expect(html).toContain("VIDEO");
      expect(html).toContain("youtube.com|youtu.be");
      expect(html).toContain("نشطة");
      expect(html).toContain("تعطيل المنصة");
      expect(html).toContain("تعديل المنصة");
      expect(html).toContain("حذف المنصة");
    });

    it("renders empty state when no platforms exist", () => {
      const html = renderToStaticMarkup(
        <PlatformsTable
          platforms={[]}
          isLoading={false}
          actionLoadingId={null}
          onToggleEnable={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      expect(html).toContain("لا توجد منصات مسجلة حالياً");
    });

    it("renders loading state", () => {
      const html = renderToStaticMarkup(
        <PlatformsTable
          platforms={[]}
          isLoading={true}
          actionLoadingId={null}
          onToggleEnable={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      expect(html).toContain("جارٍ تحميل دليل المنصات...");
    });
  });

  describe("PlatformModal Component", () => {
    it("renders modal with input fields for adding a platform", () => {
      const html = renderToStaticMarkup(
        <PlatformModal
          isOpen={true}
          platform={null}
          onClose={vi.fn()}
          onSaved={vi.fn()}
        />
      );

      expect(html).toContain("إضافة منصة جديدة إلى الدليل");
      expect(html).toContain("الاسم بالعربية *");
      expect(html).toContain("الاسم بالإنجليزية *");
      expect(html).toContain("الرمز الفريد (Slug) *");
      expect(html).toContain("الفئة");
      expect(html).toContain("نمط النطاقات (Domain Pattern)");
      expect(html).toContain("لون الهوية (Hex)");
      expect(html).toContain("إضافة المنصة");
    });

    it("renders modal with populated inputs when editing a platform", () => {
      const html = renderToStaticMarkup(
        <PlatformModal
          isOpen={true}
          platform={mockPlatform}
          onClose={vi.fn()}
          onSaved={vi.fn()}
        />
      );

      expect(html).toContain("تعديل المنصة المعتمدة");
      expect(html).toContain("يوتيوب");
      expect(html).toContain("YouTube");
      expect(html).toContain("حفظ التعديلات");
    });

    it("renders nothing when isOpen is false", () => {
      const html = renderToStaticMarkup(
        <PlatformModal
          isOpen={false}
          platform={null}
          onClose={vi.fn()}
          onSaved={vi.fn()}
        />
      );

      expect(html).toBe("");
    });
  });

  describe("LinksModerationTable Component", () => {
    it("renders links moderation rows with creator info and action buttons", () => {
      const html = renderToStaticMarkup(
        <LinksModerationTable
          links={[mockAdminLink]}
          isLoading={false}
          actionLoadingId={null}
          onUpdateLink={vi.fn()}
          page={1}
          totalPages={2}
          onPageChange={vi.fn()}
        />
      );

      expect(html).toContain("قناتي الرسمية");
      expect(html).toContain("https://youtube.com/@official");
      expect(html).toContain("صانع محتوى");
      expect(html).toContain("@creator_sa");
      expect(html).toContain("يوتيوب");
      expect(html).toContain((88).toLocaleString("ar-SA"));
      expect(html).toContain("نشط");
      expect(html).toContain("مثبت");
      expect(html).toContain("تعطيل الرابط");
      expect(html).toContain("إلغاء التثبيت");
      expect(html).toContain("أرشفة الرابط");
      expect(html).toContain("صفحة 1 من 2");
    });

    it("renders empty state when no links match criteria", () => {
      const html = renderToStaticMarkup(
        <LinksModerationTable
          links={[]}
          isLoading={false}
          actionLoadingId={null}
          onUpdateLink={vi.fn()}
          page={1}
          totalPages={1}
          onPageChange={vi.fn()}
        />
      );

      expect(html).toContain("لا توجد روابط مطابقة لمعايير البحث");
    });
  });

  describe("AnalyticsDeviceCountryCards Component", () => {
    it("renders device and country breakdown cards accurately", () => {
      const html = renderToStaticMarkup(
        <AnalyticsDeviceCountryCards
          deviceBreakdown={[
            { device: "MOBILE", count: 850, percentage: 70.8 },
            { device: "DESKTOP", count: 350, percentage: 29.2 },
          ]}
          countryBreakdown={[
            { country: "SA", count: 900, percentage: 75.0 },
            { country: "AE", count: 300, percentage: 25.0 },
          ]}
        />
      );

      expect(html).toContain("توزيع الأجهزة المستخدمة");
      expect(html).toContain("الهواتف الذكية");
      expect(html).toContain("أجهزة الحاسوب");
      expect(html).toContain((850).toLocaleString("ar-SA"));
      expect(html).toContain("70.8%");
      expect(html).toContain("التوزيع الجغرافي للنقرات");
      expect(html).toContain("SA");
      expect(html).toContain("AE");
      expect(html).toContain((900).toLocaleString("ar-SA"));
      expect(html).toContain("75%");
    });

    it("renders empty states when breakdowns have no data", () => {
      const html = renderToStaticMarkup(
        <AnalyticsDeviceCountryCards
          deviceBreakdown={[]}
          countryBreakdown={[]}
        />
      );

      expect(html).toContain("لا توجد بيانات أجهزة كافية");
      expect(html).toContain("لا توجد بيانات جغرافية مسجلة");
    });
  });
});
