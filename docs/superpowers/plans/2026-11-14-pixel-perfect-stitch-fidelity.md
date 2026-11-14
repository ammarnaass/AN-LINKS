# Pixel-Perfect Stitch Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Achieve 100% pixel-perfect visual fidelity across the entire AN LINKS platform matching all screens and design specifications in `stitch_arabic_bio_link_platform (1)` (`_1` through `_10`, `public_bio_page`, `light_mode_1..3`, `layan_dark_arabic_bento/DESIGN.md`, and `rawabet_luxury_light/DESIGN.md`), preserving the strict feature-modular structure (<250 lines per file).

**Architecture:** Next.js 15 App Router with Feature Modular Structure (`src/features/<feature>/`), Tailwind CSS extending Stitch Material tokens, Cairo and IBM Plex Sans Arabic typography, zero runtime CSS overhead, and complete test-driven verification.

**Tech Stack:** Next.js 15.5, React 19, Tailwind CSS 3.4, Prisma 6, PostgreSQL, Lucide React + Material Symbols Outlined, Chart.js, Vitest.

**Spec:** Designs located at `/home/ammar/AN LINKS/stitch_arabic_bio_link_platform (1)/stitch_arabic_bio_link_platform`:
- `_9`: Complete 9-section Landing Page (Hero with live claim, Bento showcase, Features grid, Template showcase gallery, 3-step timeline, Pricing banner, Testimonials, FAQ accordion, Giant CTA, and 4-column Footer)
- `_7` & `light_mode_2`: Links Manager with Link Sentinel banner, category tags, click counts, conversion rates, and quick socials
- `_4` & `light_mode_1`: Analytics Dashboard with KPI cards, time series chart, top links table, traffic sources, geo breakdown, and device breakdown
- `_5` & `_8`: Settings Dashboard with Profile, Subscription & Invoices, Payouts (mada & Apple Pay), Security & 2FA, and Danger Zone
- `_2` & `_6`: Appearance Customizer with 9 themes, 4 button styles, 4 corner radii, and 4 Arabic fonts
- `public_bio_page`: SSR Public Bio page with verified badge, discount pills, QR modal, and report modal
- `rawabet_luxury_light/` & `layan_dark_arabic_bento/`: Dual-mode theme tokens

## Global Constraints
- **Strict Line Count Limits:** Every file must remain strictly under 150-250 lines (functions <40 lines) per `skills/feature-modular-structure/SKILL.md`.
- **Feature Modularity:** All components live under `src/features/<feature>/components/` and are exposed via `src/features/<feature>/index.ts`. No cross-feature internal file imports.
- **RTL-First & Typography:** Strict `dir="rtl"` orientation with `IBM Plex Sans Arabic` and `Cairo` fonts. All directional icons properly mirrored.
- **Dual-Mode Theming:** Seamless support for Dark Bento (`#0f131c`) and Luxury Light (`#f9f9fe`) with zero layout shift (CLS 0).
- **Zero Test Regressions:** All 80 Vitest tests must continue passing, with new tests added for every task.
- **Production Cleanliness:** `npm run build` must compile with 0 TypeScript and Webpack errors across all 15 routes.

## Review Focus
- **Template Showcase Interactive Filter:** Category tabs in the landing page template showcase must switch active templates smoothly.
- **Bento Link Badges & Highlights:** Discount pills (e.g. `خصم 20%`), seat counters, and custom badges render correctly without text truncation.
- **Pricing Billing Cycle Calculation:** Annual billing toggle (20% discount) must accurately update monthly-equivalent pricing display across all 3 tiers.
- **Public Profile SSR Performance:** Public bio pages (`/[username]`) must render instantly via Server Components with metadata for SEO and OpenGraph.
- **Network Boundary Integrity:** UI components must never perform direct raw `fetch` calls; all requests must flow through typed feature services.

---

### Task 1: Complete Landing Page Matching Stitch `_9` (All 9 Sections)

**Files:**
- Create: `src/features/landing/constants/templates-data.ts`
- Create: `src/features/landing/constants/testimonials-data.ts`
- Create: `src/features/landing/components/TemplateGallerySection.tsx`
- Create: `src/features/landing/components/TestimonialsSection.tsx`
- Create: `src/features/landing/components/PricingBannerSection.tsx`
- Create: `src/features/landing/components/FaqSection.tsx`
- Create: `src/features/landing/components/GiantCtaSection.tsx`
- Modify: `src/features/landing/components/LandingFooter.tsx`
- Modify: `src/features/landing/index.ts`
- Modify: `src/app/page.tsx`
- Create: `tests/integration/landing-stitch-9.test.ts`

- [ ] **Step 1: Write integration tests for Landing Page Stitch `_9` data and sections**
  Verify templates data, testimonials data, FAQ questions, and footer structure.
- [ ] **Step 2: Run test to verify it fails (RED)**
  Run `npx vitest run tests/integration/landing-stitch-9.test.ts`.
- [ ] **Step 3: Implement Landing Components & Constants**
  Implement `templates-data.ts`, `testimonials-data.ts`, `TemplateGallerySection.tsx`, `TestimonialsSection.tsx`, `PricingBannerSection.tsx`, `FaqSection.tsx`, `GiantCtaSection.tsx`, and rich 4-column `LandingFooter.tsx`.
- [ ] **Step 4: Update `src/app/page.tsx` to assemble all 9 Stitch sections**
- [ ] **Step 5: Run test to verify it passes (GREEN)**
  Run `npx vitest run tests/integration/landing-stitch-9.test.ts`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(landing): complete all 9 Stitch _9 sections with template gallery and testimonials"`

---

### Task 2: Links Manager Parity Matching Stitch `_7` & `light_mode_2`

**Files:**
- Modify: `src/features/links/components/LinkHealthBanner.tsx`
- Modify: `src/features/links/components/LinkCardItem.tsx`
- Modify: `src/features/links/components/AddLinkForm.tsx`
- Modify: `src/features/links/components/SocialLinksEditor.tsx`
- Modify: `src/app/(dashboard)/dashboard/page.tsx`
- Modify: `tests/integration/dashboard-actions.test.ts`

- [ ] **Step 1: Write integration test for Link Sentinel stats and category badges**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Update Link Components**
  Add realistic Link Sentinel response time gauge ("5/5 روابط تعمل بسرعة استجابة 72ms"), category badges (متجر, بودكاست, استشارة, مدونة, عرض), click counter, and conversion rate indicator.
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit**
  `git commit -m "feat(links): enhance links manager with Link Sentinel stats and rich category badges matching Stitch _7"`

---

### Task 3: Analytics Dashboard Parity Matching Stitch `_4` & `light_mode_1`

**Files:**
- Modify: `src/features/analytics/components/AnalyticsKpiCards.tsx`
- Modify: `src/features/analytics/components/AnalyticsChart.tsx`
- Modify: `src/features/analytics/components/TrafficSourcesTable.tsx`
- Modify: `src/features/analytics/components/DevicesAndGeoBreakdown.tsx`
- Modify: `src/features/analytics/components/TopLinksTable.tsx`
- Modify: `src/app/(dashboard)/dashboard/analytics/page.tsx`
- Modify: `tests/integration/analytics-api.test.ts`

- [ ] **Step 1: Write integration test for Analytics breakdown data**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Update Analytics Components**
  Add 4 KPI cards matching Stitch `_4` (Views, Clicks, CTR 32.1%, Avg Time), 7/30/90 days timeframe filter, traffic sources with percentage progress bars, geo breakdown (Saudi Arabia 68%, UAE 14%, Egypt 9%), and device breakdown (Mobile 84%, Desktop 13%, Tablet 3%).
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit**
  `git commit -m "feat(analytics): align analytics dashboard with Stitch _4 visuals, geo breakdown, and KPI metrics"`

---

### Task 4: Settings Dashboard Parity Matching Stitch `_5` & `_8`

**Files:**
- Modify: `src/features/settings/components/PayoutsTab.tsx`
- Modify: `src/features/settings/components/SecurityTab.tsx`
- Modify: `src/features/settings/components/SubscriptionTab.tsx`
- Modify: `src/features/settings/components/ProfileTab.tsx`
- Modify: `src/app/(dashboard)/dashboard/settings/page.tsx`
- Modify: `tests/integration/settings.test.ts`

- [ ] **Step 1: Write integration test for Payout gateways and 2FA**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Update Settings Components**
  Implement PayoutsTab with Saudi mada network, Apple Pay 1-click, and SAR local bank account (IBAN). Implement SecurityTab with active sessions list (MacBook Pro 16", iPhone 15 Pro) and 2FA. Implement DangerZoneTab with freeze account, data export, and delete account.
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit**
  `git commit -m "feat(settings): complete Stitch _5 settings tabs with mada/Apple Pay payouts and active sessions"`

---

### Task 5: Appearance Customizer & Live Phone Preview Parity Matching Stitch `_2` & `_6`

**Files:**
- Modify: `src/features/appearance/constants/themes.ts`
- Modify: `src/features/appearance/components/ThemePresetsGrid.tsx`
- Modify: `src/features/appearance/components/ButtonAndRadiusPicker.tsx`
- Modify: `src/features/appearance/components/FontPicker.tsx`
- Modify: `src/features/links/components/MobilePreview.tsx`
- Modify: `tests/integration/appearance.test.ts`

- [ ] **Step 1: Write integration test for all 9 theme presets and font choices**
- [ ] **Step 2: Run test to verify it fails (RED)**
- [ ] **Step 3: Update Appearance Components**
  Include exact 9 themes (نيون الزمرد, شفق البنفسج, سليت الحداثة, ذهبي فاخر, بحري هادئ, رمال الصحراء, وردي داكن, ثلجي ناصع, أحادي داكن), 4 button styles, 4 corner radii, and 4 Arabic fonts (IBM Plex Sans Arabic, Cairo, Readex Pro, Tajawal).
- [ ] **Step 4: Run test to verify it passes (GREEN)**
- [ ] **Step 5: Commit**
  `git commit -m "feat(appearance): complete 9 Stitch luxury themes, fonts, and interactive phone preview"`

---

### Task 6: Full E2E & Production Build Verification across all 15 Routes

**Files:**
- Modify: `tests/e2e-live-test.mjs`
- Test: All 19+ test files

- [ ] **Step 1: Update `tests/e2e-live-test.mjs` to test all new sections**
- [ ] **Step 2: Run complete Vitest suite (`npm test`)**
  Expected: 100% tests passing across all test files.
- [ ] **Step 3: Run Next.js production build (`npm run build`)**
  Expected: Clean compile, all 15 static/dynamic routes generated successfully with 0 type errors.
- [ ] **Step 4: Run live E2E test against local production server (`node tests/e2e-live-test.mjs`)**
  Expected: All 11+ live checks pass.
- [ ] **Step 5: Commit & Push to GitHub**
  `git commit -m "chore(release): achieve 100% pixel-perfect Stitch fidelity across all 15 routes"`
