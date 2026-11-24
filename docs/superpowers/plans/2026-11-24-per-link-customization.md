# خطة تنفيذ نظام التخصيص البصري المتقدم لكل رابط (Per-Link Customization Implementation Plan)

* **الميزة:** تخصيص الروابط الفردي (صورة مصغرة، لون الخلفية والنص، لون وسماكة الإطار، ونمط الظل)
* **المسار الأساسي:** `src/features/links` و `src/shared/ui/phone` و `src/features/bio`
* **التاريخ:** 2026-11-24
* **المنهجية:** Elephant-Goldfish Model (EGM) + Subagent-Driven Development (SDD)

---

## 1. الأهداف ونطاق العمل
1. تمكين المستخدم في قائمة الروابط من تخصيص كل رابط على حدة:
   - صورة مصغرة (Thumbnail) تُرفع من الجهاز عبر `/api/upload` أو رابط خارجي.
   - لون خلفية مخصص ولون نص مخصص.
   - لون إطار مخصص (Border Color).
   - نمط ظل مخصص (بدون، ناعم، قوي، نيون متوهج Glow).
   - زر استعادة مظهر السمة الافتراضية بنقرة واحدة (Reset to Theme).
2. انعكاس فوري (<16ms) في مجسم الهاتف الذكي `PhoneMockup`.
3. تطابق بصري كامل 100% في صفحة البايو العامة `/[username]`.
4. الالتزام الصارم بمعيار $\le 250$ سطراً لكل ملف نمطي.

---

## 2. المهام التفصيلية

### Task 1: ترقية مخطط Prisma ومسارات الـ API للروابط
- إضافة حقول `thumbnailUrl`, `customBgColor`, `customTextColor`, `customBorderColor`, `customShadow` في `prisma/schema.prisma`.
- تحديث قاعدة البيانات: `npx prisma db push && npx prisma generate`.
- تحديث أنواع TypeScript في `src/features/links/types/links.types.ts` و `src/features/bio/types/bio.types.ts`.
- تحديث `GET` و `POST` و `PUT` في `src/app/api/links/route.ts` و `PATCH` في `src/app/api/links/[id]/route.ts`.
- اختبارات الوحدة: `tests/unit/link-customization-api.test.ts`.

### Task 2: إنشاء مكون التخصيص البصري للرابط (`LinkAppearanceCustomizer.tsx`)
- إنشاء `src/features/links/components/LinkAppearanceCustomizer.tsx` ($\le 250$ سطر).
- رفع صورة مصغرة عبر `/api/upload` مع معاينة وحذف فوري.
- منتقي لوني للخلفية والنص والإطار مع تعقيم CSS.
- اختيار نمط الظل (none, soft, strong, glow) وزر استعادة السمة الافتراضية.
- اختبارات الوحدة: `tests/unit/link-appearance-customizer.test.tsx`.

### Task 3: دمج المكون في محرر الروابط (`LinkCardItem.tsx`)
- إضافة زر "تخصيص المظهر" كأكورديون منسدل في `LinkCardItem.tsx`.
- المحافظة على حجم `LinkCardItem.tsx` $\le 250$ سطراً.
- ربط التحديث مع `onUpdate`.

### Task 4: الانعكاس الفوري في مجسم الهاتف والصفحة العامة
- تحديث `src/shared/ui/phone/PhoneScreenContent.tsx` لعرض الصورة المصغرة والتخصيصات.
- تحديث `src/features/bio/components/LinkButton.tsx` لعرض الصورة المصغرة والتخصيصات.
- اختبارات الوحدة: `tests/unit/link-preview-reflection.test.tsx`.

### Task 5: التحقق الشامل، الاختبارات، وبناء الإنتاج
- فحص عدد أسطر كافة الملفات المعدلة ($\le 250$ سطراً).
- تشغيل `npm run test` (100% نجاح).
- تشغيل `npx tsc --noEmit` (صفر أخطاء).
- تشغيل `npm run build` (نجاح لكافة المسارات الـ 44).
- فحص مباشر على `http://localhost:3000/dashboard` و `http://localhost:3000/fathi`.
