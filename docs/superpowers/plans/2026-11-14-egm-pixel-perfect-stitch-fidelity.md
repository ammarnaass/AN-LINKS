# EGM Implementation Plan: Pixel-Perfect Stitch Fidelity & Design Parity

> **EGM Implementation Readiness Standard Compliance:**
> This document follows the Elephant-Goldfish Model (EGM) Implementation Readiness Standard. All architecture, component contracts, CSS design tokens, data models, and verification steps are strictly pre-determined with zero design choices left to the implementer.

**Feature Goal:** Achieve 100% pixel-perfect visual fidelity and functional parity across all 15 routes and components of AN LINKS against the design suite in `stitch_arabic_bio_link_platform (1)` (`_1` through `_10`, `public_bio_page`, `light_mode_1..3`, `layan_dark_arabic_bento/DESIGN.md`, and `rawabet_luxury_light/DESIGN.md`), preserving the strict feature-modular architecture (<250 lines per file).

---

## 1. Target Scope & File Boundaries

| Relative File Path | Action | Line Range Target | Max Lines Target | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `src/features/landing/components/FeaturesSection.tsx` | Modify | L55-L85 | < 160 lines | 4 Stitch `_9` Bento Cards with WhatsApp Banner, Typography Chips, CTR bar, & Payment Pill |
| `src/features/landing/components/PhoneMockup.tsx` | Modify | L1-L150 | < 220 lines | 3 Floating Cards (Sparkline, Sentinel, New Sale) & Central Chassis (فيصل الشمري) |
| `src/features/bio/components/LinkButton.tsx` | Modify | L9-L65 | < 110 lines | Add optional `highlightBadge` prop with styled pill tag |
| `src/features/links/components/SocialLinksEditor.tsx` | Modify | L70-L85 | < 180 lines | Add reordering toggle mode and active connected badge |
| `tests/integration/stitch-pixel-fidelity.test.ts` | Create | Full file | < 150 lines | Comprehensive Vitest suite for all Stitch design tokens & contracts |

---

## 2. Phase 1: Landing Page Micro-Mockups Parity (Stitch `_9`)

### 2.1 File: `src/features/landing/components/FeaturesSection.tsx`

#### Concrete JSX Structure & CSS Utility Specifications:
Replace the generic features card loop in lines 57-84 with the four dedicated Bento cards matching Stitch `_9/code.html`:

```tsx
// Card 1: فحص الروابط الذاتي الذكي
<div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-[28px]">link_off</span>
      </div>
      <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">
        حصري
      </span>
    </div>
    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
      فحص الروابط الذاتي الذكي
    </h3>
    <p className="text-sm text-on-surface-variant leading-relaxed">
      لا تفقد أي مبيعة أو زائر بسبب رابط منتهي أو فيديو محذوف. روبوت روابط يفحص جميع وجهاتك على مدار الساعة ويرسل لك تنبيهاً فورياً عبر واتساب عند تعطل أي رابط.
    </p>
  </div>
  {/* WhatsApp Alert Banner */}
  <div className="mt-8 bg-surface-container-high/90 rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[20px]">chat</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-on-surface">روبوت روابط (واتساب)</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <span className="text-xs text-on-surface-variant">تنبيه فوري: رابط متجرك عاد للعمل بسرعة 48ms</span>
      </div>
    </div>
    <span className="text-[11px] font-mono text-outline shrink-0">الآن</span>
  </div>
</div>

// Card 2: محرر بصري يعشق العربية
<div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-secondary-container/30 text-secondary flex items-center justify-center">
      <span className="material-symbols-outlined text-[28px]">palette</span>
    </div>
    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
      محرر بصري يعشق العربية
    </h3>
    <p className="text-sm text-on-surface-variant leading-relaxed">
      اختر من بين أكثر من 30 خطاً عربياً أصيلاً، تأثيرات زجاجية ثلاثية الأبعاد، وتدرجات إضاءة نيون تعكس هوية علامتك باحترافية كاملة.
    </p>
  </div>
  {/* Typography Demo Chips */}
  <div className="mt-8 flex flex-wrap gap-2.5">
    {["IBM Plex Sans", "خط الجزيرة", "الكوفي المودرن", "النسخ الرقمي"].map((font) => (
      <span
        key={font}
        className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:text-primary transition-colors cursor-pointer border border-white/5"
      >
        {font}
      </span>
    ))}
  </div>
</div>

// Card 3: تحليلات دقيقة ولحظية
<div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-tertiary-container/20 text-tertiary flex items-center justify-center">
      <span className="material-symbols-outlined text-[28px]">query_stats</span>
    </div>
    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
      تحليلات دقيقة ولحظية
    </h3>
    <p className="text-sm text-on-surface-variant leading-relaxed">
      تعرف على مصادر حركة المرور، الدول، أنواع الأجهزة، وأوقات الذروة مع دعم لربط Meta Pixel و Google Analytics.
    </p>
  </div>
  {/* Mini Inline CTR Progress Bar */}
  <div className="mt-8 flex flex-col gap-2 bg-surface-container-high/60 p-4 rounded-xl border border-white/5">
    <div className="flex justify-between items-center text-on-surface-variant text-xs">
      <span>نسبة النقر للظهور (CTR)</span>
      <span className="text-tertiary font-bold font-mono">18.4%</span>
    </div>
    <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex">
      <div className="bg-primary h-full w-[65%] rounded-full" />
      <div className="bg-tertiary h-full w-[25%]" />
    </div>
    <div className="flex justify-between text-outline text-[10px] font-mono">
      <span>زوار مباشرين 65%</span>
      <span>تواصل اجتماعي 25%</span>
    </div>
  </div>
</div>

// Card 4: بيع المنتجات وجمع الدفعات
<div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
      <span className="material-symbols-outlined text-[28px]">payments</span>
    </div>
    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
      بيع المنتجات وجمع الدفعات
    </h3>
    <p className="text-sm text-on-surface-variant leading-relaxed">
      قم ببيع ملفات PDF، الاستشارات الصوتية، وخدماتك مباشرة من البايو مع دعم وسائل الدفع المحلية (مدى، Apple Pay، والبطاقات).
    </p>
  </div>
  {/* Quick Checkout Feature Pill */}
  <div className="mt-8 flex items-center justify-between p-3.5 bg-surface-container-high/60 rounded-xl border border-white/5">
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-primary text-[24px]">contactless</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-on-surface">دفع فوري 1-Click</span>
        <span className="text-[10px] text-on-surface-variant">مدى • Apple Pay • بطاقات ائتمانية</span>
      </div>
    </div>
    <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">SAR</span>
  </div>
</div>
```

---

### 2.2 File: `src/features/landing/components/PhoneMockup.tsx`

#### Floating Cards & Phone Chassis Specifications:
1. **Floating Card 1 (Top-Left):**
```tsx
<div className="hidden lg:flex absolute -left-6 top-12 z-20 flex-col gap-2 p-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-60 transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
  <div className="flex items-center justify-between">
    <span className="text-xs text-on-surface-variant font-semibold">زيارات اليوم المباشرة</span>
    <span className="inline-flex p-1 rounded-md bg-primary-container/15 text-primary">
      <span className="material-symbols-outlined text-[18px]">trending_up</span>
    </span>
  </div>
  <div className="flex items-baseline gap-2">
    <span className="text-xl font-bold text-on-surface font-mono">+14,280</span>
    <span className="text-xs text-primary font-bold font-mono">▲ 34.6%</span>
  </div>
  <svg className="w-full h-8 text-primary overflow-visible mt-1" fill="none" viewBox="0 0 100 24">
    <path d="M0 18 Q 20 8, 35 15 T 65 5 T 100 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    <path d="M0 18 Q 20 8, 35 15 T 65 5 T 100 2 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1" />
  </svg>
</div>
```

2. **Floating Card 2 (Bottom-Right):**
```tsx
<div className="hidden lg:flex absolute -right-6 bottom-16 z-20 items-center gap-3.5 p-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-64 transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
  <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
    <span className="material-symbols-outlined text-[24px]">verified_user</span>
  </div>
  <div className="flex flex-col min-w-0">
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-bold text-on-surface">فاحص الروابط الذكي</span>
      <span className="w-2 h-2 rounded-full bg-primary" />
    </div>
    <span className="text-xs text-primary truncate">جميع الروابط تعمل 100% بنجاح</span>
  </div>
</div>
```

3. **Floating Card 3 (Top-Right):**
```tsx
<div className="hidden lg:flex absolute -right-2 top-8 z-20 items-center gap-3 p-3.5 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-white/5">
  <div className="w-9 h-9 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center">
    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
  </div>
  <div className="flex flex-col">
    <span className="text-xs text-on-surface font-bold">مبيعة كتاب إلكتروني جديدة</span>
    <span className="text-[11px] text-on-surface-variant font-mono">149 ر.س • منذ دقيقتين</span>
  </div>
</div>
```

4. **Central Phone Chassis Screen (فيصل الشمري):**
```tsx
<div className="relative w-[340px] sm:w-[375px] rounded-[44px] bg-surface-container-highest p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10">
  {/* Notch */}
  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-surface-container-lowest rounded-full z-30 flex items-center justify-center gap-2">
    <div className="w-2 h-2 rounded-full bg-surface-variant" />
    <div className="w-8 h-1 rounded-full bg-surface-variant" />
  </div>

  <div className="w-full bg-surface-container-lowest rounded-[36px] overflow-hidden p-5 pt-12 flex flex-col items-center">
    {/* Avatar */}
    <div className="relative mb-3">
      <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary via-tertiary to-secondary shadow-md flex items-center justify-center overflow-hidden">
        <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center text-2xl font-bold text-white">
          ف
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-slate-900 flex items-center justify-center font-bold text-xs shadow">
        ✓
      </div>
    </div>

    <h3 className="text-base font-bold text-on-surface text-center">فيصل الشمري</h3>
    <p className="text-xs text-on-surface-variant text-center max-w-[260px] mt-1 mb-4 leading-relaxed">
      صانع محتوى تقني ومؤسس استوديو «ابتكار». أشارك أسرار الذكاء الاصطناعي والتجارة الرقمية.
    </p>

    {/* Social Quick Icons */}
    <div className="flex items-center gap-2 mb-4">
      {["play_circle", "chat", "podcasts", "mail"].map((icon) => (
        <span key={icon} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </span>
      ))}
    </div>

    {/* Bento Bio Tiles Stack */}
    <div className="w-full flex flex-col gap-2.5">
      {/* Tile 1: Video */}
      <div className="w-full bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 hover:bg-surface-container transition-colors cursor-pointer border border-white/5">
        <div className="relative w-full h-24 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary text-slate-900 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[22px]">play_arrow</span>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/80 text-[10px] font-mono text-primary font-bold">
            جديد 18:42 دقيقة
          </div>
        </div>
        <span className="text-xs font-bold text-on-surface truncate">دليل أدوات الذكاء الاصطناعي 2025</span>
      </div>

      {/* Tile 2: Product */}
      <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer border border-white/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-on-surface truncate">كتاب احتراف هندسة الأوامر</span>
            <span className="text-[10px] text-on-surface-variant">PDF + قوالب جاهزة</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-xs font-bold text-primary font-mono">149 ر.س</span>
          <span className="text-[9px] text-amber-400 font-bold">خصم 30%</span>
        </div>
      </div>

      {/* Tile 3: Consultation */}
      <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer border border-white/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-on-surface truncate">حجز استشارة خاصة 45 دقيقة</span>
            <span className="text-[10px] text-on-surface-variant">متاح 3 مقاعد فقط</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">arrow_back</span>
      </div>
    </div>
  </div>
</div>
```

---

## 3. Phase 2: Public Bio Page & Discount Badges Parity (`public_bio_page`)

### 3.1 File: `src/features/bio/components/LinkButton.tsx`
#### Interface Update:
```typescript
interface LinkButtonProps {
  link: LinkItem;
  themeKey?: string;
  buttonStyle?: string | null;
  borderRadius?: string | null;
  accentColor?: string | null;
  isPreview?: boolean;
  highlightBadge?: string | null;
}
```
#### JSX Modification:
If `highlightBadge` is passed, render a badge chip next to the title:
```tsx
{highlightBadge && (
  <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-bold border border-primary/20 shrink-0">
    {highlightBadge}
  </span>
)}
```

---

## 4. Phase 3: Links Manager & Dashboard Quick Socials Parity (Stitch `_7`)

### 4.1 File: `src/features/links/components/SocialLinksEditor.tsx`
Add reordering state and action button:
```tsx
const [isReordering, setIsReordering] = useState(false);

<button
  type="button"
  onClick={() => setIsReordering(!isReordering)}
  className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-sm text-xs transition-colors"
>
  <span className="material-symbols-outlined text-[16px]">tune</span>
  <span>{isReordering ? "حفظ الترتيب" : "ترتيب الأيقونات"}</span>
</button>
```

---

## 5. Phase 4: Executable Test Plan & Verification Gate

### 5.1 Test File: `tests/integration/stitch-pixel-fidelity.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { FeaturesSection, PhoneMockup } from "@/features/landing";

describe("Stitch Pixel Fidelity Verification", () => {
  it("should render all 4 Stitch _9 Bento Cards with micro-mockups", () => {
    render(<FeaturesSection />);
    expect(screen.getByText("فحص الروابط الذاتي الذكي")).toBeDefined();
    expect(screen.getByText("روبوت روابط (واتساب)")).toBeDefined();
    expect(screen.getByText("محرر بصري يعشق العربية")).toBeDefined();
    expect(screen.getByText("IBM Plex Sans")).toBeDefined();
    expect(screen.getByText("تحليلات دقيقة ولحظية")).toBeDefined();
    expect(screen.getByText("نسبة النقر للظهور (CTR)")).toBeDefined();
    expect(screen.getByText("بيع المنتجات وجمع الدفعات")).toBeDefined();
    expect(screen.getByText("دفع فوري 1-Click")).toBeDefined();
  });

  it("should render PhoneMockup with 3 floating cards and Faisal profile", () => {
    render(<PhoneMockup />);
    expect(screen.getByText("زيارات اليوم المباشرة")).toBeDefined();
    expect(screen.getByText("+14,280")).toBeDefined();
    expect(screen.getByText("فاحص الروابط الذكي")).toBeDefined();
    expect(screen.getByText("مبيعة كتاب إلكتروني جديدة")).toBeDefined();
    expect(screen.getByText("فيصل الشمري")).toBeDefined();
    expect(screen.getByText("كتاب احتراف هندسة الأوامر")).toBeDefined();
  });
});
```

### 5.2 Verification Commands:
- Step 1 (RED): `npx vitest run tests/integration/stitch-pixel-fidelity.test.ts`
- Step 2: Implement JSX changes in `FeaturesSection.tsx`, `PhoneMockup.tsx`, `LinkButton.tsx`, `SocialLinksEditor.tsx`.
- Step 3 (GREEN): `npx vitest run tests/integration/stitch-pixel-fidelity.test.ts`
- Step 4 (Regression Gate): `npm test` (all 20 test files pass)
- Step 5 (Build Gate): `npm run build` (0 type errors, all 15 routes generated)
