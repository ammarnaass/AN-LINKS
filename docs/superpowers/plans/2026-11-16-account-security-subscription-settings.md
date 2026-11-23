# خطة التنفيذ التفصيلية: نظام إعدادات الحساب والأمان والاشتراك وتحصيل الأرباح
## (Account, Security, Subscription & Payouts Implementation Plan)

* **المشروع:** AN LINKS
* **التاريخ:** 2026-11-16
* **المرجع المعياري:** [`skills/feature-modular-structure/SKILL.md`](file:///home/ammar/AN%20LINKS/skills/feature-modular-structure/SKILL.md)
* **وثيقة التصميم المعتمدة:** [`docs/designs/account-security-subscription-settings.md`](file:///home/ammar/AN%20LINKS/docs/designs/account-security-subscription-settings.md)
* **تقرير الجاهزية والتوليف:** [`docs/designs/implementation_readiness_report_settings.md`](file:///home/ammar/AN%20LINKS/docs/designs/implementation_readiness_report_settings.md)
* **سجل التتبع (SDD Progress Ledger):** [`.superpowers/sdd/2026-11-16-account-security-subscription-settings/progress.md`](file:///home/ammar/AN%20LINKS/.superpowers/sdd/2026-11-16-account-security-subscription-settings/progress.md)

---

## أهداف التنفيذ وقواعد الجودة (Quality Standards & Invariants)

1. **صفر بيانات وهمية (Zero Mock Data):** جميع التبويبات (الملف الشخصي، الاشتراك، تحصيل الأرباح، الأمان، الجلسات) ترتبط مباشرة بقاعدة البيانات.
2. **الامتثال للهيكلية النمطية (`feature-modular-structure`):**
   - الحد الأقصى لأي ملف برمجي هو $\le 250$ سطراً (المستهدف أقل من 150 سطراً).
   - الحد الأقصى لأي دالة هو $\le 40$ سطراً.
   - عزل كود الخادم: `src/features/settings/index.ts` لا يُصدّر خدمات الخادم نهائياً.
3. **الأمان والتشفير:**
   - تشفير أسرار الـ TOTP والرموز الاحتياطية بمفتاح AES-256-GCM.
   - التحقق من الآيبان السعودي بخوارزمية ISO 7064 MOD 97-10 والتحقق من بنوك ساما.
4. **بوابات الجودة (Quality Gates):**
   - نجاح اختبارات Vitest بنسبة 100%.
   - خلو المشروع من أخطاء TypeScript.
   - نجاح أمر بناء الإنتاج لـ Next.js 15 (`npm run build`).

---

## تفاصيل المهام التنفيذية (Tasks Breakdown)

### 📌 المهمة 1: تثبيت التبعيات وتحديث مخطط Prisma والهجرة
* **الهدف:** إضافة حزم `otplib` و `qrcode` وتحديث `prisma/schema.prisma` بالنماذج الأربعة وتحديث نموذج `User`.
* **الملفات المتأثرة:**
  - `package.json`
  - `prisma/schema.prisma`
* **الإجراءات:**
  1. تثبيت الحزم: `npm install otplib qrcode && npm install -D @types/qrcode`.
  2. تحديث `prisma/schema.prisma`:
     - إضافة علاقات `User`: `payoutProfile`, `payoutRequests`, `twoFactorAuth`, `securityAuditLogs`.
     - إضافة النماذج: `CreatorPayoutProfile`, `PayoutRequest`, `UserTwoFactorAuth`, `SecurityAuditLog`.
  3. تنفيذ `npx prisma validate && npx prisma db push`.
* **التحقق:**
  - نجاح `npx prisma validate`.
  - التحقق من توليد العميل عبر `npx prisma generate`.

---

### 📌 المهمة 2: خدمات الخادم النمطية للأمان والملف الشخصي والمصادقة الثنائية
* **الهدف:** إنشاء خدمات الخادم للأمان، تحديث كلمة المرور، وتوليد والتحقق من مفاتيح TOTP والرموز الاحتياطية، وتحديث `authOptions`.
* **الملفات المتأثرة:**
  - `src/features/settings/server/profile.service.ts` (<120 سطر)
  - `src/features/settings/server/security.service.ts` (<130 سطر)
  - `src/features/settings/server/two-factor.service.ts` (<140 سطر)
  - `src/features/auth/server/auth.options.ts` (تكامل تحدي الـ 2FA في تسجيل الدخول)
  - `src/features/settings/validators/settings.validator.ts` (إضافة التحقق من الأسماء المحجوزة)
* **الإجراءات:**
  1. كتابة `profile.service.ts` لإدارة وتحديث بيانات `User` و `Profile` والتحقق من عدم تكرار اسم المستخدم والبريد وتجنب الأسماء المحجوزة عبر `isUsernameReserved`.
  2. كتابة `security.service.ts` للتحقق من وتحديث كلمة المرور بـ `bcryptjs`، وتسجيل أحداث الأمان في `SecurityAuditLog`.
  3. كتابة `two-factor.service.ts` لتوليد سر TOTP ورموز الاسترداد، وتشفيرها بـ AES-256-GCM، والتحقق بنافذة $\pm 1$ خطوة زمنية وإبطال الرموز الاحتياطية ذرياً.
  4. تحديث `authOptions.providers.CredentialsProvider` لفحص حالة 2FA وطلب الرمز أو إرجاع خطأ `2FA_REQUIRED`.
* **التحقق:**
  - كتابة اختبارات وحدة لـ `two-factor.service.ts` و `security.service.ts`.
  - اجتياز جميع الاختبارات بدون أخطاء.

---

### 📌 المهمة 3: خدمات الخادم النمطية للاشتراكات والحصص وتحصيل الأرباح
* **الهدف:** توفير حساب دقيق لرصيد الأرباح، فحص الآيبان، استعلام الاشتراك الحي واستهلاك الحصص والفواتير.
* **الملفات المتأثرة:**
  - `src/features/settings/server/payouts.service.ts` (<130 سطر)
  - `src/features/settings/server/subscription.service.ts` (<140 سطر)
  - `src/features/settings/constants/saudi-banks.ts` (<80 سطر)
  - `src/features/settings/validators/settings.validator.ts` (تطبيق خوارزمية ISO 7064 MOD 97-10)
* **الإجراءات:**
  1. إنشاء `saudi-banks.ts` الذي يحتوي على رموز بنوك ساما وأسمائها.
  2. تحديث `validateSaudiIban` لتطبيق خوارزمية ISO 7064 MOD 97-10 والتحقق من البنك.
  3. كتابة `payouts.service.ts`: جلب وتحديث الآيبان المعتمد، احتساب الرصيد المتاح من المبيعات مطروحاً منها السحوبات، وإنشاء طلب سحب جديد في معاملة ذرية.
  4. كتابة `subscription.service.ts`: استعلام الاشتراك الحي، تطبيق الرجوع إلى الباقة المجانية عند انعدام الاشتراك، حساب استهلاك الحصص (روابط، نطاق، مظهر)، وإلغاء الاشتراك بنهاية الفترة.
* **التحقق:**
  - كتابة اختبار وحدة لخوارزمية الآيبان واحتساب الحصص.
  - اجتياز اختبارات Vitest.

---

### 📌 المهمة 4: مسارات واجهات برمجة التطبيقات (API Route Handlers)
* **الهدف:** ربط واجهات العميل بخدمات الخادم عبر مسارات آمنة ومحمية بـ NextAuth.
* **الملفات المتأثرة:**
  - `src/app/api/settings/profile/route.ts` (<90 سطر)
  - `src/app/api/settings/security/password/route.ts` (<80 سطر)
  - `src/app/api/settings/security/2fa/route.ts` (<110 سطر)
  - `src/app/api/settings/payouts/route.ts` (<110 سطر)
  - `src/app/api/settings/subscription/route.ts` (<110 سطر)
  - `src/app/api/profile/route.ts` (تحديثه ليعتمد على `profile.service.ts` لضمان التوافق الخلفي)
* **الإجراءات:**
  1. إنشاء المسارات وتأمينها بجلب جلسة المستخدم `session.user.id`.
  2. التعامل مع الاستثناءات وإرجاع رسائل أخطاء واضحة بصيغة JSON.
* **التحقق:**
  - كتابة اختبارات تكامل لجميع المسارات الجديدة والتأكد من إرجاع رمز 401 عند انعدام الجلسة.

---

### 📌 المهمة 5: خدمة العميل وواجهات الملف الشخصي والأمان والمصادقة الثنائية
* **الهدف:** بناء طبقة العميل النمطية وعزلها، وتفكيك وتطوير `ProfileTab` و `SecurityTab`.
* **الملفات المتأثرة:**
  - `src/features/settings/services/settings.client.ts` (<140 سطر)
  - `src/features/settings/hooks/useSettingsProfile.ts` (<100 سطر)
  - `src/features/settings/hooks/useSettingsSecurity.ts` (<110 سطر)
  - `src/features/settings/components/profile/AvatarUploadCard.tsx` (<90 سطر)
  - `src/features/settings/components/profile/ProfileFieldsForm.tsx` (<120 سطر)
  - `src/features/settings/components/ProfileTab.tsx` (<100 سطر)
  - `src/features/settings/components/security/SecurityPasswordForm.tsx` (<90 سطر)
  - `src/features/settings/components/security/SecurityTwoFactorCard.tsx` (<90 سطر)
  - `src/features/settings/components/security/SecuritySessionsList.tsx` (<110 سطر)
  - `src/features/settings/components/security/TwoFactorModal.tsx` (<130 سطر)
  - `src/features/settings/components/SecurityTab.tsx` (<90 سطر)
  - `src/features/settings/index.ts` (تحديث التصديرات مع الالتزام التام بعزل كود الخادم)
* **الإجراءات:**
  1. كتابة `settings.client.ts` للتعامل مع الـ APIs.
  2. بناء خطافات React واستخدامها لإدارة الحالة.
  3. تفكيك المكونات وضمان أن كل ملف أقل من 150 سطراً مع الحفاظ على تجربة مستخدم عربية RTL فائقة وسلسة.
* **التحقق:**
  - التحقق من عدم تجاوز أي ملف 250 سطراً.
  - اختبار المكونات في المتصفح واختبارات React testing.

---

### 📌 المهمة 6: واجهات تحصيل الأرباح والاشتراكات الحية والفاتورة المبسطة
* **الهدف:** تفكيك وتطوير `PayoutsTab` و `SubscriptionTab` لربطهما بالبيانات الحقيقية 100%.
* **الملفات المتأثرة:**
  - `src/features/settings/hooks/useSettingsPayouts.ts` (<110 سطر)
  - `src/features/settings/hooks/useSettingsSubscription.ts` (<110 سطر)
  - `src/features/settings/components/payouts/PayoutBalanceCard.tsx` (<90 سطر)
  - `src/features/settings/components/payouts/PayoutIbanForm.tsx` (<120 سطر)
  - `src/features/settings/components/payouts/PayoutWithdrawModal.tsx` (<110 سطر)
  - `src/features/settings/components/payouts/PayoutHistoryTable.tsx` (<100 سطر)
  - `src/features/settings/components/PayoutsTab.tsx` (<90 سطر)
  - `src/features/settings/components/subscription/SubscriptionActivePlanCard.tsx` (<110 سطر)
  - `src/features/settings/components/subscription/SubscriptionQuotasGrid.tsx` (<100 سطر)
  - `src/features/settings/components/subscription/SubscriptionInvoicesTable.tsx` (<100 سطر)
  - `src/features/settings/components/subscription/InvoicePrintModal.tsx` (<120 سطر)
  - `src/features/settings/components/SubscriptionTab.tsx` (<90 سطر)
* **الإجراءات:**
  1. ربط الرصيد الحقيقي وسحب الأرباح فوراً مع نافذة التأكيد.
  2. عرض كود واسم البنك المكتشف تلقائياً عند إدخال الآيبان.
  3. عرض تفاصيل الاشتراك الفعلي واستهلاك الحصص مع أشرطة التقدم.
  4. توفير نافذة عرض وطباعة الفاتورة الضريبية المبسطة بتنسيق طباعة CSS راقٍ.
* **التحقق:**
  - فحص حدود الأسطر في جميع المكونات المنشأة.

---

### 📌 المهمة 7: التحقق الشامل، الاختبارات، وبناء الإنتاج
* **الهدف:** التأكد من اجتياز جميع اختبارات الوحدة، مطابقة معايير الهيكلية النمطية، والتحقق من اكتمال الإنتاج.
* **الإجراءات:**
  1. تشغيل فحص عدد الأسطر في كامل مجلد `src/` والتأكد من عدم وجود أي ملف $\gt 250$ سطراً.
  2. تشغيل اختبارات النظام الشاملة: `npm run test`.
  3. تشغيل تدقيق الأنواع: `npx tsc --noEmit`.
  4. تشغيل بناء الإنتاج: `npm run build`.
  5. مراجعة الكود عبر وكيل المراجعة المستقل لضمان أعلى معايير الجودة.

