# Task 2 Brief: Mobile Edge Pull Handle Component

## Scope
Implement `AdminSidebarPullHandle.tsx` and unit tests in:
- `src/features/admin/components/AdminSidebarPullHandle.tsx` [Create]
- `tests/unit/admin-sidebar-pull-handle.test.tsx` [Create]

## Detailed Specification
1. **Component Interface (`AdminSidebarPullHandleProps`):**
   ```typescript
   export interface AdminSidebarPullHandleProps {
     isOpen: boolean;
     onOpen: () => void;
     className?: string;
   }
   ```
2. **Behavior & Styling:**
   - `"use client";`
   - Hidden on desktop screens (`lg:hidden`).
   - If `isOpen === true`, return `null` (auto-hidden when drawer is open).
   - Positioned fixed at the right screen edge (in RTL):
     `fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden flex items-center justify-center w-6 h-14 bg-primary text-on-primary rounded-l-xl shadow-lg border-l border-y border-outline-variant/30 cursor-pointer select-none transition-all active:scale-95 hover:w-7`
   - Content: Lucide `ChevronLeft` icon (w-4 h-4), pointing inward toward the content.
3. **Accessibility (A11y):**
   - `aria-label="فتح القائمة الجانبية"`
   - `role="button"`
   - `tabIndex={0}`
   - Keyboard support: `onKeyDown` with `Enter` or `Space` invokes `onOpen()`.
4. **Touch Swipe Gesture Handling:**
   - Attach `onTouchStart` and `onTouchEnd` on the pull handle element.
   - Record touch coordinates `x` and `y`.
   - On `onTouchEnd`:
     - Axis constraint: `if (Math.abs(deltaY) > Math.abs(deltaX)) return;`
     - RTL swipe detection: `if (deltaX < -25) onOpen();`
5. **Unit Tests (`tests/unit/admin-sidebar-pull-handle.test.tsx`):**
   - Test rendering in SSR/Node environment using `renderToStaticMarkup`.
   - Test that handle renders when `isOpen = false` with accessibility attributes (`role="button"`, `aria-label="فتح القائمة الجانبية"`).
   - Test that handle returns null when `isOpen = true`.
   - Test click, keyboard, and touch event callback invocations.
6. **Verification:**
   - `npx vitest run tests/unit/admin-sidebar-pull-handle.test.tsx`
   - `npx tsc --noEmit`

