# تقرير جاهزية التنفيذ والتوليف الشامل (Implementation Readiness & Goldfish Synthesis Report)

**الميزة المستهدفة:** نظام إعدادات الحساب والأمان والاشتراك وتحصيل الأرباح  
**المستند المدقق:** [`docs/designs/account-security-subscription-settings.md`](file:///home/ammar/AN%20LINKS/docs/designs/account-security-subscription-settings.md)  
**المراجعون (Goldfish Swarm):**
1. `egm-style` (Technical Copy Editor)
2. `egm-implementation-readiness` (Pragmatic Tech Lead)
3. `egm-codebase-details` (Pedantic Technical Quality Auditor)
**تاريخ المراجعة:** 2026-11-16  
**المرجع المعياري:** [`skills/feature-modular-structure/SKILL.md`](file:///home/ammar/AN%20LINKS/skills/feature-modular-structure/SKILL.md)

---

## 1. التوليف العام وحالة الاعتماد (Executive Synthesis)

أجمعت مراجعات السمكات الذهبية الثلاث على نضج وقوة التصميم المقترح لنظام الإعدادات والأمان والاشتراكات، مع تحديد **3 ملاحظات حرجة (Blockers)** و **6 ملاحظات رئيسية (Majors)** يجب دمجها ومعالجتها في وثيقة التصميم المحدثة وخطة التنفيذ قبل كتابة الكود:

| التصنيف | عدد الملاحظات | الحالة والقرار التنفيذي |
| :--- | :--- | :--- |
| **Blockers (حرجة)** | 3 | **تم التوافق:** اعتماد حزم `otplib` و `qrcode` صراحة، وتحديث نموذج `User` بالكامل مع تكامل 2FA، واعتماد خوارزمية ISO 7064 MOD 97-10 للآيبان. |
| **Majors (رئيسية)** | 6 | **تم التوافق:** عزل الـ Barrel File لمنع تسريب كود الخادم، وتوحيد مسار الملف الشخصي وفحص الأسماء المحجوزة، وتصحيح قطبية `UserSubscription`، واستكمال حقول `PayoutRequest`. |
| **Minors & Nits** | 6 | **تم التوافق:** إعادة استخدام `session.service.ts` للجلسات، وإضافة `details Json?` وفهارس لسجل الأمان، وتوحيد واجهة التحقق. |

---

## 2. جدول الملاحظات والتسويات التنفيذية (Findings & Resolutions)

### 🔴 الملاحظات الحرجة (Blockers)

1. **غياب تبعيات TOTP و QR Code:**
   * *الملاحظة:* عدم وجود `otplib` أو `qrcode` في `package.json`.
   * *الحل المعتمد:* إضافة حزم `otplib` و `qrcode` مع `@types/qrcode` إلى المشروع في Task 1 لضمان استقرار وتوافق معايير RFC 6238 وتوليد QR Code SVG/DataURL بأمان وسرعة.

2. **عزل وتكامل المصادقة الثنائية (2FA Challenge) مع NextAuth:**
   * *الملاحظة:* `authOptions` الحالي يسجل الدخول بكلمة المرور فقط دون طلب التحقق الثنائي إذا كان مفعّلاً.
   * *الحل المعتمد:* تحديث `authOptions` وتوفير معالجة واضحة: إذا كان المستخدم يملك `UserTwoFactorAuth.isEnabled === true`، يتم التحقق من تزويد رمز الـ TOTP في بيانات الاعتماد أو إرجاع خطأ رمزي يطلب إدخال الرمز، مع توفير آليات التحقق والرموز الاحتياطية.

3. **خوارزمية فحص الآيبان السعودي (Saudi IBAN MOD 97-10):**
   * *الملاحظة:* الكود الحالي يفحص النمط السطحي فقط ولا يطبق خوارزمية MOD 97-10 وجدول رموز البنوك السعودية.
   * *الحل المعتمد:* استبدال التعبير النمطي الحالي في `settings.validator.ts` بخوارزمية ISO 7064 MOD 97-10 مع فحص جدول البنوك السعودية (`SAUDI_BANKS`) لضمان صحة 100%.

---

### 🟡 الملاحظات الرئيسية (Majors)

1. **عزل ملف البرميل (Barrel File Isolation):**
   * *الملاحظة:* يجب ألا يُصدر `src/features/settings/index.ts` خدمات الخادم (`/server/*`) منعاً لتسريب حزم `prisma` و `crypto` و `bcryptjs` إلى واجهات العميل.
   * *الحل المعتمد:* `index.ts` يصدر فقط الكود المشترك والعميل (Components, Hooks, Types, Client Validators). خدمات الخادم تُستورد مباشرة من مسارها الداخلي `src/features/settings/server/*` حصراً في الـ API Routes.

2. **تحديث نموذج `User` بالكامل في مخطط Prisma:**
   * *الملاحظة:* غياب الحقول العكسية المقابلة في نموذج `User` مما يُسقط `prisma validate`.
   * *الحل المعتمد:* إضافة:
     ```prisma
     payoutProfile     CreatorPayoutProfile?
     payoutRequests    PayoutRequest[]
     twoFactorAuth     UserTwoFactorAuth?
     securityAuditLogs SecurityAuditLog[]
     ```
     مع ضبط `onDelete: Cascade`.

3. **قطبية اشتراكات المستخدم (`UserSubscription` Cardinality):**
   * *الملاحظة:* قيد `@unique` على `userId` في `UserSubscription` يمنع تعدد الاشتراكات السابقة.
   * *الحل المعتمد:* الإبقاء على `@unique` للاشتراك النشط الحالي مع استخدام `upsert/update`، واستخدام `FinancialInvoice` كسجل تاريخي لمعاملات الاشتراكات والدفعات.

4. **توحيد مسار الملف الشخصي وفحص الأسماء المحجوزة:**
   * *الملاحظة:* تشتت المسار بين `/api/profile` و `/api/settings/profile` وعدم فحص `isUsernameReserved`.
   * *الحل المعتمد:* دعم التوافق الكامل مع الحفاظ على `/api/profile` أو توجيهه للخدمة الموحدة `profile.service.ts`، مع إضافة فحص `isUsernameReserved` وفحص التكرار الفريد في `validateSettingsProfile`.

5. **استكمال حقول نموذج `PayoutRequest`:**
   * *الملاحظة:* الحقول `processedAt` و `transferReference` يجب أن تكون اختيارية `?`، مع إضافة `rejectionReason String?` و `updatedAt DateTime @updatedAt`.
   * *الحل المعتمد:* إدراج هذه الحقول بالكامل في DDL المهمة الأولى.

6. **معايرة ادعاءات الفوترة الضريبية ورصيد الأرباح:**
   * *الملاحظة:* عدم استخدام مسمى ZATCA الفضفاض بدون UBL XML، بل تسميتها بدقة: "فاتورة ضريبية مبسطة (Simplified Tax Invoice)" بنسبة ضريبة 15%، وحساب الرصيد الفعلي بدقة بناءً على المبيعات المحققة والطلبات المسحوبة.
   * *الحل المعتمد:* تعديل المصطلحات في الوثيقة والواجهة لتكون دقيقة ومطابقة للواقع التشغيلي.

---

### 🔵 الملاحظات الفرعية والشكلية (Minors & Nits)

1. إعادة استخدام `src/features/auth/server/session.service.ts` لقراءة وإنهاء الجلسات بدلاً من تكرار الكود.
2. إضافة حقل `details Json?` وفهرسة مركبة `@@index([userId, createdAt])` إلى `SecurityAuditLog`.
3. استهلاك الرموز الاحتياطية للتحقق الثنائي بشكل ذري وتحديث حالتها في مصفوفة مشفرة لضمان استخدامها لمرة واحدة فقط.

---

## 3. القرار والتوصية النهائية

تم اعتماد كافة توصيات السمكات الذهبية، وتحديث وثيقة التصميم [`docs/designs/account-security-subscription-settings.md`](file:///home/ammar/AN%20LINKS/docs/designs/account-security-subscription-settings.md) لتتوافق معها 100%، وتجهيز خطة التنفيذ المفصلة `docs/superpowers/plans/2026-11-16-account-security-subscription-settings.md` للبدء في المهام السبع وفق منهجية التطوير المدفوع بالوكلاء الفرعيين (SDD).
