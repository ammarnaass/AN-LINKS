---
title: "خطة تنفيذ لوحة تحكم مدير النظام المتجاوبة والقائمة الجانبية القابلة للطي ومقبض السحب"
date: "2026-11-15"
author: "Ammar"
status: "Completed"
target: "src/app/(admin)/admin/page.tsx, src/features/admin/components/AdminSidebar.tsx, src/features/admin/*"
---

# خطة التنفيذ الفائقة: لوحة تحكم مدير النظام المتجاوبة والقائمة الجانبية القابلة للطي ومقبض السحب

## 1. ملخص الخطة والهدف
تحويل لوحة تحكم مدير النظام في منصة **AN LINKS** لتكون متجاوبة بالكامل عبر كافة أحجام الشاشات (الهواتف الذكية من 320px، الأجهزة اللوحية والمطوية 640px-1023px، الشاشات المكتبية 1024px-1439px، والشاشات العريضة 1440px+):
1. دعم **نمط الأيقونات المصغر (Icons-Only Rail Mode `w-20`)** للشاشات المكتبية لتوسيع مساحة العمل ومصفوفات الجداول، مع زر تبديل وحفظ التفضيل في `localStorage`.
2. إضافة **مقبض السحب الجانبي (AdminSidebarPullHandle)** على الحافة اليمنى للشاشات الصغيرة مع دعم إيماءات اللمس السريعة لفتح **الدرج المنبثق (Slide-over Drawer)**.
3. ضمان بقاء الدرج المنبثق للموبايل في النمط الممتد الكامل دائماً دون أن يتأثر بوضع الطي المكتبي.
4. أمان تام مع SSR و React 19 في Next.js 15 لمنع أي أخطاء في الهايدريشن أو الانهيار في بيئة Vitest Node.
5. التحقق الكامل عبر اختبارات Vitest وفحص الأنواع TypeScript وبناء بيئة الإنتاج Next.js 15.

---

## 2. جدول المهام التنفيذية (Task Breakdown)

### Task 1: خطاف إدارة حالة القائمة الجانبية (`useAdminSidebar.ts`)
- **الملفات المستهدفة:**
  - `src/features/admin/hooks/useAdminSidebar.ts` [إنشاء]
  - `tests/unit/admin-sidebar-hook.test.ts` [إنشاء]
- **الخطوات:**
  1. إنشاء خطاف `useAdminSidebar` لإدارة حالتي:
     - `isCollapsed: boolean` (افتراضياً `false` لمطابقة رندر الخادم SSR).
     - `isMobileOpen: boolean` (افتراضياً `false`).
  2. قراءة التفضيل المخزن `admin_sidebar_collapsed` من `localStorage` داخل `useEffect` بعد الـ Mount فقط لتفادي أخطاء الهايدريشن، مع حمايته بكتلة `try/catch`.
  3. توفير دوال التحكم: `toggleCollapse()`, `openMobile()`, `closeMobile()`, `toggleMobile()`.
  4. كتابة اختبار وحدة `tests/unit/admin-sidebar-hook.test.ts` للتحقق من الانتقالات المنطقية للحالة.
- **أوامر التحقق:**
  - `npx vitest run tests/unit/admin-sidebar-hook.test.ts`
  - `npx tsc --noEmit`

---

### Task 2: مكون مقبض السحب الجانبي للموبايل والتابلت (`AdminSidebarPullHandle.tsx`)
- **الملفات المستهدفة:**
  - `src/features/admin/components/AdminSidebarPullHandle.tsx` [إنشاء]
- **الخطوات:**
  1. بناء المكون `AdminSidebarPullHandle` بمحاذاة الحافة اليمنى للشاشة (`fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden`).
  2. تصميم مخصص للمس بيد واحدة: شريط مريح بلون `bg-primary text-on-primary` مع أيقونة `ChevronLeft` أو `GripVertical`.
  3. إخفاء المقبض تلقائياً عند كون القائمة مفتوحة (`if (isOpen) return null`).
  4. إضافة دعم إيماءات اللمس الأفقية عبر `onTouchStart` و `onTouchEnd` الأصلية مع فحص تفاضلي للمحاور (`Math.abs(deltaX) > Math.abs(deltaY)`) وفي اتجاه RTL (`deltaX < -30` يفتح القائمة).
  5. تعيين صفات الوصولية `aria-label="فتح القائمة الجانبية"` و `role="button"`.
- **أوامر التحقق:**
  - `npx tsc --noEmit`

---

### Task 3: ترقية القائمة الجانبية لدعم نمط الأيقونات المصغر وعزل درج الموبايل (`AdminSidebar.tsx`)
- **الملفات المستهدفة:**
  - `src/features/admin/components/AdminSidebar.tsx` [تعديل]
- **الخطوات:**
  1. ترقية `AdminSidebarProps` بإضافة الخصائص الاختيارية:
     ```typescript
     isCollapsed?: boolean;
     onToggleCollapse?: () => void;
     ```
  2. إعادة هيكلة رندر محتوى القائمة عبر دالة داخلية `renderSidebarContent(isCollapsedView: boolean)`:
     - للشريط المكتبي `<aside className="hidden lg:block ...">`: يُمرر له `isCollapsed` الفعلي.
     - لدرج الموبايل `<div className="fixed inset-y-0 right-0 w-72...">`: يُمرر له دائماً `false` ليبقى ممتداً بالكامل بالأسماء وعناوين الأقسام وزر الإغلاق `X`.
  3. في وضع الأيقونات المصغر (`isCollapsedView = true`):
     - انكماش العرض من `w-72` إلى `w-20` مع فئة `transition-all duration-300`.
     - إخفاء نصوص الشعار وعناوين الأقسام واستبدالها بفواصل أفقية دقيقة.
     - توسيط أزرار التبويبات أفقياً (`justify-center px-0 w-12 h-12 mx-auto relative`).
     - إبقاء `title={item.label}` و `aria-label={item.label}` لإظهار التلميحات الفورية عند التمرير.
     - تحويل الشارات الرقمية إلى دوائر نقطية مصغرة فوق زاوية الأيقونة (`absolute -top-1 -right-1 text-[9px] min-w-4 h-4 rounded-full`).
     - إضافة زر الطي (`ChevronRight` عند التوسيع، و `ChevronLeft` عند الطي في اتجاه RTL) لتبديل العرض المكتبي.
- **أوامر التحقق:**
  - `npx tsc --noEmit`

---

### Task 4: دمج التجاوب والترويسة في صفحة الإدارة الرئيسية (`page.tsx`)
- **الملفات المستهدفة:**
  - `src/app/(admin)/admin/page.tsx` [تعديل]
- **الخطوات:**
  1. استدعاء خطاف `useAdminSidebar` وتمرير مخرجاته (`isCollapsed`, `toggleCollapse`, `isMobileOpen`, `openMobile`, `closeMobile`).
  2. تركيب مكون `AdminSidebarPullHandle` على مستوى الصفحة.
  3. تمرير `isCollapsed` و `onToggleCollapse` إلى مكون `AdminSidebar`.
  4. إضافة زر تبديل وضع الطي المكتبي في الترويسة العلوية بجانب عنوان المسار (`hidden lg:flex items-center gap-2`).
  5. التأكد من تمدد وانكماش مساحة العمل التلقائي بفضل بنية `flex-1 min-w-0`.
- **أوامر التحقق:**
  - `npx tsc --noEmit`

---

### Task 5: تدقيق التمرير الأفقي الآمن لجداول البيانات وتصدير الحزمة
- **الملفات المستهدفة:**
  - `src/features/admin/index.ts` [تعديل]
  - `src/features/admin/components/AdminUsersTable.tsx` [فحص وتحديث التمرير]
  - `src/features/admin/components/AdminReportsTable.tsx` [فحص وتحديث التمرير]
- **الخطوات:**
  1. تصدير المكونات والخطافات الجديدة في `src/features/admin/index.ts` (`useAdminSidebar`, `AdminSidebarPullHandle`, وأنواعهما).
  2. التأكد من وجود حاويات `overflow-x-auto min-w-[640px]` على جداول المستخدمين والبلاغات وجداول المعاملات لمنع أي انزياح أفقي على الشاشات الأصغر من 640px.
- **أوامر التحقق:**
  - `npx tsc --noEmit`

---

### Task 6: اختبارات الوحدة والتكامل الشاملة
- **الملفات المستهدفة:**
  - `tests/unit/admin-sidebar-responsive.test.tsx` [إنشاء]
  - `tests/integration/admin-sidebar-layout.test.ts` [تحديث والتحقق]
- **الخطوات:**
  1. إنشاء `tests/unit/admin-sidebar-responsive.test.tsx` باستخدام `renderToStaticMarkup`:
     - اختبار الرندر في النمط الممتد الافتراضي (`w-72`) وظهور النصوص والشارات.
     - اختبار الرندر في نمط الأيقونات المصغر (`isCollapsed: true`) والتأكد من ظهور فئة `w-20` والأيقونات والتلميحات والشارات المصغرة.
     - اختبار بقاء درج الموبايل في النمط الممتد وظهور زر الإغلاق ونصوص التبويبات حتى لو كانت القائمة المكتبية في وضع الطي.
  2. تشغيل `tests/integration/admin-sidebar-layout.test.ts` والتأكد من بقاء الاختبارات الأربعة خضراء بنسبة 100%.
- **أوامر التحقق:**
  - `npx vitest run tests/unit/admin-sidebar-responsive.test.tsx`
  - `npx vitest run tests/integration/admin-sidebar-layout.test.ts`

---

### Task 7: التحقق النهائي الشامل وبناء بيئة الإنتاج
- **الخطوات:**
  1. تشغيل فحص التحقق من صحة الأنواع: `npx tsc --noEmit`.
  2. تشغيل مجموعة اختبارات المشروع كاملة: `npm run test` (كافة الـ 40+ ملف اختبار و 290+ اختبار تجتاز بنسبة 100%).
  3. تشغيل بناء Next.js 15 لبيئة الإنتاج: `npm run build` (نجاح بناء كافة الـ 35 صفحة ومسار دون أي خطأ).
  4. مراجعة فحص التغييرات وتوثيق الإنجاز النهائي للمستخدم.
