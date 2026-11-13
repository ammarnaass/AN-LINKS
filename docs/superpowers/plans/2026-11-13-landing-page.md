# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-converting, RTL-first, accessible Arabic Landing Page for AN LINKS (`/`) showcasing the platform's core capabilities, an interactive username claim input, live bio phone preview, features grid, and seamless onboarding to `/register`.

**Architecture:** Next.js 15 App Router page at `src/app/page.tsx` composing modular client and server components: `LandingHeader`, `HeroSection` (with handle claim validation and redirection), `PhoneMockup` (previewing interactive bio profile), `FeaturesSection` (PRD-aligned value props), `HowItWorksSection`, and `LandingFooter`.

**Tech Stack:** Next.js 15 (App Router, SSR), React 19, Tailwind CSS, Lucide React (general utility icons), Cairo font / RTL styling, Vitest.

**Spec:** PRD (`PRD.md`) - Sections 1.1, 1.3, 2, 7.1.

## Global Constraints
- Fully RTL-first layout (`dir="rtl"`) with Cairo font typography.
- Mobile-first responsive design (tested on 360px viewport up to desktop).
- No external heavy animation libraries; use Tailwind CSS transitions for smooth 60fps performance.
- Client-side validation on handle input matching username constraints (latin letters, numbers, hyphens).
- Full SSR compatibility and SEO metadata (title, description, Open Graph).

## Review Focus
- **Whitespace / Arabic input in username claim:** Sanitizes and trims input, rejects non-alphanumeric chars or redirects cleanly with encoded parameter.
- **Empty submit in claim handle:** Focuses input or defaults to clean `/register` navigation without crashing.
- **Mobile responsiveness:** Mockup scaling and flex layout without horizontal scrollbar on screens <380px.
- **Link navigation:** All buttons (Login, Register, Demo, Legal) point to correct existing routes (`/login`, `/register`).
- **Production bundle size:** Zero heavy dependencies added; Next.js SSR build compiles with 0 errors.

---

### Task 1: Handle Claim Validation & Landing Page Unit Testing

**Files:**
- Create: `tests/integration/landing-page.test.ts`
- Create: `src/lib/claim-validator.ts`

- [ ] **Step 1: Write the failing tests for username claim normalization and validation**
  Cover empty input, valid latin handles, trimming, invalid characters removal/reporting.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 3: Implement `src/lib/claim-validator.ts`**
  Provide helper function `sanitizeClaimUsername(input: string)` and validation status.
- [ ] **Step 4: Run test to confirm passing**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 5: Commit**
  `git commit -m "feat(landing): add claim username validation utility and tests"`

---

### Task 2: Landing Page Header & Footer Components

**Files:**
- Create: `src/components/landing/LandingHeader.tsx`
- Create: `src/components/landing/LandingFooter.tsx`
- Modify: `tests/integration/landing-page.test.ts`

- [ ] **Step 1: Write unit tests for LandingHeader and LandingFooter**
  Verify brand logo, navigation links to `/login` and `/register`, and RTL layout.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 3: Implement `LandingHeader.tsx` and `LandingFooter.tsx`**
  Header with sticky blurred backdrop, logo badge, and login/register CTAs. Footer with copyright, quick links, and platform mission.
- [ ] **Step 4: Run test to confirm passing**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 5: Commit**
  `git commit -m "feat(landing): implement LandingHeader and LandingFooter components"`

---

### Task 3: Hero Section with Interactive Handle Claim

**Files:**
- Create: `src/components/landing/HeroSection.tsx`
- Modify: `tests/integration/landing-page.test.ts`

- [ ] **Step 1: Add tests for HeroSection**
  Test handle input typing, form submission redirect to `/register?username=...`, and trust badges display.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 3: Implement `HeroSection.tsx`**
  Modern Arabic hero with high-contrast badge ("المنصة العربية الأولى لصفحات البايو"), headline, input group (`anlinks.to/` prefix + input + submit CTA button), and micro-copy (مجاني، إعداد بدقيقتين).
- [ ] **Step 4: Run test to confirm passing**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 5: Commit**
  `git commit -m "feat(landing): implement HeroSection with interactive handle claim"`

---

### Task 4: Interactive Phone Mockup & Features / Workflow Sections

**Files:**
- Create: `src/components/landing/PhoneMockup.tsx`
- Create: `src/components/landing/FeaturesSection.tsx`
- Create: `src/components/landing/HowItWorksSection.tsx`
- Modify: `tests/integration/landing-page.test.ts`

- [ ] **Step 1: Add tests for Mockup, Features, and HowItWorks components**
  Verify rendered items, feature cards, and step numbers.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 3: Implement `PhoneMockup.tsx`**
  Realistic phone frame showcasing bio page with Cairo font, verified badge, avatar, custom links, and social bar.
- [ ] **Step 4: Implement `FeaturesSection.tsx` and `HowItWorksSection.tsx`**
  Features cards (Speed, Arabic RTL, Clean Analytics, Themes) and 3-step timeline.
- [ ] **Step 5: Run test to confirm passing**
  Run `npx vitest run tests/integration/landing-page.test.ts`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(landing): add PhoneMockup, FeaturesSection, and HowItWorksSection"`

---

### Task 5: Assemble `src/app/page.tsx` & Production Verification

**Files:**
- Create: `src/app/page.tsx`
- Modify: `tests/integration/landing-page.test.ts`

- [ ] **Step 1: Add full integration test for `src/app/page.tsx`**
  Render root page and verify title, meta tags, and all child sections exist.
- [ ] **Step 2: Implement `src/app/page.tsx`**
  Integrate all components with Open Graph metadata and structured layout.
- [ ] **Step 3: Run all Vitest suites**
  Run `npx vitest run` ensuring 100% tests pass.
- [ ] **Step 4: Verify Next.js production build**
  Run `npm run build` ensuring successful static generation of `/`.
- [ ] **Step 5: Commit & Push**
  `git commit -m "feat(landing): complete root landing page with full SSR and metadata"` and `git push origin main`.
