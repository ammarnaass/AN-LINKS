import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { FeaturesSection, PhoneMockup } from "@/features/landing";
import { LinkButton } from "@/features/bio";
import { SocialLinksEditor } from "@/features/links";

describe("Stitch Pixel Fidelity Verification", () => {
  it("should render all 4 Stitch _9 Bento Cards with micro-mockups", () => {
    const html = renderToString(React.createElement(FeaturesSection));
    expect(html).toContain("فحص الروابط الذاتي الذكي");
    expect(html).toContain("روبوت روابط (واتساب)");
    expect(html).toContain("محرر بصري يعشق العربية");
    expect(html).toContain("IBM Plex Sans");
    expect(html).toContain("تحليلات دقيقة ولحظية");
    expect(html).toContain("نسبة النقر للظهور (CTR)");
    expect(html).toContain("بيع المنتجات وجمع الدفعات");
    expect(html).toContain("دفع فوري 1-Click");
  });

  it("should render PhoneMockup with 3 floating cards and Faisal profile", () => {
    const html = renderToString(React.createElement(PhoneMockup));
    expect(html).toContain("زيارات اليوم المباشرة");
    expect(html).toContain("+14,280");
    expect(html).toContain("فاحص الروابط الذكي");
    expect(html).toContain("مبيعة كتاب إلكتروني جديدة");
    expect(html).toContain("فيصل الشمري");
    expect(html).toContain("كتاب احتراف هندسة الأوامر");
  });

  it("should render LinkButton with highlightBadge chip", () => {
    const link = {
      id: "l1",
      userId: "u1",
      title: "متجري الإلكتروني",
      url: "https://store.tariq.sa",
      active: true,
      order: 0,
      clicks: 140,
    };
    const html = renderToString(
      React.createElement(LinkButton, {
        link,
        highlightBadge: "خصم 20% لفترة محدودة",
      })
    );
    expect(html).toContain("خصم 20% لفترة محدودة");
  });

  it("should render SocialLinksEditor with platform counter and reorder action", () => {
    const socials = [
      { id: "s1", network: "instagram", url: "https://instagram.com/tariq" },
    ];
    const html = renderToString(
      React.createElement(SocialLinksEditor, {
        socials,
        onSocialsChange: () => {},
      })
    );
    expect(html).toContain("1 منصات متصلة");
    expect(html).toContain("ترتيب الأيقونات");
  });
});
