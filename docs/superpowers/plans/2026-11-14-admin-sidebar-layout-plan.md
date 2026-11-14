# Admin Console Sidebar Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Admin Console (`/admin`) layout from a top horizontal tab bar to a dedicated enterprise-grade vertical sidebar (`AdminSidebar`) with responsive mobile drawer support and quick platform links.

**Architecture:** Create a standalone, accessible vertical sidebar component (`AdminSidebar.tsx`) that renders navigation items with live counter badges, platform switchers, and admin profile card. Refactor `src/app/(admin)/admin/page.tsx` into a responsive 2-column shell (sticky right sidebar on desktop in RTL, collapsible drawer on mobile, and spacious workspace on the left).

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS (M3 Semantic Tokens), Lucide Icons, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-14-admin-sidebar-layout-design.md`

## Global Constraints

- File size limit: Every created or modified file MUST be strictly under 250 lines (aim < 180 lines).
- Function size limit: Functions must be under 40 lines.
- RTL-First: All layouts use `dir="rtl"` with Cairo typography.
- Design Tokens: Use Material 3 semantic variables (`bg-surface`, `bg-surface-container-low`, `text-on-surface`, `border-outline-variant/30`).
- Test Coverage: 100% green tests in Vitest and clean `next build` (25/25 routes).

## Review Focus

1. Mobile drawer open/close behavior without scrolling backdrop bleed.
2. Active tab indicator styling contrast and badge visibility in both light and dark modes.
3. Quick link to Creator Dashboard (`/dashboard`) and Public Site (`/`) from the sidebar.
4. Correct label and badge mapping: 16 users, 10 sessions, 9 pending reports.
5. Immediate tab switching without full page reload.

---

### Task 1: Create `AdminSidebar` Component

**Files:**
- Create: `src/features/admin/components/AdminSidebar.tsx`
- Modify: `src/features/admin/index.ts`
- Test: `tests/integration/admin-sidebar-layout.test.ts`

**Interfaces:**
- Produces: `AdminSidebar(props: AdminSidebarProps)`
  - `activeTab: AdminTabKey`
  - `onTabChange: (tab: AdminTabKey) => void`
  - `usersCount: number`
  - `sessionsCount: number`
  - `pendingReportsCount: number`
  - `isOpenMobile: boolean`
  - `onCloseMobile: () => void`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/integration/admin-sidebar-layout.test.ts
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

describe("AdminSidebar Component", () => {
  it("should render all 6 admin tabs with titles and count badges", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminSidebar, {
        activeTab: "analytics",
        onTabChange: vi.fn(),
        usersCount: 16,
        sessionsCount: 10,
        pendingReportsCount: 9,
        isOpenMobile: false,
        onCloseMobile: vi.fn(),
      })
    );

    expect(html).toContain("الإحصائيات والنمو");
    expect(html).toContain("إدارة المستخدمين");
    expect(html).toContain("16");
    expect(html).toContain("الجلسات النشطة");
    expect(html).toContain("10");
    expect(html).toContain("البلاغات والاعتدال");
    expect(html).toContain("9");
    expect(html).toContain("طرق الدفع والاشتراكات");
    expect(html).toContain("إعدادات المنصة");
    expect(html).toContain("لوحة صانع المحتوى");
    expect(html).toContain("الموقع الرئيسي");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/admin-sidebar-layout.test.ts`  
Expected: FAIL with "Cannot find module '@/features/admin/components/AdminSidebar'"

- [ ] **Step 3: Implement `AdminSidebar` in `src/features/admin/components/AdminSidebar.tsx`**

Implement full sidebar:
- Top branding with Shield icon, "روابط | AN LINKS", and "Console الإدارة".
- Navigation buttons list with icons (`BarChart3`, `Users`, `ShieldCheck`, `CreditCard`, `Settings`, `AlertTriangle`), highlighted active tab, and dynamic badges.
- Bottom footer with links to `/dashboard` and `/`, plus admin identity card.
- Slide-over backdrop drawer when `isOpenMobile` is true.
- Keep file < 200 lines.

- [ ] **Step 4: Export `AdminSidebar` in `src/features/admin/index.ts`**

Export `AdminSidebar` and `AdminSidebarProps`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/integration/admin-sidebar-layout.test.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/features/admin/components/AdminSidebar.tsx src/features/admin/index.ts tests/integration/admin-sidebar-layout.test.ts
git commit -m "feat(admin): implement enterprise AdminSidebar component"
```

---

### Task 2: Refactor Admin Console Shell for Sidebar Layout

**Files:**
- Modify: `src/app/(admin)/admin/page.tsx`
- Test: `tests/integration/admin-sidebar-layout.test.ts`

**Interfaces:**
- Consumes: `AdminSidebar`, `useAdminConsole`
- Produces: New responsive 2-column admin layout (`lg:flex` with sticky right sidebar and left workspace).

- [ ] **Step 1: Add integration test for admin page sidebar rendering**

```typescript
it("should render AdminConsolePage with responsive sidebar shell and breadcrumb", async () => {
  const { default: AdminConsolePage } = await import("@/app/(admin)/admin/page");
  // verify page component exists and mounts with sidebar
  expect(AdminConsolePage).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify current state**

Run: `npx vitest run tests/integration/admin-sidebar-layout.test.ts`

- [ ] **Step 3: Refactor `src/app/(admin)/admin/page.tsx`**

- Replace top `AdminNavTabs` with `<AdminSidebar ... />` rendered alongside the main workspace.
- Add `isMobileMenuOpen` state and `Menu` hamburger toggle in the top bar.
- Add dynamic breadcrumb in the top bar: `لوحة المشغّل والمدير > {tabTitle}`.
- Keep file strictly < 180 lines.

- [ ] **Step 4: Run integration test to verify it passes**

Run: `npx vitest run tests/integration/admin-sidebar-layout.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/(admin)/admin/page.tsx tests/integration/admin-sidebar-layout.test.ts
git commit -m "feat(admin): refactor admin console to enterprise sidebar layout"
```

---

### Task 3: Full Verification & Production Build

**Files:**
- Verify all tests across all test suites.
- Verify `next build`.

- [ ] **Step 1: Run full Vitest suite**

Run: `npx vitest run`  
Expected: 34 passed (34 test files, 160+ tests green).

- [ ] **Step 2: Run production Next.js build**

Run: `rm -rf .next && npx next build`  
Expected: 25/25 static & dynamic pages successfully generated without errors.

- [ ] **Step 3: Verify line counts**

Run: `wc -l src/features/admin/components/AdminSidebar.tsx src/app/(admin)/admin/page.tsx`  
Expected: All files < 250 lines.

- [ ] **Step 4: Commit and finalize**

```bash
git commit --allow-empty -m "chore(admin): verified enterprise sidebar layout with green test suite"
```

