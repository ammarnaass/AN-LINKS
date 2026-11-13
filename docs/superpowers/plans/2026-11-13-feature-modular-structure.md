# Implementation Plan: Feature Modular Structure Refactoring
**Date:** 2026-11-13  
**Standard:** `skills/feature-modular-structure/SKILL.md`  
**Methodology:** EGM + SDD (Subagent / Superpowers Driven Development)  

---

## Overview & Objectives
Refactor the monolithic frontend and scattered domain logic into a clean, feature-driven architecture:
1. Every feature in its own directory (`src/features/<feature-name>/`) with public `index.ts`.
2. Every file has single responsibility and strictly under 150-250 lines.
3. Strict layer separation: no direct network fetches in UI components; validators and services isolated.
4. Shared code in `src/shared/`.
5. 100% backward compatibility: 0 broken routes, 72/72 passing Vitest tests, working Next.js production build.

---

## Tasks Breakdown

### Phase 1: Shared Infrastructure (`src/shared/`)
- [ ] Create `src/shared/db/prisma.ts` and `src/shared/db/index.ts`
- [ ] Create `src/shared/ui/design-system.ts`, `src/shared/ui/SocialIcons.tsx`, `src/shared/ui/index.ts`
- [ ] Create `src/shared/utils/url-sanitizer.ts`, `bot-detector.ts`, `image-processor.ts`, `reserved-usernames.ts`, `src/shared/utils/index.ts`
- [ ] Create `src/shared/index.ts`
- [ ] Re-export from `src/lib/` to maintain 100% test compatibility.

### Phase 2: Refactor Settings Feature (`src/features/settings/`) [769 lines -> 7 files <130 lines]
- [ ] Create `src/features/settings/types/settings.types.ts`
- [ ] Create `src/features/settings/validators/settings.validator.ts`
- [ ] Create `src/features/settings/hooks/useProfileSettings.ts` & `usePasswordSettings.ts`
- [ ] Create component `SettingsHeader.tsx`
- [ ] Create component `SettingsTabsNav.tsx`
- [ ] Create component `ProfileTab.tsx`
- [ ] Create component `SubscriptionTab.tsx`
- [ ] Create component `PayoutsTab.tsx`
- [ ] Create component `SecurityTab.tsx`
- [ ] Create component `DangerZoneTab.tsx`
- [ ] Create `src/features/settings/index.ts`
- [ ] Update `src/app/(dashboard)/dashboard/settings/page.tsx` to compose settings components (<50 lines).

### Phase 3: Refactor Analytics Feature (`src/features/analytics/`) [432 lines -> 6 files <140 lines]
- [ ] Create `src/features/analytics/types/analytics.types.ts`
- [ ] Create `src/features/analytics/services/analytics.service.ts` & `tracking.service.ts`
- [ ] Create component `AnalyticsHeader.tsx`
- [ ] Create component `AnalyticsKpiCards.tsx`
- [ ] Create component `AnalyticsChart.tsx`
- [ ] Create component `TrafficSourcesTable.tsx`
- [ ] Create component `TopLinksTable.tsx`
- [ ] Create component `DevicesAndGeoBreakdown.tsx`
- [ ] Create `src/features/analytics/index.ts`
- [ ] Update `src/app/(dashboard)/dashboard/analytics/page.tsx` (<50 lines).

### Phase 4: Refactor Links Feature (`src/features/links/`) [416 lines -> 7 files <150 lines]
- [ ] Create `src/features/links/types/links.types.ts`
- [ ] Create `src/features/links/constants/categories.ts`
- [ ] Create `src/features/links/validators/link.validator.ts`
- [ ] Create component `LinkCardItem.tsx`
- [ ] Create component `AddLinkForm.tsx`
- [ ] Create component `EditLinkForm.tsx`
- [ ] Create component `LinkEditor.tsx` (clean composer container)
- [ ] Create component `SocialLinksEditor.tsx`
- [ ] Create component `LinksHeaderStats.tsx`
- [ ] Create component `MobilePreview.tsx`
- [ ] Create `src/features/links/index.ts`
- [ ] Update `src/app/(dashboard)/dashboard/page.tsx` (<80 lines).

### Phase 5: Refactor Appearance Feature (`src/features/appearance/`) [279 lines -> 7 files <80 lines]
- [ ] Create `src/features/appearance/types/appearance.types.ts`
- [ ] Create `src/features/appearance/constants/themes.ts`
- [ ] Create component `ProfilePreviewHeaderEditor.tsx`
- [ ] Create component `ThemePresetsGrid.tsx`
- [ ] Create component `AccentColorPicker.tsx`
- [ ] Create component `ButtonStylePicker.tsx`
- [ ] Create component `BorderRadiusPicker.tsx`
- [ ] Create component `FontPicker.tsx`
- [ ] Create component `ThemeCustomizer.tsx` (composer)
- [ ] Create `src/features/appearance/index.ts`
- [ ] Update `src/app/(dashboard)/dashboard/appearance/page.tsx` (<50 lines).

### Phase 6: Refactor Auth, Bio & Landing Features
- [ ] Create `src/features/auth/` (LoginForm, RegisterForm, AuthBrandAside, auth.service, register.validator)
- [ ] Update `src/app/(auth)/login/page.tsx` & `src/app/(auth)/register/page.tsx`
- [ ] Create `src/features/bio/` (BioPageContent, ProfileCard, LinkButton, QrShareModal, ReportModal, services)
- [ ] Update `src/app/(public)/[username]/page.tsx`
- [ ] Create `src/features/landing/` (Header, Hero, PhoneMockup, Features, HowItWorks, Footer)
- [ ] Update `src/app/page.tsx`

### Phase 7: Verification & Final Polish
- [ ] Run `npm test` (all 72 Vitest unit/integration tests must pass).
- [ ] Verify file line counts with `find src -type f -exec wc -l {} + | sort -rn` (all files <150-250 lines).
- [ ] Run `npm run build` (Next.js production build must compile all 13 routes).
- [ ] Test live server with `node tests/e2e-live-test.mjs`.
- [ ] Commit and push to GitHub.
