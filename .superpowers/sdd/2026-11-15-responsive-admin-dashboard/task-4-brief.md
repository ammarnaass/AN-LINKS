# Task 4 Brief: Layout Container & Header Integration in AdminConsolePage

## Scope
Integrate `useAdminSidebar`, `AdminSidebarPullHandle`, and the desktop collapse controls into `src/app/(admin)/admin/page.tsx`:
- `src/app/(admin)/admin/page.tsx` [Modify]

## Detailed Specification
1. **Hook & Component Imports:**
   - Import `useAdminSidebar` from `@/features/admin/hooks/useAdminSidebar`.
   - Import `AdminSidebarPullHandle` from `@/features/admin/components/AdminSidebarPullHandle`.
   - Import `ChevronLeft` and `ChevronRight` from `lucide-react`.

2. **State Management Integration:**
   - Replace `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);` with:
     ```typescript
     const {
       isCollapsed,
       isMobileOpen,
       toggleCollapse,
       openMobile,
       closeMobile,
     } = useAdminSidebar();
     ```

3. **AdminSidebar Props:**
   - Update `AdminSidebar` invocation:
     ```tsx
     <AdminSidebar
       activeTab={activeTab}
       onTabChange={setActiveTab}
       usersCount={users.length}
       sessionsCount={sessions.length}
       pendingReportsCount={pendingReportsCount}
       isOpenMobile={isMobileOpen}
       onCloseMobile={closeMobile}
       isCollapsed={isCollapsed}
       onToggleCollapse={toggleCollapse}
     />
     ```

4. **Pull Handle Mounting:**
   - Mount `AdminSidebarPullHandle` right before the main content workspace:
     ```tsx
     <AdminSidebarPullHandle
       isOpen={isMobileOpen}
       onOpen={openMobile}
     />
     ```

5. **Header Controls Update:**
   - Mobile hamburger button calls `openMobile` with `aria-label="فتح القائمة الجانبية"`.
   - Desktop toggle button added in header (`hidden lg:flex items-center justify-center p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition cursor-pointer`):
     - Displays `ChevronLeft` when collapsed and `ChevronRight` when expanded (RTL alignment).
     - Carries `title` and `aria-label`.

6. **Preserve Breadcrumb & Titles:**
   - Keep `"لوحة المشغّل والمدير > "` and `{TAB_TITLES[activeTab]}`.

7. **Verification:**
   - `npx vitest run tests/integration/admin-sidebar-layout.test.ts`
   - `npx tsc --noEmit`

