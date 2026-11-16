# خطة تنفيذ تفكيك وهيكلة الملفات المتضخمة في مشروع AN LINKS
## (Feature Modular Structure & Architecture Refactoring Implementation Plan)

* **التاريخ:** 2026-11-16
* **المرجع المعياري:** [`skills/feature-modular-structure/SKILL.md`](file:///home/ammar/AN%20LINKS/skills/feature-modular-structure/SKILL.md)
* **وثيقة التصميم:** [`docs/designs/feature-modular-refactoring.md`](file:///home/ammar/AN%20LINKS/docs/designs/feature-modular-refactoring.md)
* **تقرير التدقيق والجاهزية:** [`docs/designs/implementation_readiness_report_feature_modular.md`](file:///home/ammar/AN%20LINKS/docs/designs/implementation_readiness_report_feature_modular.md)

---

## 1. جدول المهام التنفيذية (SDD Execution Roadmap)

| المهمة | الوصف ومسارات التعديل | الملفات الناتجة | معيار التحقق | الحالة |
| :--- | :--- | :--- | :--- | :--- |
| **Task 1** | تفكيك الأنواع وأنماط المظهر | `admin.types.ts` -> 3 ملفات، `themes.ts` -> 2 ملف | `tsc --noEmit` + `appearance.test.ts` | ⏳ قيد التنفيذ |
| **Task 2** | تفكيك خدمات الخادم المالية والتدقيق | `admin-financials.service.ts` -> 6 خدمات + `audit` | `tsc --noEmit` + `admin-financials-service.test.ts` | ⏳ في الانتظار |
| **Task 3** | تفكيك خطافات الحالة المالية التركيبية | `useAdminFinancials.ts` -> 5 خطافات نطاق + المنسق | `tsc --noEmit` + `admin-financials-client.test.ts` | ⏳ في الانتظار |
| **Task 4** | تفكيك حاوية المالية والتبويبات الخمسة | `AdminFinancialsContainer.tsx` + 5 تبويبات فرعية | `tsc --noEmit` + `admin-financials-container.test.tsx` | ⏳ في الانتظار |
| **Task 5** | تفكيك النوافذ المنبثقة المالية الثلاث | `PlanEditorModal`, `GatewayConfigModal`, `CouponEditorModal` | `tsc --noEmit` | ⏳ في الانتظار |
| **Task 6** | تفكيك القائمة الجانبية وصفحة المظهر | `AdminSidebar.tsx` + `dashboard/appearance/page.tsx` | `tsc --noEmit` + `admin-sidebar-responsive.test.tsx` | ⏳ في الانتظار |
| **Task 7** | التحقق الشامل والفحص الحاسم للبناء | فحص الأسطر (<250) + Prisma + Vitest (54 ملف) + Build | `npm run test` + `npm run build` | ⏳ في الانتظار |

---

## 2. بروتوكول التطوير القائم على الوكلاء الفرعيين (SDD Protocol)
لكل مهمة من المهام 1-7:
1. إطلاق وكيل تنفيذ (`self` role: `Task X Implementer`) لتطبيق التفكيك بدقة.
2. إطلاق وكيل تدقيق ومراجعة (`self` role: `Task X Reviewer`) للتحقق من عدم تجاوز الأسطر، وعدم انكسار الاختبارات، وسلامة التصدير.
3. التثبيت في git (Commit) مع رسالة واضحة تشير إلى المهمة.
4. تحديث سجل التقدم `progress.md`.

