# Task 6 Brief: Unit & Integration Test Suites for Responsive Admin Console

## Scope
Implement comprehensive test coverage for the responsive admin console in:
- `tests/unit/admin-sidebar-responsive.test.tsx` [Create]
- Verify and run `tests/integration/admin-sidebar-layout.test.ts`

## Detailed Specification
1. **`tests/unit/admin-sidebar-responsive.test.tsx`:**
   - Use `renderToStaticMarkup` from `react-dom/server` (runs cleanly in Node environment).
   - Mock `next-auth/react` (e.g. `useSession: vi.fn()`).
   - Group 1: Desktop Expanded Mode (`isCollapsed: false` / default):
     - Renders `w-72` desktop aside.
     - Displays full brand text ("روابط | AN LINKS", "Console المشغّل والمدير").
     - Displays category headers ("إدارة النظام", "التنقل السريع").
     - Displays full tab labels and pill badges.
     - Displays collapse button with title/aria-label "طي القائمة الجانبية" and `ChevronRight`.
   - Group 2: Desktop Collapsed Rail Mode (`isCollapsed: true`):
     - Renders `w-20` desktop aside.
     - Hides brand text (`hidden`).
     - Replaces category text with horizontal dividers.
     - Centers nav item buttons (`w-12 h-12 mx-auto justify-center`).
     - Hides tab label text inside nav buttons.
     - Preserves `title` and `aria-label` attributes on nav buttons for tooltips and accessibility.
     - Renders corner miniature badges (`absolute -top-1 -right-1 text-[9px]`).
     - Displays expand button with title/aria-label "توسيع القائمة الجانبية" and `ChevronLeft`.
   - Group 3: Architectural Isolation (Mobile Drawer vs Desktop Rail):
     - When `isCollapsed: true` and `isOpenMobile: true`:
       - Desktop aside has `w-20`.
       - Mobile drawer (`fixed inset-y-0 right-0 w-72`) STILL renders full tab names, section titles, and mobile close button `X`.
   - Group 4: Page Mount Integration:
     - Render `AdminConsolePage`.
     - Verify it contains `AdminSidebarPullHandle` attributes (`role="button"`, `aria-label="فتح القائمة الجانبية"`).
     - Verify it contains both mobile hamburger and desktop collapse toggle buttons.

2. **Verification:**
   - `npx vitest run tests/unit/admin-sidebar-responsive.test.tsx`
   - `npx vitest run tests/integration/admin-sidebar-layout.test.ts`
   - `npx tsc --noEmit`

