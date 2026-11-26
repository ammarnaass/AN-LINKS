import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NewsletterStatsCards } from "@/features/newsletter/components/NewsletterStatsCards";
import { NewsletterBioCardCustomizer } from "@/features/newsletter/components/NewsletterBioCardCustomizer";
import { BioNewsletterCard } from "@/features/bio/components/BioNewsletterCard";

describe("Newsletter Management Suite", () => {
  describe("NewsletterStatsCards", () => {
    it("renders all 4 KPI metric cards correctly", () => {
      const stats = {
        total: 125,
        active: 110,
        unsubscribed: 15,
        thisMonth: 42,
      };

      const html = renderToStaticMarkup(<NewsletterStatsCards stats={stats} />);

      expect(html).toContain("إجمالي المشتركين");
      expect(html).toContain("المشتركون النشطون");
      expect(html).toContain("إلغاء الاشتراك");
      expect(html).toContain("المسجلون هذا الشهر");
    });
  });

  describe("NewsletterBioCardCustomizer", () => {
    it("renders customizer fields and live preview correctly", () => {
      const settings = {
        newsletterEnabled: true,
        newsletterTitle: "النشرة الخاصة بأخبار التقنية",
        newsletterSubtitle: "أخبار الذكاء الاصطناعي أسبوعياً",
        newsletterButtonText: "انضم مجاناً",
        displayName: "عمار",
        accentColor: "#4edea3",
      };

      const html = renderToStaticMarkup(
        <NewsletterBioCardCustomizer
          settings={settings}
          onChange={vi.fn()}
          onSave={vi.fn()}
          isSaving={false}
        />
      );

      expect(html).toContain("تخصيص بطاقة النشرة في صفحة البايو");
      expect(html).toContain("البطاقة مفعّلة");
      expect(html).toContain("النشرة الخاصة بأخبار التقنية");
      expect(html).toContain("أخبار الذكاء الاصطناعي أسبوعياً");
      expect(html).toContain("انضم مجاناً");
    });
  });

  describe("BioNewsletterCard", () => {
    it("renders custom title, subtitle and button text on public bio card", () => {
      const html = renderToStaticMarkup(
        <BioNewsletterCard
          username="test_user"
          displayName="مدير النظام"
          title="نشرة الروابط البريدية"
          subtitle="احصل على أفضل المحتوى كل جمعة"
          buttonText="اشتراك فوري"
          isPreview={true}
        />
      );

      expect(html).toContain("نشرة الروابط البريدية");
      expect(html).toContain("احصل على أفضل المحتوى كل جمعة");
      expect(html).toContain("اشتراك فوري");
    });

    it("falls back to default texts when custom props are omitted", () => {
      const html = renderToStaticMarkup(
        <BioNewsletterCard
          username="test_user"
          displayName="مدير النظام"
          isPreview={true}
        />
      );

      expect(html).toContain("النشرة البريدية لـ مدير النظام");
      expect(html).toContain("احصل على أحدث المحتوى والعروض الحصرية أولاً بأول");
      expect(html).toContain("اشتراك");
    });
  });
});
