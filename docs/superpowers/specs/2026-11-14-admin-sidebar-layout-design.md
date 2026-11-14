# Admin Console Sidebar Layout Design

> **Feature**: Admin Console Sidebar Layout (تحويل لوحة المشغّل إلى قائمة جانبية)  
> **Target**: `src/app/(admin)/admin/page.tsx`, `src/features/admin/components/AdminSidebar.tsx`  
> **Date**: 2026-11-14  

---

## 1. Intent & The Why
The Admin Console (`/admin`) currently renders all 6 major sections (Analytics, Users, Sessions, Payments, Settings, Reports) in a cramped horizontal scrollable bar at the top of the page (`AdminNavTabs.tsx`). As the platform grows with real metrics and badges (16 users, 10 sessions, 9 reports), an enterprise-grade vertical sidebar (`AdminSidebar`) provides:
- Superior visual hierarchy and immediate visibility of all platform sections without horizontal scrolling.
- Clear indicators and badge counters for pending items.
- Dedicated quick navigation to Creator Dashboard (`/dashboard`) and Public Site (`/`).
- Seamless responsive behavior: persistent right-aligned sidebar on desktop (RTL), and a smooth slide-over drawer on mobile/tablet.

---

## 2. Requirements & Visual Structure

### 2.1 Desktop Layout (`lg:flex`)
- **Right Sidebar (`w-72` sticky `min-h-screen` bg-surface-container-lowest border-l border-outline-variant/20)**:
  - **Header**: Logo `روابط | AN LINKS` with Shield icon and badge `Console الإدارة المركزية`.
  - **Navigation List (Vertical)**:
    1. 📊 الإحصائيات والنمو (`analytics`)
    2. 👥 إدارة المستخدمين (`users`) [شارة: عدد المستخدمين، e.g., 16]
    3. 🖥️ الجلسات النشطة (`sessions`) [شارة: عدد الجلسات، e.g., 10]
    4. 💳 طرق الدفع والاشتراكات (`payments`)
    5. ⚙️ إعدادات المنصة (`settings`)
    6. 🛡️ البلاغات والاعتدال (`reports`) [شارة تنبيه حمراء: البلاغات المعلقة، e.g., 9]
  - **Footer**:
    - زر انتقال مباشر: «لوحة صانع المحتوى» (`/dashboard`)
    - زر انتقال مباشر: «الموقع الرئيسي» (`/`)
    - بطاقة هوية المشغّل (`sysadmin`) مع زر تسجيل الخروج السريع.
- **Left Main Content Area (`flex-1 min-w-0`)**:
  - **Sticky Top Bar**:
    - Hamburger button for mobile (`lg:hidden`).
    - Breadcrumb title: `لوحة المشغّل والمدير > [اسم التبويب الحالي]`
    - Action controls: Refresh button, ThemeToggle, UserNavDropdown.
  - **Workspace Container**:
    - Max-w-7xl padded workspace hosting the active tab component.

### 2.2 Mobile Layout (`< lg`)
- Sidebar is hidden by default.
- Top bar contains a hamburger icon button (`Menu`).
- Clicking hamburger opens `AdminSidebar` as a full-height slide-over drawer with backdrop overlay.
- Clicking any link or the backdrop closes the drawer.

---

## 3. Strict Constraints
- Every modified or created file MUST remain strictly < 250 lines (aim < 180 lines).
- Functions < 40 lines.
- RTL first (`dir="rtl"`) with Cairo font.
- 100% green test suite in Vitest.
- Clean Next.js `next build` (25/25 routes).

