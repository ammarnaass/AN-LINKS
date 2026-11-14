# EGM Implementation Plan: 100% Landing Page Pixel Parity with Stitch Reference `_9`

**Document Version:** 2.0.0 (Audited & Refined)  
**Target Reference:** `stitch_arabic_bio_link_platform (1)/stitch_arabic_bio_link_platform/_9` (`_9/code.html` and `_9/screen.png`)  
**Target Route:** `/` (`src/app/page.tsx`) & `src/features/landing/components/`  
**Standard:** Enterprise Grade Modular (EGM) Architecture - Zero-Decision Rule  
**Architectural Limits:** Strictly < 250 lines per file, functions < 40 lines  
**Direction & Language:** RTL First (`dir="rtl"`, `lang="ar"`), `IBM Plex Sans Arabic` & `Cairo`  
**Testing Environment:** Vitest (`environment: "node"`), SSR assertion via `react-dom/server` (`renderToStaticMarkup`)

---

## 1. Architectural Overview & Component Hierarchy

The goal of this plan is to bring `src/app/page.tsx` and all related landing page components in `src/features/landing/components/` into complete 100% visual and structural parity with the reference design `_9/code.html`.

### Reference Section Sequence & Modular Sub-components

```
Page (src/app/page.tsx)
 ├── LandingHeader (Sticky glass header, 5 nav links, ThemeToggle, AuthModal triggers)
 ├── Main
 │    ├── 1. HeroSection (Atmospheric glows, claim username form, live availability dot)
 │    ├── 2. PhoneMockup Showcase
 │    │     ├── FloatingAnalyticsCard (Sparkline SVG, +14,280, ▲ 34.6%)
 │    │     ├── FloatingHealthCard (Link health monitor 100%)
 │    │     ├── FloatingSaleCard (E-book sale 149 SAR notification)
 │    │     └── PhoneChassis & PhoneBentoTiles (Faisal Al-Shammari profile, video, book, podcast, newsletter)
 │    ├── 3. PartnersMarqueeSection (Brand partners grid: 6 partners)
 │    ├── 4. FeaturesSection (5 Bento Cards)
 │    │     ├── FeaturesHeader
 │    │     ├── BrokenLinkCard (WhatsApp 404 simulation)
 │    │     ├── ArabicTypographyCard (Font demo chips)
 │    │     ├── AnalyticsCard (CTR mini bar)
 │    │     ├── InstantCommerceCard (Contactless 1-click pill)
 │    │     └── DynamicQrCard (High-res vector QR preview)
 │    ├── 5. TemplateGallerySection (4 Categories, interactive category switcher card)
 │    ├── 6. HowItWorksSection (3 Numbered timeline steps)
 │    ├── 7. PricingBannerSection (3 Tiers, Monthly/Yearly 20% discount switch)
 │    │     ├── PricingBannerHeader
 │    │     ├── BillingToggle
 │    │     └── PricingTierCard
 │    ├── 8. TestimonialsSection (3 Verified creator cards)
 │    ├── 9. FaqSection (4 Expandable accordion items)
 │    └── 10. GiantCtaSection (Closing CTA banner with username claim bar)
 ├── LandingFooter (4-column footer, newsletter input, system status indicator)
 └── AuthModal (Quick auth modal with login, signup, claim handle mode & toast feedback)
```

---

## 2. File Boundaries & Responsibilities Matrix

| File Path | Responsibility | Line Limit | Function Limit |
|-----------|----------------|------------|----------------|
| `tests/integration/landing-stitch-9-exact.test.ts` | Complete TDD suite asserting exact text, schemas, and SSR markup | < 220 lines | < 40 lines |
| `src/features/landing/constants/landing-pricing.ts` | Dedicated landing pricing tiers (0, 29/23, 79/63 SAR) preserving `/pricing` | < 80 lines | N/A |
| `src/features/landing/constants/templates-data.ts` | 4 Exact creator categories with full verbatim Arabic text & images | < 160 lines | N/A |
| `src/features/landing/constants/testimonials-data.ts` | Exact 3 testimonials and 4 FAQs from `_9` with full verbatim answers | < 120 lines | N/A |
| `src/features/landing/types/landing.types.ts` | TypeScript interfaces for landing props, templates, and pricing tiers | < 80 lines | N/A |
| `src/features/landing/components/PartnersMarqueeSection.tsx` | Brand partners grid (Section 2 in `_9`) | < 80 lines | < 40 lines |
| `src/features/landing/components/AuthModal.tsx` | Interactive quick auth modal dialog with toast | < 140 lines | < 40 lines |
| `src/features/landing/components/LandingHeader.tsx` | Sticky navbar with exact 5 links, auth modal triggers, theme toggle | < 100 lines | < 40 lines |
| `src/features/landing/components/HeroSection.tsx` | Atmospheric hero, claim form, availability indicator | < 120 lines | < 40 lines |
| `src/features/landing/components/PhoneMockup.tsx` | 3D Phone chassis + 3 floating cards + Faisal Al-Shammari profile | < 190 lines | < 40 lines |
| `src/features/landing/components/FeaturesSection.tsx` | 5 Bento cards with WhatsApp simulation & QR engine | < 190 lines | < 40 lines |
| `src/features/landing/components/TemplateGallerySection.tsx` | Interactive 4-tab category switcher card | < 140 lines | < 40 lines |
| `src/features/landing/components/HowItWorksSection.tsx` | 3 numbered step cards | < 90 lines | < 40 lines |
| `src/features/landing/components/PricingBannerSection.tsx` | 3 pricing cards + monthly/yearly discount switch | < 160 lines | < 40 lines |
| `src/features/landing/components/TestimonialsSection.tsx` | 3 verified creator review cards | < 80 lines | < 40 lines |
| `src/features/landing/components/FaqSection.tsx` | 4 expandable accordion items | < 90 lines | < 40 lines |
| `src/features/landing/components/GiantCtaSection.tsx` | Closing CTA with input claim bar | < 90 lines | < 40 lines |
| `src/features/landing/components/LandingFooter.tsx` | 4-column footer with newsletter & system status | < 110 lines | < 40 lines |
| `src/features/landing/index.ts` | Re-exports all components, types, and constants | < 40 lines | N/A |
| `src/app/page.tsx` | Main landing page orchestration in exact 9-section order | < 90 lines | < 40 lines |

---

## 3. Strict Step-by-Step Implementation Instructions (TDD Red-Green Flow)

### Step 1: Write Failing Integration Test Suite (`tests/integration/landing-stitch-9-exact.test.ts`)
- **Action:** Create `tests/integration/landing-stitch-9-exact.test.ts` before modifying any application code.
- **Environment Compatibility:** Vitest operates in `environment: "node"`. All component tests use `renderToStaticMarkup` from `react-dom/server` to assert generated HTML without requiring DOM/jsdom dependencies.
- **Exact Test Specifications:**
  ```ts
  import { describe, it, expect } from "vitest";
  import React from "react";
  import { renderToStaticMarkup } from "react-dom/server";
  import {
    LANDING_TEMPLATES,
    LANDING_TESTIMONIALS,
    LANDING_FAQS,
    LANDING_PRICING_PLANS,
  } from "@/features/landing";

  describe("Stitch _9 Landing Page Exact Parity Test Suite", () => {
    it("should export exact 4 creator template categories", () => {
      expect(LANDING_TEMPLATES).toHaveLength(4);
      const categories = LANDING_TEMPLATES.map((t) => t.category);
      expect(categories).toEqual(["creator", "store", "podcast", "writer"]);
      expect(LANDING_TEMPLATES[0].creatorName).toBe("سارة المهيدب");
      expect(LANDING_TEMPLATES[1].creatorName).toBe("متجر نبتة وخزف");
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

    it("should render LandingHeader with all 5 anchor links matching _9", async () => {
      const { LandingHeader } = await import("@/features/landing");
      const html = renderToStaticMarkup(React.createElement(LandingHeader));
      expect(html).toContain('href="#features"');
      expect(html).toContain('href="#live-demos"');
      expect(html).toContain('href="#pricing"');
      expect(html).toContain('href="#testimonials"');
      expect(html).toContain('href="#faq"');
      expect(html).toContain("روابط");
      expect(html).toContain("Rawabet");
    });

    it("should render PartnersMarqueeSection with 6 brand logos", async () => {
      const { PartnersMarqueeSection } = await import("@/features/landing");
      const html = renderToStaticMarkup(React.createElement(PartnersMarqueeSection));
      expect(html).toContain("صوت");
      expect(html).toContain("متاجرنا");
      expect(html).toContain("إلهام");
      expect(html).toContain("مدار تك");
      expect(html).toContain("أكاديمية نون");
      expect(html).toContain("شبكة أثر");
    });

    it("should render FeaturesSection with all 5 bento cards", async () => {
      const { FeaturesSection } = await import("@/features/landing");
      const html = renderToStaticMarkup(React.createElement(FeaturesSection));
      expect(html).toContain("فحص الروابط الذاتي الذكي");
      expect(html).toContain("محرر بصري يعشق العربية");
      expect(html).toContain("تحليلات دقيقة ولحظية");
      expect(html).toContain("بيع المنتجات وجمع الدفعات");
      expect(html).toContain("رمز QR ديناميكي مخصص");
      expect(html).toContain("رابط العرض الترويجي عاد بكود 404");
    });
  });
  ```

---

### Step 2: Define Landing Pricing Data & Types (`landing-pricing.ts` & `landing.types.ts`)
- **Action:** Create `src/features/landing/constants/landing-pricing.ts` and update `src/features/landing/types/landing.types.ts`.
- **Purpose:** Provide exact `_9` pricing tiers without altering `PRICING_PLANS` in `pricing-plans.ts`, ensuring `tests/integration/pricing-page.test.ts` continues to pass with zero regressions.
- **Interfaces in `src/features/landing/types/landing.types.ts`:**
  ```ts
  export interface LandingPricingTier {
    id: string;
    name: string;
    subtitle: string;
    priceMonthly: number;
    priceYearlyMonthlyEquiv: number;
    periodMonthly: string;
    periodYearly: string;
    isPopular?: boolean;
    popularBadge?: string;
    features: { text: string; included: boolean; bold?: boolean }[];
    ctaText: string;
    ctaPath: string;
  }

  export interface LandingHeaderProps {
    onOpenAuth?: (mode: "login" | "signup" | "claim") => void;
  }

  export interface HeroSectionProps {
    onOpenAuth?: (mode: "login" | "signup" | "claim", handle?: string) => void;
  }

  export interface PricingBannerSectionProps {
    onOpenAuth?: (mode: "login" | "signup" | "claim") => void;
  }

  export interface GiantCtaSectionProps {
    onOpenAuth?: (mode: "login" | "signup" | "claim", handle?: string) => void;
  }

  export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "login" | "signup" | "claim";
    claimHandle?: string;
  }
  ```
- **Data in `src/features/landing/constants/landing-pricing.ts`:**
  ```ts
  import { LandingPricingTier } from "../types/landing.types";

  export const LANDING_PRICING_PLANS: LandingPricingTier[] = [
    {
      id: "free",
      name: "الخطة المجانية",
      subtitle: "مثالية للبدايات وصناع المحتوى الناشئين.",
      priceMonthly: 0,
      priceYearlyMonthlyEquiv: 0,
      periodMonthly: "ر.س / مجاناً دائماً",
      periodYearly: "ر.س / مجاناً دائماً",
      features: [
        { text: "روابط غير محدودة للمحتوى", included: true },
        { text: "إحصائيات الزيارات لآخر 7 أيام", included: true },
        { text: "قوالب تصميم أساسية سريعة", included: true },
        { text: "رمز QR قياسي قابل للمشاركة", included: true },
        { text: "فحص الروابط المعطلة (غير مشمول)", included: false },
      ],
      ctaText: "ابدأ مجاناً الآن",
      ctaPath: "/register",
    },
    {
      id: "pro",
      name: "خطة المحترفين (Pro)",
      subtitle: "لكل من يعتمد على صفحته للنمو وتوليد الدخل.",
      priceMonthly: 29,
      priceYearlyMonthlyEquiv: 23,
      periodMonthly: "ر.س / شهرياً",
      periodYearly: "ر.س / شهرياً (تدفع سنوياً)",
      isPopular: true,
      popularBadge: "الخيار الأكثر طلباً",
      features: [
        { text: "فحص الروابط الذاتي المستمر وتنبيه واتساب", included: true, bold: true },
        { text: "إزالة شعار منصة روابط بالكامل", included: true },
        { text: "ربط دومين مخصص (yourbrand.com)", included: true },
        { text: "بيع المنتجات الرقمية والاشتراكات", included: true },
        { text: "تحليلات متقدمة وربط بيكسل الإعلانات", included: true },
      ],
      ctaText: "ترقية إلى باقة المحترفين",
      ctaPath: "/register?plan=pro",
    },
    {
      id: "business",
      name: "خطة الشركات والفرق",
      subtitle: "للماركات والوكالات التي تدير حسابات متعددة.",
      priceMonthly: 79,
      priceYearlyMonthlyEquiv: 63,
      periodMonthly: "ر.س / شهرياً",
      periodYearly: "ر.س / شهرياً (تدفع سنوياً)",
      features: [
        { text: "كل مميزات باقة المحترفين بلا حدود", included: true },
        { text: "إدارة حتى 10 حسابات بايو مستقلة", included: true },
        { text: "صلاحيات الفريق وأدوار المشرفين", included: true },
        { text: "تصدير تقارير UTM بصيغة PDF و Excel", included: true },
        { text: "دعم فني خاص VIP ومدير حساب مباشر", included: true },
      ],
      ctaText: "اختر باقة الشركات",
      ctaPath: "/register?plan=business",
    },
  ];
  ```

---

### Step 3: Update `templates-data.ts` & `testimonials-data.ts` with Verbatim Data
- **File:** `src/features/landing/constants/templates-data.ts`
  - Implement 4 categories: `creator`, `store`, `podcast`, `writer`.
  - Use standard HTML `<img />` tags for rendering to avoid Next.js external image host issues.
  - Category `creator`: Name "سارة المهيدب", Bio "صانعة محتوى في أسلوب الحياة والتصوير السينمائي. هنا تجد أعمالي، ورش العمل، وروابط المعدات التي استخدمها.", URL "rawabet.me/sarah_m", Avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuBW5Y6crJZQO6qFIJexjW6RZIKABM2b0vI_3lsCXvjLKlPALIP9y0fuaXG7-RvySmwdsMR0GDwJhGx7bgumRDwt7cmOXjNswkjuxC9niY9lbP2E4oPr6yg3GbCvTO7q9PiCh3CbXgG9W1Vp5ahbE-YV7UhRR2GH88O2spkmCF8QtwHMMpzOZlWI6shUOaQKOK_F52EOqSeO9CYGcB56dH5qDobW3GTns3bcXb-yBWPm`.
  - Links:
    1. icon `play_circle`, title `شاهد أحدث فيلم وثائقي: روح العمارة`, color `text-primary`.
    2. icon `download`, title `تحميل حزمة ألوان LUTs السينمائية مجاناً`, color `text-secondary`.
    3. icon `calendar_today`, title `حجز جلسة استشارية تصوير (30 دقيقة)`, color `text-tertiary`.
  - Category `store`: Name "متجر نبتة وخزف", Bio "نباتات داخلية فاخرة وأوانٍ فخارية مصنوعة يدوياً بحب. شحن سريع لكافة مناطق المملكة والخليج.", URL "rawabet.me/nabtastore", Avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuAiHQG-5svtX-byGr_5cfpU0mSLy0pofVz155SvSQQH1UwfxOH314vLEALfTETuPcpFpVborvY04-gRQQ5j0UOWNybAKJm6nI4sMsXlKFvWuYNZAf3HzfMxMFFC--yeAENJu8o-r3sUcTxmvgr-VQz4gtN7NDci5-hRrqOjyquNEayOUDOWhju3b6VME6vbBRITTVzHkNhLqHCidvKyWx33-wgjG-43Bn8EAopprhsv`.
  - Links:
    1. icon `shopping_cart`, title `تصفح أحدث تشكيلة نباتات الظل 2025`, color `text-primary`.
    2. icon `local_offer`, title `كود خصم حصري لمتابعي البايو: RAWABET15`, color `text-secondary`.
    3. icon `support_agent`, title `محادثة خدمة العملاء المباشرة عبر واتساب`, color `text-tertiary`.
  - Category `podcast`: Name "بودكاست زاوية أخرى", Bio "حوارات عميقة ومثيرة مع خبراء التقنية والاقتصاد الجديد. استمع لجميع الحلقات على منصتك المفضلة.", URL "rawabet.me/zawayapod", Avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuBgPlBXkXf6weLj6T7HFZuTb8brTKmEbFRpZ7Urh56JYbGOJizjp6qKXBIgXnIphtTdkolEITHiU7wKO46Hn2Mv0T3BPGXmCebVYTN9k1IJXs6av5MEnr3m-5Iu0hojMMqrvUp_4Fjel5DgUFdp8T0wlkPxW8EGOHN8HR8flXjLhUkwytHFMpFNizyJAF5kF9eXPlZ8lVgGkeHCOJD6_o2GURD3Ufg5cmfBTeh8raVu`.
  - Links:
    1. icon `podcasts`, title `استمع إلى الحلقة الأخيرة على Apple Podcasts`, color `text-primary`.
    2. icon `graphic_eq`, title `مكتبة الحلقات الصوتية على Spotify`, color `text-secondary`.
    3. icon `mail`, title `اشتراك النشرة البريدية الأسبوعية لتحليل الحلقة`, color `text-tertiary`.
  - Category `writer`: Name "د. طارق المنصور", Bio "كاتب ومستشار استراتيجيات النمو المؤسسي. أشارك مقالات متخصصة وأدلة تنفيذية لرواد الأعمال.", URL "rawabet.me/almansoor", Avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree`.
  - Links:
    1. icon `menu_book`, title `تحميل كتاب: استراتيجية المحيط الرقمي (PDF)`, color `text-primary`.
    2. icon `article`, title `قراءة أحدث مقال في نشرة لينكد إن الأسبوعية`, color `text-secondary`.
    3. icon `event_available`, title `طلب استشارة تخطيط استراتيجي للشركات`, color `text-tertiary`.

- **File:** `src/features/landing/constants/testimonials-data.ts`
  - Testimonial 1: عبدالعزيز القرني, مؤسس بودكاست مدار • 120k متابع, avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuBgPlBXkXf6weLj6T7HFZuTb8brTKmEbFRpZ7Urh56JYbGOJizjp6qKXBIgXnIphtTdkolEITHiU7wKO46Hn2Mv0T3BPGXmCebVYTN9k1IJXs6av5MEnr3m-5Iu0hojMMqrvUp_4Fjel5DgUFdp8T0wlkPxW8EGOHN8HR8flXjLhUkwytHFMpFNizyJAF5kF9eXPlZ8lVgGkeHCOJD6_o2GURD3Ufg5cmfBTeh8raVu`, Quote: `«ميزة التنبيه عند تعطل أي رابط أنقذتني في حملة إطلاق دورتي التدريبية الأخيرة. تم إشعارنا فوراً بخطأ في صفحة السلة وأصلحناه دون خسارة تسجيل واحد!»`.
  - Testimonial 2: نورة الصالح, مصممة هوية واستشارية علامات • 45k متابع, avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuB0zFfyrIX7NyPWPQ0fschvaejWd25AtrZvCqe9M-U6BoV6QjfxD-foqxyUJn5nMjI2uDaYXjG2PgFgBpYc03SbzRNliDCVYrVtdt8SVAMgqNiIGqoHLiULvhCnnqz-M1V6yUgX7hftNaSDFsJouBFW0p2PEz3w_2iybhLIowSkAe76kfAUyM5HCb6KrdeIedvIWgaTkwYZXGFZASRSj_I4-k3NxsrRzm_tKsHIbFqX`, Quote: `«أفضل تجربة RTL على الإطلاق. الخطوط العربية مريحة للعين، وتصميم البانتو يعطي انطباعاً فائق الفخامة لعلامتي الشخصية أمام الشركاء والعملاء.»`.
  - Testimonial 3: طارق الدوسري, كاتب ومدرب تجارة رقمية • 88k متابع, avatar `https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree`, Quote: `«بعت أكثر من 400 نسخة من كتابي الإلكتروني مباشرة عبر زر الدفع السريع داخل روابط دون الحاجة لبرمجة متجر كامل أو دفع عمولات معقدة.»`.
  - FAQs:
    1. Question: `هل الخدمة مجانية فعلاً أم لفترة تجريبية محدودة؟`, Answer: `نعم، الخطة المجانية متاحة مدى الحياة بدون أي التزامات وبدون الحاجة لإدخال بطاقتك الائتمانية. يمكنك إضافة روابط غير محدودة ومتابعة الإحصائيات الأساسية ومشاركة صفحتك في أي وقت.`.
    2. Question: `هل يمكنني ربط دوميني الخاص بي (مثل: me.com)؟`, Answer: `بالتأكيد! في باقة المحترفين وباقة الشركات يمكنك ربط نطاقك الشخصي الخاص بضغطة زر مع شهادة أمان SSL مشفرة ومجانية تلقائياً، ليظهر موقعك بهويتك الرسمية الخالصة.`.
    3. Question: `كيف تعمل ميزة فحص الروابط المعطلة وتنبيهات واتساب؟`, Answer: `يقوم نظامنا الآلي بإجراء فحص صحة (Health-check) دوري لكافة الروابط الخارجية في صفحتك للتأكد من أنها تفتح وتعمل. إذا توقف رابط أو أصابه عطل 404، يرسل لك النظام تنبيهاً فورياً على رقم واتساب الخاص بك ويخفي الرابط مؤقتاً لتفادي إحباط الزوار.`.
    4. Question: `كيف أستلم أرباح مبيعات المنتجات والاستشارات الرقمية؟`, Answer: `نوفر تكاملاً سهلاً مع بوابات الدفع المعتمدة (مثل Stripe و Tap وبوابات الدفع المحلية مثل مدى و Apple Pay). يتم إيداع أموال مبيعاتك مباشرة في حسابك البنكي بدون تأخير أو وسطاء معقدين.`.

---

### Step 4: Build `PartnersMarqueeSection.tsx` (Brand Partners Logo Grid)
- **File:** `src/features/landing/components/PartnersMarqueeSection.tsx`
- **Specification:**
  - Container: `w-full py-12 bg-surface-container-low/50 px-6 lg:px-12`.
  - Headline: `يثق بنا نخبة من رواد الأعمال وصناع المحتوى والماركات الرائدة في العالم العربي`.
  - 6 Brand items:
    1. `podcasts` + `صوت`
    2. `storefront` + `متاجرنا`
    3. `auto_awesome` + `إلهام`
    4. `rocket` + `مدار تك`
    5. `school` + `أكاديمية نون`
    6. `hub` + `شبكة أثر`
  - Function length: < 35 lines.

---

### Step 5: Build `AuthModal.tsx` (Interactive Auth Dialog with Toast)
- **File:** `src/features/landing/components/AuthModal.tsx`
- **Props:** `AuthModalProps` (from `landing.types.ts`).
- **Behavior:**
  - Title:
    - `"login"`: `تسجيل الدخول إلى حسابك`
    - `"signup"`: `إنشاء حساب جديد مجاناً`
    - `"claim"`: `الدخول السريع للوحة التحكم`
  - Reservation banner: When `claimHandle` is passed, shows `تم حجز الرابط rawabet.me/${claimHandle} لك بنجاح!` with emerald check.
  - Action buttons:
    - `المتابعة إلى لوحة التحكم فوراً` (triggers toast then redirects to `/dashboard`).
    - `تسجيل الدخول بحساب Google` (triggers toast then redirects to `/login`).
  - Internal Toast: Embedded floating toast notification (`toast-notification`) with auto-dismiss after 3000ms.
  - Sub-components: `AuthModalHeader`, `AuthModalButtons`, `AuthModalToast` to maintain each function < 30 lines.

---

### Step 6: Refactor `LandingHeader.tsx`
- **File:** `src/features/landing/components/LandingHeader.tsx`
- **Props:** `LandingHeaderProps` (`onOpenAuth?: (mode: "login" | "signup" | "claim") => void`).
- **Features:**
  - Logo: `link` icon, `روابط` (bold), `Rawabet` (text-primary uppercase).
  - 5 Anchor links: `#features`, `#live-demos`, `#pricing`, `#testimonials`, `#faq`.
  - Action buttons: `ThemeToggle`, `تسجيل الدخول` (`onClick={() => onOpenAuth?.("login")}`), `ابدأ مجاناً` with `rocket_launch` icon (`onClick={() => onOpenAuth?.("signup")}`), Profile avatar button (links to `/dashboard`).
  - Function length: < 40 lines.

---

### Step 7: Refactor `HeroSection.tsx`
- **File:** `src/features/landing/components/HeroSection.tsx`
- **Props:** `HeroSectionProps` (`onOpenAuth?: (mode: "login" | "signup" | "claim", handle?: string) => void`).
- **Features:**
  - Ambient glow blur backdrops.
  - Pill badge: `✨ المنصة العربية الأولى لروابط البايو الذكية والتفاعلية`.
  - Headline: `رابط واحد يجمع <span class="text-primary drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]">عالمك الرقمي</span> بالكامل ويضاعف وصولك`.
  - Subtitle: `ابنِ صفحة بايو مذهلة بتصميم بانتو عصري، مع ميزة الفحص الذاتي للروابط المعطلة، ونماذج بيع المنتجات الرقمية، وتحليلات فورية في أقل من 60 ثانية.`.
  - Claim form card: prefix `rawabet.me/`, text input default `faisal`, button `احجز رابطك مجاناً` with `bolt` icon. Submitting triggers `onOpenAuth?.("claim", sanitizedHandle)`.
  - Dynamic availability badge: `rawabet.me/${handle} متاح للتسجيل الفوري` with pulsing emerald dot.
  - 3 Proof indicators: `+50,000 صانع محتوى وشركة`, `تقييم 4.9/5 نجوم`, `بدون بطاقة ائتمانية`.
  - Function decomposition: `HeroBadgeHeader`, `HeroClaimForm`, `HeroProofRow` (< 35 lines each).

---

### Step 8: Refactor `PhoneMockup.tsx`
- **File:** `src/features/landing/components/PhoneMockup.tsx`
- **Decomposition (strictly < 40 lines per function):**
  1. `FloatingAnalyticsCard`: SVG sparkline path, `+14,280`, `▲ 34.6%`.
  2. `FloatingHealthCard`: `فاحص الروابط الذكي`, `جميع الروابط تعمل 100% بنجاح`.
  3. `FloatingSaleCard`: `مبيعة كتاب إلكتروني جديدة`, `149 ر.س • منذ دقيقتين`.
  4. `PhoneBentoTiles`: Featured video tile with time badge, digital book tile (149 SAR), podcast tile, newsletter input.
  5. `PhoneChassis`: Assembles speaker notch, Faisal Al-Shammari avatar with check badge, bio, social icons row, and `PhoneBentoTiles`.
  6. `PhoneMockup`: Root layout container assembling chassis and floating cards.

---

### Step 9: Refactor `FeaturesSection.tsx`
- **File:** `src/features/landing/components/FeaturesSection.tsx`
- **Decomposition (strictly < 40 lines per function):**
  1. `FeaturesHeader`: `المميزات الحصرية`, `صُممت بعناية لتتفوق على كافة منصات الروابط التقليدية`.
  2. `BrokenLinkCard` (Span 7): WhatsApp alert simulation banner (`رابط العرض الترويجي عاد بكود 404...`).
  3. `ArabicTypographyCard` (Span 5): Typography chips (`IBM Plex Sans`, `خط الجزيرة`, `خط القاهرة الحديث`, `+ خيارات غير محدودة`).
  4. `AnalyticsCard` (Span 4): CTR mini bar (18.4% CTR, Instagram 65%, TikTok 25%, Other 10%).
  5. `InstantCommerceCard` (Span 4): Contactless 1-click pill (`دفع فوري بنقرة واحدة`).
  6. `DynamicQrCard` (Span 4): High-res vector preview (`صيغ SVG, PNG الفائقة`).
  7. `FeaturesSection`: Grid wrapper assembling the 5 cards.

---

### Step 10: Refactor `TemplateGallerySection.tsx`
- **File:** `src/features/landing/components/TemplateGallerySection.tsx`
- **Features:**
  - Section anchor: `id="live-demos"`.
  - Header: `تجربة حية تفاعلية`, `لكل مبدع بصمته الخاصة.. تصفّح النماذج الجاهزة`.
  - 4 Category buttons: `creator` (default), `store`, `podcast`, `writer`.
  - Dynamic preview card displaying category avatar, name, bio, handle URL, and 3 custom link cards.
  - Card footer with `أكثر من 120 قالباً مهيأ لكافة المنصات والمجالات` and `تصفح كافة القوالب الحية` button.
  - Functions: `GalleryHeader`, `CategoryTabs`, `ShowcaseCard` (< 35 lines each).

---

### Step 11: Refactor `HowItWorksSection.tsx`
- **File:** `src/features/landing/components/HowItWorksSection.tsx`
- **Features:**
  - Header: `سهولة لا تضاهى`, `كيف تبدأ مع «روابط» في 3 خطوات بسيطة؟`.
  - 3 Steps:
    - Step 1: Number `1`, `اختر اسم رابطك الفريد` (`حجز فوري ومجاني`).
    - Step 2: Number `2`, `رتّب وخصّص مظهرك` (`سحب وإفلات بديهي`).
    - Step 3: Number `3`, `شارك وتتبّع نموك` (`إحصائيات مباشرة دقيقة`).
  - Strip redundant CTA banner from this component.

---

### Step 12: Refactor `PricingBannerSection.tsx`
- **File:** `src/features/landing/components/PricingBannerSection.tsx`
- **Props:** `PricingBannerSectionProps` (`onOpenAuth?: (mode: "login" | "signup" | "claim") => void`).
- **Decomposition (strictly < 40 lines per function):**
  1. `PricingBannerHeader`: `باقات واضحة ومدروسة`, `استثمر في حضورك الرقمي دون أي تكاليف خفية`.
  2. `BillingToggle`: Switch for monthly vs yearly with `وفر 20%` badge.
  3. `PricingTierCard`: Renders individual tier (Free, Pro with popular badge, Business).
  4. `PricingBannerSection`: Manages `isYearly` state and renders the 3 cards.

---

### Step 13: Refactor `TestimonialsSection.tsx` & `FaqSection.tsx`
- **Files:** `TestimonialsSection.tsx`, `FaqSection.tsx`
- **TestimonialsSection (`id="testimonials"`):**
  - Header: `قصص نجاح`, `ماذا يقول صناع المحتوى ورواد الأعمال عنا؟`.
  - 3 Reviews with 5 stars, verbatim Arabic quotes, author avatars, names, and follower captions.
- **FaqSection (`id="faq"`):**
  - Header: `الأسئلة المتكررة`, `كل ما تحتاج معرفته عن منصة روابط`.
  - 4 Collapsible accordion items with smooth chevron rotation.

---

### Step 14: Refactor `GiantCtaSection.tsx` & `LandingFooter.tsx`
- **Files:** `GiantCtaSection.tsx`, `LandingFooter.tsx`
- **GiantCtaSection:**
  - Props: `GiantCtaSectionProps` (`onOpenAuth?: (mode: "login" | "signup" | "claim", handle?: string) => void`).
  - Badge: `انضم لأكثر من 50 ألف مبدع عربي اليوم`.
  - Headline: `جاهز لتوحيد حضورك الرقمي في <span class="text-primary">رابط واحد استثنائي؟</span>`.
  - Claim bar: prefix `rawabet.me/`, input `اسمك_الجديد`, and `ابدأ الآن مجاناً` button.
  - Micro-trust note: `لا يتطلب بطاقة ائتمانية • إعداد سهل في 60 ثانية • دعم فني عربي على مدار الساعة`.
- **LandingFooter:**
  - 4 Columns: Brand mission & newsletter input, `المنتج`, `المصادر والدعم`, `قانوني وشبكاتنا`.
  - Bottom bar: Copyright notice + system status indicator with pulsing dot.

---

### Step 15: Assemble `src/app/page.tsx`
- **File:** `src/app/page.tsx`
- **Client Orchestration:**
  - Mark with `"use client"`.
  - Manage state: `authOpen: boolean`, `authMode: "login" | "signup" | "claim"`, `authHandle: string`.
  - Render all 9 sections in exact order:
    1. `<LandingHeader onOpenAuth={(mode) => { setAuthMode(mode); setAuthOpen(true); }} />`
    2. `<HeroSection onOpenAuth={(mode, handle) => { setAuthMode(mode); setAuthHandle(handle || "faisal"); setAuthOpen(true); }} />`
    3. `<section className="relative px-4 sm:px-6 pb-20 sm:pb-28"><PhoneMockup /></section>`
    4. `<PartnersMarqueeSection />`
    5. `<FeaturesSection />`
    6. `<TemplateGallerySection />`
    7. `<HowItWorksSection />`
    8. `<PricingBannerSection onOpenAuth={(mode) => { setAuthMode(mode); setAuthOpen(true); }} />`
    9. `<TestimonialsSection />`
    10. `<FaqSection />`
    11. `<GiantCtaSection onOpenAuth={(mode, handle) => { setAuthMode(mode); setAuthHandle(handle || "faisal"); setAuthOpen(true); }} />`
    12. `<LandingFooter />`
    13. `<AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} claimHandle={authHandle} />`

---

### Step 16: Automated Verification & Gates
- Run `npm test` -> All 21 test suites must pass (including the new `landing-stitch-9-exact.test.ts`).
- Run `npm run build` -> Clean compilation of all 15 routes with zero TypeScript or Hydration errors.
- Run live test on `http://localhost:3002` -> Status 200 OK.
