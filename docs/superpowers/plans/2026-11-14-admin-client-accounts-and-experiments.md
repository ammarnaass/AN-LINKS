# [Feature] انشاء حساب مدير النظام وحساب العميل وبدء التجارب والاختبارات (نسخة محسنة ومطابقة لـ EGM v2.0.0)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

## 1. Executive Summary & Goals

### 1.1 Objective
تنفيذ متطلبات إدارة الحسابات المتكاملة والمشغّل وفق وثيقة المتطلبات (PRD Sections 5.1 & 5.7):
1. **حساب مدير النظام (System Admin):** مشغّل بصلاحية `ADMIN` لإدارة الحسابات وفحص البلاغات.
2. **حساب العميل (Client Account):** صانع محتوى بصلاحية `USER` كامل البيانات (بروفايل، روابط، شبكات، إحصاءات 14 يوماً).
3. **سكربت بذر قاعدة البيانات (`prisma/seed.ts`):** إنشاء/تحديث الحسابات بشكل مستقل ومتكرر (Idempotent).
4. **طبقة ميزات المشغل (`src/features/admin/`):** طبقة عمارة نظيفة تشمل الأنواع والخدمات وبوابة الحماية (`admin.guard.ts`).
5. **مجموعة التجارب والاختبارات التفاعلية والتكاملية:** موزعة على ملفين منفصلين لضمان الالتزام بسقف **250 سطراً** لكل ملف.

---

## 2. Architecture & EGM Constraints

1. **EGM Strict Limits:**
   - الحفاظ على حجم كل ملف أقل من **250 سطراً** بدقة.
   - الدوال أقل من **40 سطراً**.
   - فصل المسؤوليات عبر بنية الميزات (`src/features/admin/`, `src/features/auth/`, `src/features/bio/`).
2. **NextAuth TypeScript Augmentation:**
   - إنشاء ملف `src/types/next-auth.d.ts` لتعريف حقل `role: "ADMIN" | "USER"` في الجلسة والمستخدم والتوكن.
3. **Prisma Seeding:**
   - الاعتماد على الاستيراد المباشر من `@prisma/client` لتفادي أخطاء Path Aliases في Node.js.
   - ضبط `"prisma": { "seed": "node --experimental-strip-types prisma/seed.ts" }` في `package.json`.
4. **بيانات الاعتماد الرسمية:**
   - **مدير النظام (Admin):**
     - البريد: `admin@anlinks.dev` | المستخدم: `sysadmin` | كلمة المرور: `Admin@123456` | الصلاحية: `ADMIN`
   - **العميل (Client):**
     - البريد: `client@anlinks.dev` | المستخدم: `faisal_client` | كلمة المرور: `Client@123456` | الصلاحية: `USER`

---

## 3. Detailed API Contracts (واجهات المشغّل)

### 3.1 `GET /api/admin/users`
- **الحماية:** `requireAdminSession()` (تتطلب `session.user.role === "ADMIN"`).
- **المدخلات (Query Params):**
  - `search?: string` (بحث في الاسم أو البريد أو اسم المستخدم)
  - `status?: "all" | "active" | "suspended"` (افتراضي: "all")
- **المخرجات (200 OK):**
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "cuid...",
        "email": "user@domain.com",
        "username": "handle",
        "role": "USER",
        "isSuspended": false,
        "createdAt": "2026-11-14T...",
        "displayName": "الاسم الظاهر",
        "linksCount": 3,
        "reportsCount": 0
      }
    ]
  }
  ```
- **حالات الخطأ:**
  - 401 Unauthorized: عند عدم تسجيل الدخول.
  - 403 Forbidden: عند محاولة الوصول من مستخدم ليس `ADMIN`.

### 3.2 `POST /api/admin/users/[id]/suspend`
- **الحماية:** `requireAdminSession()`.
- **المدخلات (Body):**
  ```json
  { "isSuspended": boolean }
  ```
- **القواعد:**
  - منع إيقاف حساب المدير لنفسه (Self-Suspension Guard: يعيد 400 Bad Request).
  - التحقق من وجود المستخدم (يعيد 404 إذا لم يُعثر عليه).
- **المخرجات (200 OK):**
  ```json
  { "success": true, "message": "تم تحديث حالة الحساب بنجاح", "isSuspended": boolean }
  ```

### 3.3 `GET /api/admin/reports`
- **الحماية:** `requireAdminSession()`.
- **المدخلات (Query Params):** `status?: "PENDING" | "RESOLVED" | "DISMISSED"`
- **المخرجات (200 OK):**
  ```json
  { "success": true, "reports": [ { "id": "...", "username": "...", "reason": "...", "details": "...", "status": "PENDING", "createdAt": "..." } ] }
  ```

### 3.4 `PATCH /api/admin/reports/[id]`
- **المسار:** `src/app/api/admin/reports/[id]/route.ts`
- **الحماية:** `requireAdminSession()`.
- **المدخلات (Body):**
  ```json
  { "status": "RESOLVED" | "DISMISSED" }
  ```
- **المخرجات (200 OK):**
  ```json
  { "success": true, "report": { "id": "...", "status": "RESOLVED" } }
  ```

---

## 4. Tasks Breakdown

### Task 1: توسيع مخطط قاعدة البيانات وإنشاء تصاريح NextAuth (Prisma & Types)
- **المسارات:** `prisma/schema.prisma`, `src/types/next-auth.d.ts`
- [ ] إضافة `role String @default("USER")` في نموذج `User` بملف `prisma/schema.prisma`.
- [ ] تنفيذ أمر مزامنة قاعدة البيانات: `npx prisma db push`.
- [ ] تشغيل توليد عميل Prisma: `npx prisma generate`.
- [ ] إنشاء ملف `src/types/next-auth.d.ts` مع توسيع واجهات `Session`, `User`, `JWT` لدعم حقل `role: "ADMIN" | "USER"`.
- [ ] تحديث `tests/unit/db-schema.test.ts` لاختبار وجود وتأكيد حقل `role`.

### Task 2: تحديث منطق المصادقة NextAuth (Auth Server & Handlers)
- **المسارات:** `src/features/auth/server/auth.options.ts`
- [ ] تعديل دالة `authorize` لجلب `user.role` وإرجاعه في كائن المستخدم.
- [ ] تعديل `jwt` callback لتمرير `token.role = (user as unknown as { role: string }).role`.
- [ ] تعديل `session` callback لتعيين `session.user.role = token.role as string`.

### Task 3: إنشاء طبقة ميزات المشغل الإدارية (Admin Feature Module)
- **المسارات:**
  - `src/features/admin/types/admin.types.ts`
  - `src/features/admin/server/admin.guard.ts`
  - `src/features/admin/services/admin.service.ts`
  - `src/features/admin/index.ts`
- [ ] إنشاء `src/features/admin/types/admin.types.ts` بالأنواع المحددة في عقود الـ APIs.
- [ ] إنشاء `src/features/admin/server/admin.guard.ts` مع دالة `requireAdminSession()` التي تفحص الجلسة وصلاحية `ADMIN` وتعيد `NextResponse.json()` المناسب.
- [ ] إنشاء `src/features/admin/services/admin.service.ts` لمعالجة استعلامات المستخدمين، الإيقاف، وجلب وتحديث البلاغات.
- [ ] تصدير الوحدات عبر `src/features/admin/index.ts`.

### Task 4: بناء مسارات واجهات المشغل (Admin API Routes)
- **المسارات:**
  - `src/app/api/admin/users/route.ts`
  - `src/app/api/admin/users/[id]/suspend/route.ts`
  - `src/app/api/admin/reports/route.ts`
  - `src/app/api/admin/reports/[id]/route.ts`
- [ ] إنشاء مسار `GET /api/admin/users` مع دعم الفلترة والبحث.
- [ ] إنشاء مسار `POST /api/admin/users/[id]/suspend` مع حظر إيقاف النفس (Self-Suspension Guard).
- [ ] إنشاء مسار `GET /api/admin/reports` لجلب البلاغات.
- [ ] إنشاء مسار `PATCH /api/admin/reports/[id]` لتحديث حالة البلاغ.

### Task 5: إعداد وتفعيل سكربت بذر قاعدة البيانات (Prisma Seeding Script)
- **المسارات:** `prisma/seed.ts`, `package.json`
- [ ] إنشاء `prisma/seed.ts` بالاستيراد المباشر من `@prisma/client` واستخدام `bcryptjs` لتشفير كلمات المرور.
- [ ] إدراج حساب المدير وحساب العميل بنمط `upsert` لضمان عدم التكرار.
- [ ] تفصيل بيانات حساب العميل:
  - بروفايل كامل بسمة `layanDark` ولون `#4edea3` وخط `Cairo`.
  - 3 روابط فعالة (متجر، يوتيوب، واتساب) ورابط رابع مسودة غير فعال.
  - 4 حسابات اجتماعية موثقة (X, YouTube, GitHub, Instagram).
  - توليد 14 يوماً من إحصاءات الزيارات اليومية (`DailyProfileStat`) والنقرات (`DailyLinkStat`).
- [ ] إضافة تكوين `"prisma": { "seed": "node --experimental-strip-types prisma/seed.ts" }` في `package.json`.
- [ ] تشغيل أمر البذر والتحقق من حفظ البيانات في قاعدة البيانات: `npx prisma db seed`.

### Task 6: كتابة وتشغيل الاختبارات التكاملية (Split into 2 Files < 250 Lines)
- **الملف 1:** `tests/integration/auth-rbac.test.ts` (الحد الأقصى: < 200 سطر)
  - [ ] اختبار مصادقة مدير النظام ببيانات `admin@anlinks.dev` والتأكد من إسناد `role: "ADMIN"`.
  - [ ] اختبار مصادقة العميل ببيانات `client@anlinks.dev` والتأكد من إسناد `role: "USER"`.
  - [ ] اختبار رفض كلمات المرور غير الصحيحة.
  - [ ] اختبار حظر دخول الحساب الموقوف (`isSuspended: true`).
  - [ ] اختبار بوابة حماية المشغل: حظر وصول العميل (403 Forbidden) وسماح المدير (200 OK).
- **الملف 2:** `tests/integration/admin-workflows.test.ts` (الحد الأقصى: < 200 سطر)
  - [ ] اختبار جلب وعرض بروفايل العميل العام وتأكيد إخفاء الروابط المسودة.
  - [ ] اختبار مسار التحويل `/go/[id]` وفلترة الزواحف الآلية.
  - [ ] اختبار قيام المدير بإيقاف حساب العميل والتحقق من إخفاء بروفايله فورياً.
  - [ ] اختبار إرسال بلاغ ضد صفحة مخالفة ثم قيام المدير بمراجعته وتغيير حالته إلى `RESOLVED`.

### Task 7: التحقق الشامل والفحص النهائي (Build & Tests)
- [ ] تشغيل مجموعة الاختبارات بالكامل: `npm test`.
- [ ] تشغيل فحص الإنتاج الشامل: `npm run build`.
- [ ] حفظ التغييرات وعمل Commit موثق ونظيف.
