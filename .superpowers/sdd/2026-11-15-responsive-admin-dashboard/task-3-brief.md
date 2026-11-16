# Task 3 Brief: Collapsible & Icons-Only Mode in AdminSidebar

## Scope
Upgrade `AdminSidebar.tsx` to support the collapsed icons-only rail mode on desktop while strictly preserving full expanded rendering for the mobile slide-over drawer:
- `src/features/admin/components/AdminSidebar.tsx` [Modify]

## Detailed Specification
1. **Props Interface Upgrade:**
   ```typescript
   export interface AdminSidebarProps {
     activeTab: AdminTabKey;
     onTabChange: (tab: AdminTabKey) => void;
     usersCount?: number;
     sessionsCount?: number;
     pendingReportsCount?: number;
     isOpenMobile?: boolean;
     onCloseMobile?: () => void;
     isCollapsed?: boolean;
     onToggleCollapse?: () => void;
   }
   ```
   All new props are optional (`isCollapsed = false` by default).

2. **CRITICAL ARCHITECTURAL ISOLATION (Mobile vs. Desktop):**
   - Replace the monolithic `const content = (...)` JSX variable with a function:
     `const renderSidebarContent = (isCollapsedView: boolean) => (...)`
   - **Desktop Aside (`<aside className="hidden lg:block ...">`)**:
     - Class toggles: `${isCollapsed ? "w-20" : "w-72"} shrink-0 h-screen sticky top-0 z-30 transition-all duration-300`
     - Passes `renderSidebarContent(isCollapsed)`
   - **Mobile Slide-Over Drawer (`<div className="fixed inset-y-0 right-0 w-72...">`)**:
     - ALWAYS passes `renderSidebarContent(false)` (Never collapsed on mobile!).
     - Keeps full brand text, category headers, tab labels, and mobile `X` close button.

3. **Icons-Only Rail Mode Visual Transformations (`isCollapsedView === true`):**
   - **Header:**
     - Brand Link: Text spans (`روابط | AN LINKS` and `Console المشغّل والمدير`) are hidden (`hidden`).
     - Shield icon is centered (`mx-auto`).
     - If `onToggleCollapse` is provided, render desktop toggle button (`ChevronRight` when expanded, `ChevronLeft` when collapsed in RTL) with proper `aria-label` and `title`.
   - **Category Section Headers ("إدارة النظام", "التنقل السريع"):**
     - When expanded: Show the text header.
     - When collapsed: Render subtle divider line `<div className="my-2 border-t border-outline-variant/15" aria-hidden="true" />`.
   - **Nav Items:**
     - Button container: `isCollapsedView ? "w-12 h-12 mx-auto justify-center px-0 relative" : "w-full justify-between px-3.5 py-2.5"`
     - Labels: Hidden when `isCollapsedView === true`.
     - Tooltips / A11y: Add `title={item.label}` and `aria-label={item.label}` on the button.
     - Badges: When collapsed, render as absolute corner badge dot:
       `className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${item.badgeColor || 'bg-primary text-on-primary'}"`
   - **Footer Shortcuts (`/dashboard`, `/`):**
     - When collapsed: Text labels hidden, icons centered (`w-12 h-10 mx-auto justify-center`), with `title` and `aria-label`.

4. **Backward Compatibility:**
   - Existing tests in `tests/integration/admin-sidebar-layout.test.ts` must pass without modifications!
   - Component must not require `isCollapsed` or `onToggleCollapse` to be passed.

5. **Verification:**
   - `npx vitest run tests/integration/admin-sidebar-layout.test.ts`
   - `npx tsc --noEmit`

