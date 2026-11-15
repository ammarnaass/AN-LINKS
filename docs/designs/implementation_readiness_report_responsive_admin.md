# تقرير تدقيق الجاهزية للتنفيذ (Implementation Readiness & Style Review Report)

* **الوثيقة الخاضعة للتدقيق:** `docs/designs/responsive-admin-dashboard.md`
* **المراجعون (Goldfish Reviewers):**
  - `egm-implementation-readiness` (Technical Lead & Pragmatic Auditor)
  - `egm-codebase-details` (Codebase Details & SSR/React 19 Auditor)
  - `egm-style` (Technical Copy Editor)
* **التاريخ:** 2026-11-15
* **الحالة النهائية:** Approved with Incorporations (جاهز للتنفيذ بعد المعالجة)

---

## 1. ملخص المعالجة والقرارات الهندسية (Consensus & Resolutions)

| المعرف | التصنيف | الملاحظة | القرار الهندسي المعتمد في التصميم المحدث |
|---|---|---|---|
| **B1** | Blocker | عزل محتوى درج الموبايل عن الطي المكتبي | درج الموبايل (`Slide-over Drawer`) يظل دائماً في النمط الكامل الممتد (`Expanded`) بأسماء التبويبات وزر الإغلاق `X`. وضع الطي (`isCollapsed`) ينحصر تأثيره حصراً على الشريط المكتبي (`<aside className="hidden lg:block">`). |
| **B2** | Blocker | أمان الهايدريشن والـ SSR في Next.js 15 | الحالة المبدئية لـ `isCollapsed` في `useAdminSidebar` دائماً `false` لتطابق رندر الخادم، وتتم قراءة `localStorage` داخل `useEffect` بعد الـ Mount مع كتلة `try/catch`. |
| **B3** | Blocker | بيئة اختبارات Vitest (Node Environment) | اعتماد نمط `renderToStaticMarkup` (المستخدم في `admin-sidebar-layout.test.ts`) لاختبار مكونات الـ UI ونمط الأيقونات والخصائص دون الحاجة لمكتبات محاكاة DOM خارجية غير متوافقة مع React 19. |
| **M1** | Major | حسم سلوك الأجهزة اللوحية (Tablet 640px-1023px) | حسم السلوك قطعياً: جميع الشاشات الأقل من 1024px تتبع **الدرج المنبثق مع مقبض السحب الجانبي** (`lg:hidden`). نمط الأيقونات المصغر مخصص للشاشات الكبيرة (`lg:block`). |
| **M2** | Major | تعريف الخصائص الإجبارية مقابل الاختيارية | جعل الخاصيتين `isCollapsed?: boolean` (افتراضياً `false`) و `onToggleCollapse?: () => void` اختياريتين بالكامل لمنع أي كسر لاختبارات TypeScript الحالية. |
| **M3** | Major | تقييد إيماءات اللمس لمنع تعارض التمرير الرأسي | ربط أحداث اللمس بمقبض السحب (`PullHandle`) وحاوية الدرج فقط مع فحص تفاضلي للمحاور (`Math.abs(deltaX) > Math.abs(deltaY)`) وحساب اتجاه RTL (`deltaX < -40` للفتح، `deltaX > 40` للإغلاق). |
| **M4** | Major | التحول البصري الصريح لنمط الأيقونات | تحديد فئات CSS الصريحة لإخفاء نصوص الشعار وعناوين الأقسام، توسيط الأيقونات (`justify-center`)، وتحويل الشارات إلى دوائر نقطية مصغرة (`absolute -top-1 -right-1 text-[9px] min-w-4 h-4`). |
| **S1** | Style | توحيد المصطلحات الفنية | توحيد المصطلحات عبر الوثيقة كاملة: `لوحة تحكم مدير النظام`، `مقبض السحب الجانبي` (`AdminSidebarPullHandle`)، `نمط الأيقونات المصغر` (`Icons-Only Rail Mode`)، `الدرج المنبثق` (`Slide-over Drawer`). |
| **S2** | Style | شطب الحشو الأدبي والتوصيفات الترويجية | حذف العبارات التزيينية ("أنيق"، "برقة"، "عرضاً ممتازاً"، "100%") واستبدالها بتوصيفات هندسية رقمية ومحددة السلوك. |
