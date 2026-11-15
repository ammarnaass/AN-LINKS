# خطة تنفيذ نظام إدارة الروابط والمنصات (Links & Platforms Manager Plan)

* **التاريخ:** 2026-11-15
* **الحالة:** جاهزة للتنفيذ (Ready for SDD Execution)
* **الوثيقة المرجعية:** [`docs/designs/links-and-platforms-manager.md`](file:///home/ammar/AN%20LINKS/docs/designs/links-and-platforms-manager.md)
* **المبادئ الصارمة:**
  1. بيانات حقيقية 100% مسترجعة من PostgreSQL (ممنوع أي بيانات وهمية أو محاكاة).
  2. الحفاظ على معيار الكود الموجه (ملفات أقل من 250 سطراً، ودوال مركزة أقل من 40 سطراً).
  3. تنفيذ كل مهمة عبر نمط الوكيلين المتخصصين (Implementer + Reviewer).
  4. ضمان استمرار نجاح كافة اختبارات المشروع السابقة وبناء Next.js 15 الإنتاجي.

---

## Task 1: توسيع مخطط Prisma وبذور المنصات المعتمدة (Schema Expansion & Seed Data)

### 1. الهدف والملفات المتأثرة
- **الملفات:**
  - `prisma/schema.prisma`
  - `prisma/seed-platforms.ts` (جديد)
  - `prisma/seed.ts`
- **التفاصيل:**
  1. إضافة `enum PlatformCategory`: `SOCIAL`, `VIDEO`, `MESSAGING`, `COMMERCE`, `DEV`, `MUSIC`, `PROFESSIONAL`, `CUSTOM`.
  2. إضافة نموذج `model Platform` بجميع حقوله وفهارسه وعلاقاته مع `Link`, `SocialLink`, `LinkClick`.
  3. تحديث `model Link`: إضافة `platformId String?`, `clicksCount Int @default(0)`, `isPinned Boolean @default(false)`, `isArchived Boolean @default(false)` مع الفهارس المناسبة.
  4. تحديث `model SocialLink`: إضافة `platformId String?` مع العلاقة المعاكسة وفهرس `@@index([platformId])`.
  5. تحديث `model LinkClick`: إضافة `platformId String?` مع علاقة `Platform` وفهارس `@@index([platformId, createdAt])`, `@@index([device])`, `@@index([country])`.
  6. إنشاء `prisma/seed-platforms.ts` وتصدير دالة `seedPlatforms(prisma: PrismaClient)` تحوي بيانات العشرين منصة المعتمدة.
  7. استدعاء `seedPlatforms(prisma)` في `prisma/seed.ts`.
- **معايير التحقق (Verification):**
  - `npx prisma validate`
  - `npm run seed`
  - `npx tsc --noEmit`

---

## Task 2: محرك الكشف الخوارزمي النقي والخدمات الخلفية وعقود الواجهات (Detector, Services & APIs)

### 1. الهدف والملفات المتأثرة
- **الملفات:**
  - `src/features/links/services/platform-detector.ts` (جديد - Pure Isomorphic)
  - `src/shared/utils/device-detector.ts` (جديد - Zero Dependency UA Parser)
  - `src/features/admin/server/admin-links.service.ts` (جديد)
  - `src/features/links/types/links.types.ts`
  - `src/app/api/platforms/route.ts` (جديد - GET نشط)
  - `src/app/api/admin/platforms/route.ts` (جديد - GET, POST)
  - `src/app/api/admin/platforms/[id]/route.ts` (جديد - PATCH, DELETE)
  - `src/app/api/admin/links/route.ts` (جديد - GET مفلتر)
  - `src/app/api/admin/links/[id]/route.ts` (جديد - PATCH تحديث الحالة)
  - `src/app/api/admin/links/analytics/route.ts` (جديد - GET إحصائيات حقيقية)
  - `src/app/api/links/route.ts` (تحديث لدعم platformId, isPinned, isArchived, clicksCount)
- **التفاصيل:**
  1. `platform-detector.ts`: مطابقة النطاقات الآمنة باستخدام `new URL(url).hostname` و `.endsWith()` مع دعم مصفوفة قواعد افتراضية مدمجة أو مصفوفة منصات ممررة كمعامل، دون أي استيراد لقاعدة البيانات.
  2. `device-detector.ts`: استخراج `device`, `os`, `browser` بدقة وتعيين `"UNKNOWN"` أو `"Other"` كبدائل افتراضية.
  3. `admin-links.service.ts`: استعلامات حقيقية من PostgreSQL لجلب الروابط وتحديثها وتجميع إحصائيات المنصات والأجهزة والدول.
  4. حماية جميع مسارات `/api/admin/*` بواسطة `requireAdminSession()`.
  5. تحديث `src/app/api/links/route.ts` لاستخدام `clicksCount` المباشر وحفظ `platformId`.
- **معايير التحقق (Verification):**
  - `npx tsc --noEmit`

---

## Task 3: ترقية محرك التحويل وتتبع النقرات الفعلي (`/go/[id]`)

### 1. الهدف والملفات المتأثرة
- **الملفات:**
  - `src/features/analytics/services/tracking.service.ts`
  - `src/app/go/[id]/route.ts`
- **التفاصيل:**
  1. قراءة الدولة من ترويسات `cf-ipcountry` أو `x-vercel-ip-country` مع استبعاد القيمة `"XX"`.
  2. استخدام `device-detector.ts` لتحليل User-Agent.
  3. تجميع عمليات الكتابة في استدعاء ذري موحد `prisma.$transaction([LinkClick.create, Link.update(+1), DailyLinkStat.upsert])`.
  4. في `/go/[id]/route.ts`: فصل تسجيل التتبع بحيث لا يعطل فشل التسجيل إصدار كود التحويل 302، واستمرار تحويل روابط صناع المحتوى حتى وإن كانت المنصة معطلة في الكتالوج.
- **معايير التحقق (Verification):**
  - `npx tsc --noEmit`

---

## Task 4: ترقية محرر الروابط وتنظيف البيانات الوهمية (Creator Studio & Zero-Mock Cleanup)

### 1. الهدف والملفات المتأثرة
- **الملفات:**
  - `src/shared/ui/SocialIcons.tsx`
  - `src/features/links/components/AddLinkForm.tsx`
  - `src/features/links/components/LinkCardItem.tsx`
  - `src/features/links/components/LinkHealthBanner.tsx`
  - `src/features/links/components/SocialLinksEditor.tsx`
  - `src/features/bio/components/ProfileCard.tsx`
- **التفاصيل:**
  1. `SocialIcons.tsx`: توفير أيقونات SVG للمنصات العشرين المدعومة وتعيين `GenericLinkIcon` كبديل احتياطي آمن بدلاً من `other`.
  2. `AddLinkForm.tsx`: دمج `detectPlatform` لعرض هوية المنصة (الاسم، الشعار، واللون) لحظياً عند كتابة الرابط وتمرير `platformId` عند الحفظ.
  3. `LinkCardItem.tsx`: إزالة الشارة الوهمية `200 OK • سليم (72ms)` وعرض شارة المنصة الرسمية ولونها وعداد النقرات الفعلي.
  4. `LinkHealthBanner.tsx`: إعادة صياغته ليعرض إحصائيات حقيقية من الروابط الموجودة (الروابط النشطة، إجمالي النقرات) وإزالة العبارات الوهمية "فحص كل 5 دقائق".
  5. `SocialLinksEditor.tsx`: استهلاك المنصات من `/api/platforms` وتعيين المنصات النشطة.
  6. `ProfileCard.tsx`: تنظيف الأرقام الوهمية الثابتة.
- **معايير التحقق (Verification):**
  - `npx tsc --noEmit`

---

## Task 5: بناء تبويب إدارة الروابط والمنصات في لوحة المشرف (Admin Console Links Tab)

### 1. الهدف والملفات المتأثرة
- **الملفات:**
  - `src/features/admin/types/admin.types.ts`
  - `src/features/admin/components/AdminNavTabs.tsx`
  - `src/features/admin/components/AdminSidebar.tsx`
  - `src/features/admin/hooks/useAdminConsole.ts`
  - `src/app/(admin)/admin/page.tsx`
  - `src/features/admin/components/links/AdminLinksContainer.tsx` (جديد)
  - `src/features/admin/components/links/PlatformsCatalogSubTab.tsx` (جديد)
  - `src/features/admin/components/links/LinksModerationSubTab.tsx` (جديد)
  - `src/features/admin/components/links/PlatformAnalyticsSubTab.tsx` (جديد)
  - `src/features/admin/index.ts`
- **التفاصيل:**
  1. إضافة `"links"` إلى `AdminTabKey` وتحديث `TAB_TITLES` في `page.tsx`.
  2. إضافة التبويب في `AdminNavTabs.tsx` و `AdminSidebar.tsx` مع شارة عدد الروابط.
  3. بناء المكونات الثلاثة: دليل المنصات (إضافة/تعديل/تفعيل)، الإشراف على الروابط ومراجعتها (جدول، بحث، تعطيل)، وتحليلات المنصات (توزيع النقرات حسب المنصة والأجهزة والدول).
  4. ربط المكونات داخل `src/app/(admin)/admin/page.tsx` وإعادة التصدير من `index.ts`.
- **معايير التحقق (Verification):**
  - `npx tsc --noEmit`

---

## Task 6: اختبارات الوحدة والتكامل (Comprehensive Automated Test Suites)

### 1. الهدف والملفات المتأثرة
- **الملفات:**
  - `tests/unit/platform-detector.test.ts` (جديد)
  - `tests/unit/device-detector.test.ts` (جديد)
  - `tests/unit/admin-links-service.test.ts` (جديد)
  - `tests/integration/link-tracking.test.ts` (جديد)
  - `tests/unit/admin-links-ui.test.tsx` (جديد - عبر renderToStaticMarkup)
- **التفاصيل:**
  1. اختبار كشف الروابط للمنصات العشرين وحالات الروابط المخصصة والروابط المعطوبة.
  2. اختبار كشف الأجهزة والأنظمة والمتصفحات وقيم Fallback.
  3. اختبار دوال خدمة المشرف والتأكد من صحة الاستعلامات الحقيقية.
  4. اختبار مسار التحويل الذري وتسجيل النقرات وتحديث العدادات.
  5. اختبار تصيير واجهات التبويب الفرعية لمكونات إدارة الروابط والمنصات.
- **معايير التحقق (Verification):**
  - `npm run test` (كل الاختبارات الجديدة والقديمة تنجح بنسبة 100%)

---

## Task 7: التحقق الشامل وضمان جودة الإنتاج (Full Project Verification & Build)

### 1. الهدف
- فحص كامل للمشروع والتأكد من جاهزيته للإنتاج:
  - `npx prisma validate`
  - `npm run seed`
  - `npx tsc --noEmit` (0 أخطاء)
  - `npm run test` (100% نجاح لكافة الاختبارات)
  - `npm run build` (Next.js 15 production build ينجح لجميع المسارات)

