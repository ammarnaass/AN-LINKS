# تقرير تجميع وتوافق مراجعات الجاهزية الهندسية وتدقيق الكود
## (Synthesis & Audit Resolution Report: Feature Modular Refactoring)

* **المشروع:** AN LINKS
* **التاريخ:** 2026-11-16
* **الوثيقة الخاضعة للتدقيق:** [`docs/designs/feature-modular-refactoring.md`](file:///home/ammar/AN%20LINKS/docs/designs/feature-modular-refactoring.md)
* **المراجعون:**
  1. `egm-style` (محرر الصياغة والمعايير الأسلوبية)
  2. `egm-implementation-readiness` (قائد الفريق التقني وجاهزية التنفيذ)
  3. `egm-codebase-details` (مدقق تفاصيل الكود والاختبارات التلقائية)

---

## 1. ملخص التدقيق الإجمالي (Executive Synthesis)

أجمعت فرق التدقيق الثلاثة على قوة التوجه المعماري وأهميته القصوى لضبط جودة الكود واستيفاء معيار [`feature-modular-structure`](file:///home/ammar/AN%20LINKS/skills/feature-modular-structure/SKILL.md) (حيث لا يتجاوز أي ملف 250 سطراً مع استهداف <150 سطراً ودوال <40 سطراً).  
تم رصد مجموعة من الملاحظات الدقيقة المصنفة، وجرى وضع حلول هندسية حاسمة لكل منها لتحديث وثيقة التصميم قبل بدء التنفيذ المباشر.

---

## 2. جدول الملاحظات وقرارات المعالجة (Consolidated Findings & Resolutions)

| المعرف | التصنيف | المصدر | المشكلة المرصودة | قرار المعالجة الهندسي المعتمد |
| :--- | :--- | :--- | :--- | :--- |
| **BLK-1** | 🔴 Blocker | `codebase-details` & `implementation-readiness` | تناقض صريح في وصف تذييل القائمة الجانبية `AdminSidebarFooter.tsx`، حيث نص التصميم على وجود "معلومات المستخدم وزر الخروج" بينما الكود الفعلي يحتوي فقط على روابط التنقل السريع (`/dashboard` و `/`). | تصحيح توصيف المكون ليطابق الكود الفعلي تماماً: `روابط التنقل السريع للوحة التحكم والموقع العام مع دعم وضعي العرض المطوي والموسع (isCollapsedView)`. |
| **BLK-2** | 🔴 Blocker | `implementation-readiness` | افتقار مهام القسم 4 في الوثيقة للتعليمات الإجرائية المحددة وعقود المكونات وقوائم الملفات ووسوم التعديل. | إعادة كتابة وتفصيل مهام التنفيذ (Tasks 1-7) خطوة بخطوة وتصنيف كل ملف بوسم `[Create]`, `[Modify]`, `[Barrel]`. |
| **MAJ-1** | 🟡 Major | `codebase-details` & `implementation-readiness` | إغفال خطة تفكيك التبويبات الخمسة المتضخمة (1,581 سطراً): `PlanQuotasSubTab`, `InvoicesTransactionsSubTab`, `PlansSubTab`, `CouponsSubTab`, `GatewaysSubTab`. | إضافة قرار معماري صريح يحدد المكونات الفرعية المستخرجة لكل تبويب (مثل `PlanQuotasNumericLimits`, `InvoicesFilterBar`, `GatewayCard`, `CouponsTable`, إلخ). |
| **MAJ-2** | 🟡 Major | `codebase-details` & `implementation-readiness` | وضع دالة التدقيق المالي `logFinancialAudit` داخل خدمة الفواتير يسبب تزاوجاً غير منطقي (Tight Coupling) لأن بوابات الدفع والخطط والكوبونات والعملات تستدعيها. | استخراج التدقيق المالي في خدمة متخصصة مستقلة: `src/features/admin/server/financials/audit.service.ts` تستوردها كافة الخدمات وتُعاد تصديرها من البرميل. |
| **MAJ-3** | 🟡 Major | `codebase-details` & `implementation-readiness` | غموض نموذج تركيب خطافات المالية في `useAdminFinancials.ts` وإغفال حالة `overview` والمزامنة الموحدة لـ `isLoading`, `isSaving`, `feedback`. | اعتماد نمط تركيب متكامل: الخطافات الفرعية تنفذ العمليات التخصصية، والخطاف المجمع `useAdminFinancials` ينسق دورة الحياة وحالة النظرة العامة ويوحد التغذية الراجعة لضمان تطابق `ReturnType<typeof useAdminFinancials>` بنسبة 100%. |
| **MAJ-4** | 🟡 Major | `codebase-details` & `implementation-readiness` | إيجاز مبهم في تفكيك النوافذ المنبثقة الثلاث: `PlanEditorModal`, `GatewayConfigModal`, `CouponEditorModal`. | تحديد المكونات المستخرجة لكل نافذة بدقة (مثل `PlanPricingMatrix`, `GatewaySecretFields`, `CouponDiscountFields`). |
| **MIN-1** | 🔵 Minor | `egm-style` & `codebase-details` | تصنيف خاطئ لـ `PlanQuotasSubTab` على أنه نافذة منبثقة بدلاً من تبويب مضمن. | تصحيح التصنيف ونقل `PlanQuotasSubTab` للمهمة 4 ضمن التبويبات. |
| **MIN-2** | 🔵 Minor | `implementation-readiness` & `codebase-details` | إغفال الأسماء البديلة الستة (Aliases) في `themes.ts` (`default`, `midnight`, `sunset`, `violet`, `slate`, `gold`) الضرورية للتوافق العكسي. | نقل كافة الـ 18 إدخالاً (12 سمة رئيسية + 6 أسماء بديلة) بالكامل إلى `theme-presets.ts`. |
| **MIN-3** | 🔵 Minor | `egm-style` & `codebase-details` | عدم تحديد مسار فيزيائي دقيق لـ `MobilePhoneDrawer.tsx`. | تحديد المسار المعياري في مجلد الميزة: `src/features/appearance/components/MobilePhoneDrawer.tsx` وإعادة تصديره عبر `features/appearance/index.ts`. |
| **NIT-1** | ⚪ Nit | `egm-style` | تجنب استخدام مصطلح "خدمات مصغرة (microservices)" لوصف ملفات دوال داخلية، واستبدال مصطلح "ملفات البرميل" بـ "ملفات الفهرسة والتجميع (Barrel files)". | استبدال المصطلحات بمصطلحات برمجية دقيقة: "خدمات نطاقية فرعية (Sub-services)" و "ملفات الفهرسة والتجميع (Barrel files)". |

---

## 3. القرار النهائي والاعتماد

تم اعتماد كافة التوصيات والإصلاحات أعلاه، وسيتم تحديث وثيقة التصميم [`docs/designs/feature-modular-refactoring.md`](file:///home/ammar/AN%20LINKS/docs/designs/feature-modular-refactoring.md) فوراً لتصبح الخطة التنفيذية جاهزة 100% للتطبيق البرمجي الخالي من المخاطر.

