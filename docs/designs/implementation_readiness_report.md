# تقرير تدقيق الجاهزية للتنفيذ (Implementation Readiness Report)

* **Document Under Audit:** `docs/designs/payment-gateways-and-subscriptions.md` (Lines 395–489: Detailed Implementation Plan)
* **Standard:** `implementation-readiness-standard`
* **Auditors:**
  - `egm-implementation-readiness` (Technical Lead & Implementing Engineer)
  - `egm-codebase-details` (Codebase Compliance Auditor)
  - `egm-style` (Technical Copy Editor)
* **Date:** 2026-11-14

---

## ملخص نتائج التدقيق (Executive Summary)

أظهر التدقيق المستقل لخطة التنفيذ (Detailed Implementation Plan) وجود:
- **3 معوقات حرجة (🔴 Blockers)** تمنع المطور من البدء المباشر وتتسبب في أخطاء تجميع برمجية (Build/Validation Errors).
- **8 ملاحظات هندسية كبرى (🟡 Major Architecture Gaps)** تترك قرارات معمارية وتصميمية للمطور بدلاً من توثيقها مسبقاً.
- **5 ملاحظات أسلوبية وتحسينية (⚪ Nits & Style Calibration)** لإزالة المبالغات وضبط العبارات غير الدقيقة.

---

## 1. المعوقات الحرجة (Blockers 🔴)

### Finding B-1: كسر علاقات نموذج المستخدم (`User`) في Prisma
* **Severity:** 🔴 Blocker
* **Affected Scope:** المرحلة 1، البند 1 (`prisma/schema.prisma`)
* **الوصف والمخاطر:** يحدد التصميم إضافة نماذج `UserSubscription` و `FinancialInvoice` وتعيين مفتاح أجنبي يربطهما بنموذج `User`. تشترط Prisma تعريف العلاقات المتبادلة (Bidirectional Relations). نموذج `model User` الحالي في `prisma/schema.prisma` لا يحتوي على حقول العلاقات المقابلة. محاولة تشغيل `npx prisma validate` أو `npx prisma migrate` ستفشل فوراً بخطأ تجميع.
* **الحل المطلوب:** توثيق التعديل الإلزامي في نموذج `model User`:
  ```prisma
  model User {
    // ... الحقول الحالية
    subscriptions UserSubscription[]
    invoices      FinancialInvoice[]
  }
  ```
  وتحديد أمر الهجرة: `npx prisma migrate dev --name init_financials_system`.

### Finding B-2: إغفال مسارات الاشتراك والتحقق الأساسية من خطة الـ API
* **Severity:** 🔴 Blocker
* **Affected Scope:** المرحلة 3 (مسارات الـ API، البنود 6–13)
* **الوصف والمخاطر:** حدد المخطط المعماري ومسارات المستخدم (CUJ 2) مسار بدء الدفع `POST /api/subscriptions/checkout` ومسار فحص الكوبون `POST /api/subscriptions/validate-coupon` ومسار الملخص العام `GET /api/admin/financials/overview`. إلا أن جدول مهام المرحلة 3 أسقط هذه المسارات تماماً؛ مما يمنع تنفيذ دورة الدفع وتطبيق الخصومات.
* **الحل المطلوب:** إضافة مهام صريحة في المرحلة 3 لكل من:
  1. `src/app/api/subscriptions/checkout/route.ts` (إنشاء جلسات الدفع).
  2. `src/app/api/subscriptions/validate-coupon/route.ts` (التحقق اللحظي من الخصم).
  3. `src/app/api/admin/financials/overview/route.ts` (ملخص لوحة الإدارة المالية).

### Finding B-3: غياب نموذج وآلية سجل التدقيق (Audit Logging)
* **Severity:** 🔴 Blocker
* **Affected Scope:** المرحلة 1 والمرحلة 3 مقابل الهدف 4 والمتطلب غير الوظيفي 3 (NFR 3)
* **الوصف والمخاطر:** نص الهدف 4 والمتطلب NFR 3 على: *"سجل تدقيق كامل: تسجيل كل تعديل يجريه مدير النظام على الأسعار أو البوابات أو الكوبونات مع حفظ تاريخ التعديل وهوية المدير"*. ومع ذلك، أغفلت خطة التنفيذ نموذج `AdminFinancialAuditLog` في Prisma، ولم تخصص خدمة أو مساراً لتسجيل هذه التغييرات.
* **الحل المطلوب:** إضافة نموذج `FinancialAuditLog` إلى `prisma/schema.prisma` وربطه بالخدمة الخلفية لتسجيل أي تغيير في الأسعار أو البوابات أو العملات.

---

## 2. الملاحظات الهندسية الكبرى (Major Gaps 🟡)

### Finding M-1: غياب وسوم دورة حياة الملفات (`[Create]`, `[Modify]`, `[Delete]`)
* **Severity:** 🟡 Major
* **Affected Scope:** كامل قائمة الملفات (البنود 1–27)
* **الوصف:** تسرد الخطة 27 ملفاً دون وسم واضح يوضح هل الملف جديد كلياً (`[Create]`) أم تعديل على ملف قائم (`[Modify]`). يجب وسم كل ملف بوضوح.

### Finding M-2: غياب معمارية محولات الويب هوك (Gateway Webhook Adapters)
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 3، البند 13 (`src/app/api/subscriptions/webhooks/[gateway]/route.ts`)
* **الوصف:** بوابات الدفع المختلفة (Moyasar, Stripe, Tamara, Tap) تختلف جذرياً في خوارزميات التحقق من التوقيع (HMAC-SHA256 مقابل RSA مقابل Headers مخصصة) وهيكل الأحداث الواردة، وقراءة النص الخام للطلب (`req.text()`). الخطة تركت هذا التصميم للمنفذ.
* **الحل المطلوب:** تعريف واجهة محول موحدة (`PaymentWebhookAdapter`) وتحديد آلية التحقق من التوقيع، واستخراج معرف المعاملة (`gatewayTxId`) لفرض منع التكرار (Idempotency).

### Finding M-3: إسقاط مكونين رئيسيين من واجهة المستخدم في المرحلة 4
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 4 (واجهة المستخدم)
* **الوصف:** حدد هيكل المكونات في القسم 1 ملف `hooks/useAdminFinancials.ts` وملف `modals/CurrencyRateModal.tsx`. ومع ذلك، أسقطت المرحلة 4 من خطة التنفيذ هذين الملفين تماماً.
* **الحل المطلوب:** إضافة بندين صريحين لتطوير `useAdminFinancials.ts` (إدارة حالة التبويبات والمزامنة) و `CurrencyRateModal.tsx` (نافذة تعديل أسعار الصرف والدول المرتبطة).

### Finding M-4: غموض توافق الاستدعاء مع `AdminPaymentsTab.tsx` و `page.tsx`
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 4، البند 14، وملف `src/app/(admin)/admin/page.tsx`
* **الوصف:** المكون الحالي `AdminPaymentsTab` يتلقى خصائص مباشرة (`settings`, `transactions`, `onUpdateSettings`) من `useAdminConsole()`. تحويله لغلاف يستدعي `AdminFinancialsContainer` سيتسبب في أخطاء TypeScript وتضارب في جلب البيانات إذا لم تُحدد استراتيجية التوافق الرجعي (Backwards Compatibility).
* **الحل المطلوب:** توثيق جعل الخصائص الحالية اختيارية (`optional props`) وتحديث `src/app/(admin)/admin/page.tsx` لربط الحاوية بشكل مستقل ومتكامل.

### Finding M-5: غياب المواصفات التشفيرية لـ `src/shared/lib/crypto.ts`
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 2، البند 5، وملف `.env.example`
* **الوصف:** لم توثق الخطة صيغة التخزين المشفر لخوارزمية `AES-256-GCM` (IV + AuthTag + Ciphertext)، ولم تُدرج متغير البيئة `PAYMENT_ENCRYPTION_KEY` في `.env.example`.
* **الحل المطلوب:** توثيق صيغة التخزين `${ivHex}:${authTagHex}:${encryptedHex}` والتحقق من أن المفتاح بطول 32 بايت، وتحديث `.env.example`.

### Finding M-6: قصور وانجراف الأنواع البرمجية في `admin.types.ts`
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 2، البند 3 (`src/features/admin/types/admin.types.ts`)
* **الوصف:** نوع `GatewayId` الحالي محصور في 5 بوابات؛ وإضافة `stripe` و `tabby` و `fawry` يقتضي توسيع النوع أو تحويله لنوع ديناميكي. كما أن حقل `AdminTransaction.plan` محصور في قيم ثابتة ولا يدعم معرفات الباقات الديناميكية (`SubscriptionPlan.slug`).

### Finding M-7: غياب أساليب الطلب ومخططات التحقق (Zod Schemas) في الـ API
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 3 (مسارات الـ API، البنود 6–12)
* **الوصف:** تذكر المسارات دون بيان أساليب HTTP المدعومة (`GET`, `POST`, `PUT`, `DELETE`)، أو معايير التصفح والصفحات (Pagination)، أو مخططات التحقق من المدخلات (Zod Schemas).

### Finding M-8: إهمال البنية التحتية للاختبارات (Vitest Test Infrastructure)
* **Severity:** 🟡 Major
* **Affected Scope:** المرحلة 5 (الاختبارات، البنود 26–27)
* **الوصف:** تقترح الخطة اختبارات تكاملية للويب هوك وحسابات العملات ولكنها تفتقر لبيان كيفية محاكاة تواقيع بوابات الدفع (Mock Webhook Signatures) أو تزييف قاعدة بيانات Prisma في Vitest.

---

## 3. الملاحظات الأسلوبية والتحسينية (Style & Calibration Nits ⚪)

1. **إلغاء المبالغات المطلقة (Uncalibrated Claims):** استبدال عبارات مثل *"أمان نمطي كامل"* و *"منع أي أخطاء حسابية"* و *"ويفعل اشتراك المستخدمين لحظياً"* بعبارات هندسية مقاسة ودقيقة تثبت النطاق الفعلي للاختبارات والتنفيذ.
2. **شطب العبارات الترويجية (Marketing Fluff):** حذف كلمات مثل *"شريط تنقل سلس"* و *"بضغطة زر"* و *"بأمان وسهولة"* والتركيز على التوصيف الوظيفي المحايد.
3. **ربط سكريبت التهيئة (`seed-financials.ts`) بملف `prisma/seed.ts`:** تعديل `prisma/seed.ts` ليستدعي دوال التهيئة المالية حتى تعمل مع أمر `npm run seed`.
4. **تحديد القيمة الاحتياطية لبيئة التطوير المحلي (Localhost Fallback):** توضيح أن غياب ترويسات `cf-ipcountry` في بيئة التطوير المحلي يعيد تلقائياً العملة الأساسية (`SAR` / `SA`).

---

## الخلاصة والتوصية
يوصى بتطبيق المعالجة الفورية (Remediation) لهذه الملاحظات في وثيقة التصميم [docs/designs/payment-gateways-and-subscriptions.md](file:///home/ammar/AN%20LINKS/docs/designs/payment-gateways-and-subscriptions.md) لتصبح الخطة قابلة للتنفيذ المباشر بنسبة 100% دون أي لبس هندسي.

