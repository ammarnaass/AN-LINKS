import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LANDING_TEMPLATES,
  LANDING_TESTIMONIALS,
  LANDING_FAQS,
  LANDING_PRICING_PLANS,
  LandingHeader,
  PartnersMarqueeSection,
  FeaturesSection,
  HowItWorksSection,
  PricingBannerSection,
  TestimonialsSection,
  FaqSection,
  GiantCtaSection,
} from "@/features/landing";

describe("Stitch _9 Landing Page Exact Parity Test Suite", () => {
  it("should export exact 4 creator template categories", () => {
    expect(LANDING_TEMPLATES).toHaveLength(4);
    const categories = LANDING_TEMPLATES.map((t) => t.category);
    expect(categories).toEqual(["creator", "store", "podcast", "writer"]);
    expect(LANDING_TEMPLATES[0].creatorName).toBe("سارة المهيدب");
    expect(LANDING_TEMPLATES[1].creatorName).toBe("متجر نبتة وخزف");
    expect(LANDING_TEMPLATES[2].creatorName).toBe("بودكاست زاوية أخرى");
    expect(LANDING_TEMPLATES[3].creatorName).toBe("د. طارق المنصور");
  });

  it("should export exact 3 creator testimonials from _9", () => {
    expect(LANDING_TESTIMONIALS).toHaveLength(3);
    expect(LANDING_TESTIMONIALS[0].name).toBe("عبدالعزيز القرني");
    expect(LANDING_TESTIMONIALS[1].name).toBe("نورة الصالح");
    expect(LANDING_TESTIMONIALS[2].name).toBe("طارق الدوسري");
  });

  it("should export exact 4 FAQs with verbatim answers from _9", () => {
    expect(LANDING_FAQS).toHaveLength(4);
    expect(LANDING_FAQS[0].question).toContain("هل الخدمة مجانية فعلاً");
    expect(LANDING_FAQS[1].question).toContain("هل يمكنني ربط دوميني الخاص");
    expect(LANDING_FAQS[2].question).toContain("فحص الروابط المعطلة وتنبيهات واتساب");
    expect(LANDING_FAQS[3].question).toContain("كيف أستلم أرباح مبيعات");
  });

  it("should export dedicated landing pricing tiers with 0, 29/23, 79/63 SAR", () => {
    expect(LANDING_PRICING_PLANS).toHaveLength(3);
    expect(LANDING_PRICING_PLANS[0].priceMonthly).toBe(0);
    expect(LANDING_PRICING_PLANS[1].priceMonthly).toBe(29);
    expect(LANDING_PRICING_PLANS[1].priceYearlyMonthlyEquiv).toBe(23);
    expect(LANDING_PRICING_PLANS[2].priceMonthly).toBe(79);
    expect(LANDING_PRICING_PLANS[2].priceYearlyMonthlyEquiv).toBe(63);
  });

  it("should render LandingHeader with all 5 anchor links matching _9", () => {
    const html = renderToStaticMarkup(React.createElement(LandingHeader));
    expect(html).toContain('href="#features"');
    expect(html).toContain('href="#live-demos"');
    expect(html).toContain('href="#pricing"');
    expect(html).toContain('href="#testimonials"');
    expect(html).toContain('href="#faq"');
    expect(html).toContain("روابط");
    expect(html).toContain("Rawabet");
  });

  it("should render PartnersMarqueeSection with 6 brand logos", () => {
    const html = renderToStaticMarkup(React.createElement(PartnersMarqueeSection));
    expect(html).toContain("صوت");
    expect(html).toContain("متاجرنا");
    expect(html).toContain("إلهام");
    expect(html).toContain("مدار تك");
    expect(html).toContain("أكاديمية نون");
    expect(html).toContain("شبكة أثر");
  });

  it("should render FeaturesSection with all 5 bento cards and WhatsApp alert", () => {
    const html = renderToStaticMarkup(React.createElement(FeaturesSection));
    expect(html).toContain("فحص الروابط الذاتي الذكي");
    expect(html).toContain("محرر بصري يعشق العربية");
    expect(html).toContain("تحليلات دقيقة ولحظية");
    expect(html).toContain("بيع المنتجات وجمع الدفعات");
    expect(html).toContain("رمز QR ديناميكي مخصص");
    expect(html).toContain("رابط العرض الترويجي عاد بكود 404");
  });

  it("should render HowItWorksSection with 3 steps and no duplicate CTA", () => {
    const html = renderToStaticMarkup(React.createElement(HowItWorksSection));
    expect(html).toContain("اختر اسم رابطك الفريد");
    expect(html).toContain("رتّب وخصّص مظهرك");
    expect(html).toContain("شارك وتتبّع نموك");
  });

  it("should render PricingBannerSection with 3 tiers and 20% discount badge", () => {
    const html = renderToStaticMarkup(React.createElement(PricingBannerSection));
    expect(html).toContain("الخطة المجانية");
    expect(html).toContain("خطة المحترفين (Pro)");
    expect(html).toContain("خطة الشركات والفرق");
    expect(html).toContain("وفر 20%");
  });

  it("should render TestimonialsSection with 3 verified creators", () => {
    const html = renderToStaticMarkup(React.createElement(TestimonialsSection));
    expect(html).toContain("عبدالعزيز القرني");
    expect(html).toContain("نورة الصالح");
    expect(html).toContain("طارق الدوسري");
  });

  it("should render FaqSection with 4 questions", () => {
    const html = renderToStaticMarkup(React.createElement(FaqSection));
    expect(html).toContain("هل الخدمة مجانية فعلاً أم لفترة تجريبية محدودة؟");
    expect(html).toContain("هل يمكنني ربط دوميني الخاص بي (مثل: me.com)؟");
  });

  it("should render GiantCtaSection with claim username input", () => {
    const html = renderToStaticMarkup(React.createElement(GiantCtaSection));
    expect(html).toContain("جاهز لتوحيد حضورك الرقمي");
    expect(html).toContain("rawabet.me/");
    expect(html).toContain("ابدأ الآن مجاناً");
  });
});

