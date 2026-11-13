# Stitch Arabic Bio Link Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full suite of Stitch screens and design specifications from `stitch_arabic_bio_link_platform` (`_1` through `_10`, `public_bio_page`, `light_mode_1`, `light_mode_2`, `light_mode_3`, `layan_dark_arabic_bento/DESIGN.md`, and `rawabet_luxury_light/DESIGN.md`) into the modular AN LINKS codebase, adding the dedicated Pricing page (`/pricing`), Features showcase (`/features`), Light/Dark mode theming, and high-fidelity UI polish across all dashboard workspaces and auth screens.

**Architecture:** Next.js 15 App Router with Feature Modular Structure (`src/features/<feature-name>`), Tailwind CSS extending Stitch design tokens (`Layan Dark Arabic Bento` + `Rawabet Luxury Light`), zero-runtime CSS variables for instant theme toggling, server-rendered public pages with client hydration, and comprehensive Vitest unit/integration tests for every new route and component.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3.4, Prisma 6, PostgreSQL, Lucide React + Material Symbols Outlined, Chart.js, Vitest.

**Spec:** Designs located at `/home/ammar/AN LINKS/stitch_arabic_bio_link_platform` and `stitch_arabic_bio_link_platform (1)`:
- `_9` & `_10`: Landing page & Features deep dive (`/`, `/features`)
- `_1` & `light_mode_3`: Pricing & comparison matrix (`/pricing`)
- `_3`: Visual Auth screens (`/login`, `/register`)
- `_7` & `light_mode_2`: Links dashboard with quick socials & health sentinel
- `_2` & `_6`: Appearance customizer with 9 themes & dynamic phone frame
- `_4` & `light_mode_1`: Analytics dashboard (views/clicks charts, geo & device breakdown)
- `_5` & `_8`: Account settings, payouts, security & subscription tiers
- `public_bio_page`: SSR public profile with verified badge, discount pills, QR modal, and report modal
- `rawabet_luxury_light/` & `layan_dark_arabic_bento/`: Complete dual-mode design tokens

## Global Constraints
- **Strict Line Count Limits:** Every file must remain strictly under 150-250 lines (functions <40 lines) per `skills/feature-modular-structure/SKILL.md`.
- **Feature Modularity:** All new UI components live under `src/features/<feature>/components/` and are exported through `src/features/<feature>/index.ts`. No cross-feature internal file imports.
- **RTL-First & Typography:** Strict `dir="rtl"` orientation with `IBM Plex Sans Arabic` and `Cairo` fonts. All directional icons (arrows, chevrons) properly mirrored.
- **Dual-Mode Theming:** Seamless support for Dark Bento (`#0f131c`) and Luxury Light (`#f9f9fe`) with zero layout shift (CLS 0) and zero unstyled flash.
- **Zero Test Regressions:** All existing 72 Vitest tests must continue passing, with new tests added for every task.
- **Production Cleanliness:** `npm run build` must compile with 0 TypeScript and Webpack errors across all 15 routes.

## Review Focus
- **Theme Hydration & Toggle:** Changing between Dark and Light mode must not cause React hydration warnings or mismatched SSR renders.
- **Pricing Billing Cycle Calculation:** Annual billing toggle (20% discount) must accurately update monthly-equivalent pricing display across all 3 tiers.
- **Bento Card Text Wrap in RTL:** Badges (e.g. `خصم 20%`, `متاح 3 مقاعد`, `جديد`) must not overflow or truncate on small mobile screens (320px-375px).
- **Public Profile SSR Performance:** Public bio pages (`/[username]`) must render instantly via Server Components with metadata for SEO and OpenGraph.
- **Network Boundary Integrity:** UI components must never perform direct raw `fetch` calls; all requests must flow through typed feature services.

---

### Task 1: Dual-Mode Design System & Theme Toggle (Dark Bento & Luxury Light)

**Files:**
- Modify: `src/shared/ui/design-system.ts`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Create: `src/shared/ui/ThemeToggle.tsx`
- Modify: `src/shared/ui/index.ts`
- Create: `tests/unit/theme-mode.test.ts`

**Interfaces:**
- `ThemeMode = "dark" | "light" | "system"`
- Consumes tokens from `stitch_arabic_bio_link_platform/layan_dark_arabic_bento/DESIGN.md` and `rawabet_luxury_light/DESIGN.md`.

- [ ] **Step 1: Write failing test for theme mode tokens and toggle utility**
```typescript
// tests/unit/theme-mode.test.ts
import { describe, it, expect } from "vitest";
import { THEME_TOKENS, resolveThemeClasses } from "@/shared/ui/design-system";

describe("Theme Mode Tokens & Resolution", () => {
  it("should provide valid dark and light mode color tokens", () => {
    expect(THEME_TOKENS.dark.surface).toBe("#0f131c");
    expect(THEME_TOKENS.light.surface).toBe("#f9f9fe");
    expect(THEME_TOKENS.dark.primary).toBe("#4edea3");
    expect(THEME_TOKENS.light.primary).toBe("#006948");
  });

  it("should return correct root class name for mode", () => {
    expect(resolveThemeClasses("dark")).toContain("dark");
    expect(resolveThemeClasses("light")).toBe("light");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/unit/theme-mode.test.ts`
Expected: FAIL (missing `THEME_TOKENS`, `resolveThemeClasses`).

- [ ] **Step 3: Implement Theme Tokens & `ThemeToggle.tsx`**
Update `src/shared/ui/design-system.ts` with complete tokens from `rawabet_luxury_light/DESIGN.md` and `layan_dark_arabic_bento/DESIGN.md`.
Create `src/shared/ui/ThemeToggle.tsx` (compact client component using localStorage/cookies and `document.documentElement.classList`).
Export `ThemeToggle` from `src/shared/ui/index.ts`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/unit/theme-mode.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/shared/ui/ tests/unit/theme-mode.test.ts tailwind.config.ts src/app/globals.css
git commit -m "feat(design): implement dual-mode dark bento and luxury light tokens with ThemeToggle"
```

---

### Task 2: Dedicated Pricing Page (`/pricing`) Matching Stitch `_1` & `light_mode_3`

**Files:**
- Create: `src/features/landing/types/pricing.types.ts`
- Create: `src/features/landing/constants/pricing-plans.ts`
- Create: `src/features/landing/components/PricingHeader.tsx`
- Create: `src/features/landing/components/PricingCard.tsx`
- Create: `src/features/landing/components/PricingComparisonTable.tsx`
- Create: `src/features/landing/components/PricingFaq.tsx`
- Modify: `src/features/landing/index.ts`
- Create: `src/app/pricing/page.tsx`
- Create: `tests/integration/pricing-page.test.ts`

**Interfaces:**
- `PricingPlan`: `{ id: string; name: string; tag: string; priceMonthly: number; priceYearly: number; description: string; features: string[]; isPopular?: boolean; ctaText: string; ctaLink: string; }`
- `PricingComparisonRow`: `{ category: string; feature: string; free: boolean | string; pro: boolean | string; agency: boolean | string; }`

- [ ] **Step 1: Write integration test for Pricing Page**
```typescript
// tests/integration/pricing-page.test.ts
import { describe, it, expect } from "vitest";
import { PRICING_PLANS, COMPARISON_FEATURES, calculatePrice } from "@/features/landing";

describe("Pricing Page Data & Logic", () => {
  it("should have 3 core tiers matching Stitch _1 spec", () => {
    expect(PRICING_PLANS).toHaveLength(3);
    expect(PRICING_PLANS[0].name).toBe("البداية المجانية");
    expect(PRICING_PLANS[1].name).toBe("صانع المحتوى المحترف");
    expect(PRICING_PLANS[2].name).toBe("الأعمال والوكالات");
  });

  it("should calculate 20% discount on yearly billing cycle", () => {
    const monthly = calculatePrice(PRICING_PLANS[1], false);
    const yearlyMonthlyEquiv = calculatePrice(PRICING_PLANS[1], true);
    expect(yearlyMonthlyEquiv).toBeLessThan(monthly);
    expect(yearlyMonthlyEquiv).toBe(19); // 24/mo -> 19/mo on yearly
  });

  it("should provide full feature comparison matrix", () => {
    expect(COMPARISON_FEATURES.length).toBeGreaterThan(8);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/integration/pricing-page.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement Pricing Feature Components & Route**
1. `src/features/landing/types/pricing.types.ts`: Define plan and comparison interfaces.
2. `src/features/landing/constants/pricing-plans.ts`: Exact tiers, prices (\$0, \$24, \$59), discounts, and feature matrix from Stitch `_1`.
3. `src/features/landing/components/PricingHeader.tsx`: Title, subtitle, and annual/monthly billing pill toggle.
4. `src/features/landing/components/PricingCard.tsx`: Bento card for each tier with feature checklist, highlighted Popular badge, and primary CTA.
5. `src/features/landing/components/PricingComparisonTable.tsx`: Full feature comparison table with checkmarks and feature categories.
6. `src/features/landing/components/PricingFaq.tsx`: Frequently asked questions with smooth accordion disclosure.
7. `src/app/pricing/page.tsx`: Clean Next.js page assembling the components with SEO metadata.
8. Update `src/features/landing/index.ts` and `src/features/landing/components/LandingHeader.tsx` to link to `/pricing`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/integration/pricing-page.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features/landing/ src/app/pricing/ tests/integration/pricing-page.test.ts
git commit -m "feat(pricing): implement dedicated Stitch pricing page with annual toggle and comparison table"
```

---

### Task 3: Features Deep Dive Page (`/features`) Matching Stitch `_10`

**Files:**
- Create: `src/features/landing/constants/features-data.ts`
- Create: `src/features/landing/components/FeaturesHero.tsx`
- Create: `src/features/landing/components/FeaturesDetailGrid.tsx`
- Create: `src/features/landing/components/AlternativeComparison.tsx`
- Create: `src/app/features/page.tsx`
- Modify: `src/features/landing/index.ts`
- Create: `tests/integration/features-page.test.ts`

**Interfaces:**
- `FeatureItem`: `{ id: string; title: string; subtitle: string; description: string; badge: string; iconName: string; metrics: string; }`
- `AlternativeComparison`: `{ feature: string; rawabet: string; linktree: string; beacons: string; }`

- [ ] **Step 1: Write integration test for Features Page**
```typescript
// tests/integration/features-page.test.ts
import { describe, it, expect } from "vitest";
import { DETAILED_FEATURES, GLOBAL_ALTERNATIVES_COMPARISON } from "@/features/landing";

describe("Features Deep Dive Page", () => {
  it("should contain all Stitch _10 feature modules", () => {
    expect(DETAILED_FEATURES.length).toBeGreaterThanOrEqual(6);
    const linkSentinel = DETAILED_FEATURES.find(f => f.id === "link-sentinel");
    expect(linkSentinel).toBeDefined();
    expect(linkSentinel?.title).toContain("فاحص الروابط");
  });

  it("should contain direct comparison with global alternatives", () => {
    expect(GLOBAL_ALTERNATIVES_COMPARISON.length).toBeGreaterThanOrEqual(4);
    expect(GLOBAL_ALTERNATIVES_COMPARISON[0]).toHaveProperty("rawabet");
    expect(GLOBAL_ALTERNATIVES_COMPARISON[0]).toHaveProperty("linktree");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/integration/features-page.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement Features Components & Route**
1. `src/features/landing/constants/features-data.ts`: Link Sentinel, Digital Products, True Analytics (No Bots), RTL Bento Luxury, Fast SSR, Custom Domains.
2. `src/features/landing/components/FeaturesHero.tsx`: Headline & value proposition matching Stitch `_10`.
3. `src/features/landing/components/FeaturesDetailGrid.tsx`: High-density bento grid with metrics badges.
4. `src/features/landing/components/AlternativeComparison.tsx`: Comparison table comparing Rawabet with Linktree and Beacons.
5. `src/app/features/page.tsx`: Route layout with header, sections, and call-to-action banner.
6. Update navigation links in `LandingHeader.tsx` and `LandingFooter.tsx`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/integration/features-page.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features/landing/ src/app/features/ tests/integration/features-page.test.ts
git commit -m "feat(features): add comprehensive Stitch features showcase page and comparison matrix"
```

---

### Task 4: Visual Auth Experience Matching Stitch `_3`

**Files:**
- Create: `src/features/auth/components/AuthSideBanner.tsx`
- Modify: `src/features/auth/components/LoginForm.tsx`
- Modify: `src/features/auth/components/RegisterForm.tsx`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `tests/integration/auth.test.ts`

**Interfaces:**
- Split layout: Left column contains interactive form (with Google OAuth and remember-me option); right column showcases creator testimonial, live bento phone preview, and security badges.

- [ ] **Step 1: Write integration tests for auth visual elements**
Verify Google OAuth button, remember-me checkbox, and visual side banner rendering in `tests/integration/auth.test.ts`.

- [ ] **Step 2: Run test to check current expectations**
Run: `npx vitest run tests/integration/auth.test.ts`

- [ ] **Step 3: Implement `AuthSideBanner.tsx` and update forms**
1. `src/features/auth/components/AuthSideBanner.tsx`: Implements the obsidian bento showcase side-panel matching Stitch `_3` with verified creator card and glowing badges.
2. Update `LoginForm.tsx` and `RegisterForm.tsx`: Add Google sign-in button, "Remember Me" toggle, and smooth tab navigation between login and register.
3. Update `src/app/(auth)/login/page.tsx` and `register/page.tsx` with responsive 2-column container.

- [ ] **Step 4: Run test to verify passing**
Run: `npx vitest run tests/integration/auth.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features/auth/ src/app/\(auth\)/ tests/integration/auth.test.ts
git commit -m "feat(auth): upgrade login and register screens to Stitch visual layout with creator showcase"
```

---

### Task 5: Dashboard Workspaces Stitch Polish & Live Preview Parity

**Files:**
- Modify: `src/features/links/components/DashboardHeader.tsx`
- Modify: `src/features/links/components/SocialLinksEditor.tsx`
- Modify: `src/features/links/components/MobilePreview.tsx`
- Modify: `src/features/analytics/components/AnalyticsChart.tsx`
- Modify: `src/features/analytics/components/TrafficSourcesTable.tsx`
- Modify: `src/features/settings/components/SubscriptionTab.tsx`
- Modify: `tests/integration/dashboard-actions.test.ts`

- [ ] **Step 1: Write integration tests for quick socials and subscription tier switches**
Verify rapid social link toggling and subscription tier presentation in `tests/integration/dashboard-actions.test.ts`.

- [ ] **Step 2: Run test to verify status**
Run: `npx vitest run tests/integration/dashboard-actions.test.ts`

- [ ] **Step 3: Polish Dashboard Components**
1. In `src/features/links/components/DashboardHeader.tsx`: Add active view mode indicator and ThemeToggle button.
2. In `src/features/links/components/SocialLinksEditor.tsx`: Match Stitch `_7` with rapid social pill buttons (WhatsApp, Instagram, X, TikTok, YouTube, Telegram, LinkedIn, Snapchat).
3. In `src/features/links/components/MobilePreview.tsx`: Add real-time theme preview and smooth dynamic island animations.
4. In `src/features/analytics/components/AnalyticsChart.tsx`: Add time range switcher (7 أيام / 30 يوم / 90 يوم) with Chart.js gradient fill matching Stitch `_4`.
5. In `src/features/settings/components/SubscriptionTab.tsx`: Link directly to the new `/pricing` tiers with upgrade buttons.

- [ ] **Step 4: Run test to verify passing**
Run: `npx vitest run tests/integration/dashboard-actions.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/features/links/ src/features/analytics/ src/features/settings/
git commit -m "feat(dashboard): align links, analytics, and settings with Stitch visual specifications"
```

---

### Task 6: End-to-End Verification, Performance & Build Quality Gate

**Files:**
- Modify: `tests/e2e-live-test.mjs`
- Test: All 16+ test files

- [ ] **Step 1: Update `tests/e2e-live-test.mjs` to test new routes**
Add checks for `/pricing` and `/features` HTTP 200 OK with RTL and critical copy verification.

- [ ] **Step 2: Run complete Vitest suite**
Run: `npm test`
Expected: 100% tests passing across all test files.

- [ ] **Step 3: Run Next.js production build**
Run: `npm run build`
Expected: Clean compile, all 15 static/dynamic routes generated successfully with 0 type errors.

- [ ] **Step 4: Run live E2E test against local production server**
Run: `node tests/e2e-live-test.mjs`
Expected: All 11 live checks pass.

- [ ] **Step 5: Commit & Push**
```bash
git add .
git commit -m "chore(release): complete Stitch design system rollout across all 15 routes with 100% test coverage"
git push origin main
```

