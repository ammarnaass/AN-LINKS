# Task 1 Brief: Responsive Sidebar State Hook

## Scope
Implement `useAdminSidebar` hook and unit tests in:
- `src/features/admin/hooks/useAdminSidebar.ts` [Create]
- `tests/unit/admin-sidebar-hook.test.ts` [Create]

## Detailed Specification
1. **Hook Contract (`UseAdminSidebarReturn`):**
   ```typescript
   export interface UseAdminSidebarReturn {
     isCollapsed: boolean;
     isMobileOpen: boolean;
     toggleCollapse: () => void;
     openMobile: () => void;
     closeMobile: () => void;
     toggleMobile: () => void;
   }
   ```
2. **SSR & Hydration Safety (CRITICAL):**
   - Initial state MUST be deterministic for SSR:
     `const [isCollapsed, setIsCollapsed] = useState(false);`
     `const [isMobileOpen, setIsMobileOpen] = useState(false);`
   - Read from `localStorage` ONLY inside `useEffect` after mount:
     ```typescript
     useEffect(() => {
       try {
         const saved = localStorage.getItem("admin_sidebar_collapsed");
         if (saved !== null) {
           setIsCollapsed(saved === "true");
         }
       } catch {
         // Gracefully handle disabled localStorage (private browsing)
       }
     }, []);
     ```
   - When toggling collapse:
     ```typescript
     const toggleCollapse = useCallback(() => {
       setIsCollapsed((prev) => {
         const next = !prev;
         try {
           localStorage.setItem("admin_sidebar_collapsed", String(next));
         } catch {
           // ignore
         }
         return next;
       });
     }, []);
     ```
   - Auto-close mobile drawer when window resizes to `>= 1024px` (desktop):
     ```typescript
     useEffect(() => {
       const handleResize = () => {
         if (window.innerWidth >= 1024) {
           setIsMobileOpen(false);
         }
       };
       window.addEventListener("resize", handleResize);
       return () => window.removeEventListener("resize", handleResize);
     }, []);
     ```
3. **Unit Tests (`tests/unit/admin-sidebar-hook.test.ts`):**
   - Test default initial state (`isCollapsed: false`, `isMobileOpen: false`).
   - Test `toggleCollapse`, `openMobile`, `closeMobile`, `toggleMobile`.
   - Test `localStorage` integration when available and safe fallback when missing.
4. **Verification:**
   - `npx vitest run tests/unit/admin-sidebar-hook.test.ts`
   - `npx tsc --noEmit`

