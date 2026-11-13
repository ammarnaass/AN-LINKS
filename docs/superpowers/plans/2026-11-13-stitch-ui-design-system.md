# Stitch UI Design System & Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the AN LINKS platform into the high-end, Arabic luxury bento design system defined in `stitch_arabic_bio_link_platform` (`Layan Dark Arabic Bento` & `Rawabet Luxury Light`), updating all public pages, the dashboard workspace, analytics, themes customizer, and account settings.

**Architecture:** Next.js 15 App Router with Tailwind CSS extending Stitch Material tokens, Cairo and IBM Plex Sans Arabic typography, unified SSR/client components for 0ms live preview drift, and complete interactive features (QR sharing modal, handle claim with live availability badge, floating mockup cards, and full dashboard navigation).

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, Prisma 6, PostgreSQL, Lucide React + custom official SVGs, Vitest.

**Spec:** Designs located at `/home/ammar/AN LINKS/stitch_arabic_bio_link_platform` (`_1` through `_6`, `public_bio_page`, `light_mode_1`, `light_mode_2`, `layan_dark_arabic_bento/DESIGN.md`, `rawabet_luxury_light/DESIGN.md`).

## Global Constraints
- Full RTL layout (`dir="rtl"`) with `IBM Plex Sans Arabic` and `Cairo` typography.
- Exact color fidelity matching Stitch tokens (`surface`, `surface-container-high`, `primary: #4edea3`, `primary-container: #10b981`, `secondary: #d0bcff`, `tertiary: #4cd7f6`).
- No external heavy runtime libraries; smooth 60fps transitions via Tailwind CSS.
- Zero hydration mismatch or server/client drift between public SSR profiles and dashboard live phone previews.
- Production build (`npm run build`) must compile cleanly with 0 type errors.

## Review Focus
- **Theme Consistency:** Public profiles and dashboard maintain seamless dark/light styling without unstyled flashes.
- **Bento Link Badges & Highlights:** Discount pills (e.g. `خصم 20%`), seat counters, and custom badges render correctly without text truncation.
- **QR Modal Accessibility:** Keyboard navigable, closes on escape/backdrop click, and displays sharp QR code.
- **Live Preview Real-time Sync:** Edits in links, socials, and theme tokens reflect instantly in the phone preview frame.
- **Responsive Navigation:** Top action bar and dashboard tabs collapse cleanly on mobile viewports (<640px).

---

### Task 1: Design System & Tailwind Tokens Setup

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/design-system.ts`
- Test: `tests/unit/design-system.test.ts`

- [ ] **Step 1: Write unit tests for design system tokens**
  Verify color tokens (surface, primary, secondary, tertiary) and theme resolution.
- [ ] **Step 2: Update `tailwind.config.ts` and `src/app/globals.css`**
  Add Stitch color palette and font family definitions (`IBM Plex Sans Arabic`).
- [ ] **Step 3: Update `src/app/layout.tsx`**
  Include IBM Plex Sans Arabic font link.
- [ ] **Step 4: Run test to confirm passing**
  Run `npx vitest run tests/unit/design-system.test.ts`.
- [ ] **Step 5: Commit**
  `git commit -m "feat(design): setup Stitch tokens and typography in Tailwind and layout"`

---

### Task 2: Public Bio Page Upgrade (Matching `public_bio_page/code.html`)

**Files:**
- Create: `src/components/public/QrShareModal.tsx`
- Modify: `src/components/public/ProfileCard.tsx`
- Modify: `src/components/public/LinkButton.tsx`
- Modify: `src/components/public/BioPageContent.tsx`
- Modify: `tests/integration/profile-ssr.test.ts`

- [ ] **Step 1: Write integration tests for QR modal and upgraded ProfileCard**
  Verify action bar (QR trigger, Share button, live status pill) and bento link badge rendering.
- [ ] **Step 2: Implement `src/components/public/QrShareModal.tsx`**
  Modal with QR code canvas/SVG, direct copy button, and platform share options.
- [ ] **Step 3: Upgrade `ProfileCard.tsx`**
  Add neon pulse avatar ring, online status indicator, verified badge, location chip, and quick stats bar (`250K+ متابع`, `14+ مشروع`, `25K مشترك`).
- [ ] **Step 4: Upgrade `LinkButton.tsx` and `BioPageContent.tsx`**
  Add shimmer underlay glow, custom badges, and rich media indicators.
- [ ] **Step 5: Run tests to confirm passing**
  Run `npx vitest run tests/integration/profile-ssr.test.ts`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(public): upgrade public bio page to Stitch luxury bento design with QR modal"`

---

### Task 3: Landing Page Upgrade (Matching `_6/code.html`)

**Files:**
- Modify: `src/components/landing/LandingHeader.tsx`
- Modify: `src/components/landing/HeroSection.tsx`
- Modify: `src/components/landing/PhoneMockup.tsx`
- Modify: `src/components/landing/FeaturesSection.tsx`
- Modify: `src/components/landing/HowItWorksSection.tsx`
- Modify: `src/components/landing/LandingFooter.tsx`
- Modify: `src/app/page.tsx`
- Modify: `tests/integration/landing-page.test.ts`

- [ ] **Step 1: Write tests for Stitch landing page elements**
  Verify live availability badge, floating bento cards mockup, and feature highlights.
- [ ] **Step 2: Upgrade `LandingHeader.tsx` and `LandingFooter.tsx`**
  Dark luxury frosted glass header with brand logo and action buttons.
- [ ] **Step 3: Upgrade `HeroSection.tsx`**
  Add atmospheric ambient glows, availability ping badge (`rawabet.me/username متاح للتسجيل`), and bolt CTA.
- [ ] **Step 4: Upgrade `PhoneMockup.tsx`**
  Add 3D device frame with floating bento cards (live analytics toast, sales counter).
- [ ] **Step 5: Upgrade `FeaturesSection.tsx` and `HowItWorksSection.tsx`**
  Bento cards for broken link sentinel, digital products, analytics, and audio themes.
- [ ] **Step 6: Run tests to confirm passing**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 7: Commit**
  `git commit -m "feat(landing): upgrade landing page to dark luxury bento style from Stitch _6"`

---

### Task 4: Dashboard Layout & Navigation (Matching `_4/code.html`)

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `tests/integration/dashboard-actions.test.ts`

- [ ] **Step 1: Update dashboard layout test**
  Verify tabs (الروابط, المظهر, التحليلات, الإعدادات), live page status toggle, and copy URL action.
- [ ] **Step 2: Upgrade `src/app/(dashboard)/layout.tsx`**
  Implement top bar with logo, central navigation pills, public URL copy pill, and user profile menu.
- [ ] **Step 3: Run tests to confirm passing**
  Run `npx vitest run tests/integration/dashboard-actions.test.ts`.
- [ ] **Step 4: Commit**
  `git commit -m "feat(dashboard): implement Stitch top navigation bar and breadcrumbs"`

---

### Task 5: Links & Socials Management (Matching `_4/code.html`)

**Files:**
- Modify: `src/app/(dashboard)/dashboard/page.tsx`
- Modify: `src/components/dashboard/LinkEditor.tsx`
- Modify: `src/components/dashboard/SocialLinksEditor.tsx`
- Modify: `src/components/dashboard/MobilePreview.tsx`
- Modify: `tests/integration/dashboard-actions.test.ts`

- [ ] **Step 1: Add tests for welcome hero card and link cards**
  Verify quick metrics bar, drag reordering controls, and social network chips.
- [ ] **Step 2: Upgrade `LinkEditor.tsx`**
  Cards with drag handles, badge editors, icon pickers, and click counter badges.
- [ ] **Step 3: Upgrade `SocialLinksEditor.tsx`**
  Quick chips row for instant network additions with official SVGs.
- [ ] **Step 4: Upgrade `MobilePreview.tsx`**
  Realistic phone preview with responsive scale controls and live iframe/component toggle.
- [ ] **Step 5: Run tests to confirm passing**
  Run `npx vitest run tests/integration/dashboard-actions.test.ts`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(dashboard): upgrade links and socials workspace to Stitch bento layout"`

---

### Task 6: Appearance & Themes Customizer Tab (Matching `_3/code.html`)

**Files:**
- Create: `src/app/(dashboard)/dashboard/appearance/page.tsx`
- Modify: `src/components/dashboard/ThemeCustomizer.tsx`
- Modify: `src/lib/themes.ts`
- Test: `tests/integration/appearance.test.ts`

- [ ] **Step 1: Write integration tests for Appearance page**
  Test theme selection, typography picker, and button style toggles.
- [ ] **Step 2: Update `src/lib/themes.ts`**
  Add `layanDark` (Layan Dark Arabic Bento) and `rawabetLight` (Rawabet Luxury Light) presets.
- [ ] **Step 3: Implement `src/app/(dashboard)/dashboard/appearance/page.tsx`**
  Profile identity inputs, theme cards grid, typography dropdown, and radius selector.
- [ ] **Step 4: Run tests to confirm passing**
  Run `npx vitest run tests/integration/appearance.test.ts`.
- [ ] **Step 5: Commit**
  `git commit -m "feat(appearance): implement Stitch appearance customizer page and themes"`

---

### Task 7: Analytics Dashboard Upgrade (Matching `_1/code.html`)

**Files:**
- Modify: `src/app/(dashboard)/dashboard/analytics/page.tsx`
- Modify: `src/components/dashboard/AnalyticsChart.tsx`
- Modify: `src/lib/analytics-service.ts`
- Modify: `tests/integration/analytics-api.test.ts`

- [ ] **Step 1: Update analytics tests**
  Verify traffic sources (Instagram, TikTok, X, Google) and device breakdown data structures.
- [ ] **Step 2: Upgrade `AnalyticsChart.tsx`**
  Add modern SVG gradient area chart (Views vs Clicks) matching Stitch `_1`.
- [ ] **Step 3: Upgrade `src/app/(dashboard)/dashboard/analytics/page.tsx`**
  Metrics summary cards, traffic channels progress bars, top country badges, and links performance table.
- [ ] **Step 4: Run tests to confirm passing**
  Run `npx vitest run tests/integration/analytics-api.test.ts`.
- [ ] **Step 5: Commit**
  `git commit -m "feat(analytics): upgrade analytics dashboard to Stitch advanced visual layout"`

---

### Task 8: Account & Security Settings Page (Matching `_5/code.html`)

**Files:**
- Create: `src/app/(dashboard)/dashboard/settings/page.tsx`
- Modify: `src/lib/dashboard-actions.ts`
- Test: `tests/integration/settings.test.ts`

- [ ] **Step 1: Write tests for settings updates**
  Verify profile update action, password change action, and plan details.
- [ ] **Step 2: Implement `src/app/(dashboard)/dashboard/settings/page.tsx`**
  Bento layout with user card, plan badge ("باقة المحترفين المتكاملة Pro"), security forms, and data export.
- [ ] **Step 3: Run tests to confirm passing**
  Run `npx vitest run tests/integration/settings.test.ts`.
- [ ] **Step 4: Commit**
  `git commit -m "feat(settings): implement account and security settings page matching Stitch _5"`

---

### Task 9: Full E2E Verification & Production Build

**Files:**
- Modify: `tests/e2e-live-test.mjs`

- [ ] **Step 1: Update and run live E2E HTTP test suite**
  Execute `node tests/e2e-live-test.mjs` against live Next.js server.
- [ ] **Step 2: Run all Vitest suites**
  Execute `npx vitest run` ensuring 100% test pass.
- [ ] **Step 3: Verify Next.js production build**
  Execute `npm run build` ensuring all 11+ routes compile cleanly.
- [ ] **Step 4: Commit & Push**
  `git commit -m "chore: complete Stitch design system rollout with 100% verified build"` and push to `origin/main`.

