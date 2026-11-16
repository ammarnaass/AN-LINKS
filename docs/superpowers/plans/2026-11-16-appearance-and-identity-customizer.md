# خطة تنفيذ نظام تخصيص المظهر والهوية والمعاينة الحية في مجسم الهاتف (Tasks 1-7)

* **المشروع:** AN LINKS
* **التاريخ:** 2026-11-16
* **الحالة:** معتمد للتنفيذ عبر Subagent-Driven Development (SDD)
* **المسار:** `docs/superpowers/plans/2026-11-16-appearance-and-identity-customizer.md`
* **سجل التقدم:** `.superpowers/sdd/2026-11-16-appearance-and-identity-customizer/progress.md`

---

## نظرة عامة والهدف الهندسي
بناء نظام تخصيص المظهر والهوية البصرية المتكامل لمنصة AN LINKS، مع انعكاس بصري فوري 100% (<16ms / 60fps) داخل مجسم الهاتف الذكي الحقيقي، والقضاء الكامل على التباين البصري بين لوحة المحرر والصفحة العامة `/[username]`، وحذف كافة البيانات الوهمية، وإتاحة 12 سمة جاهزة و5 خطوط عربية عبر Next.js Google Fonts وخلفيات وظلال مخصصة مع حماية مشددة من حقن CSS.

---

## المهام التنفيذية (Tasks 1 - 7)

### Task 1: ترقية مخطط Prisma ومسار الحفظ والتعقيم الأمني (`PATCH /api/profile`)
- **الهدف:** إضافة حقول المظهر الجديدة لنموذج `Profile`، وتحديث `route.ts` لدعم قراءة وحفظ وتحديث الحقول مع تعقيم أمني صارم للألوان والتدرجات.
- **الملفات المعنية:**
  - `prisma/schema.prisma`
  - `src/features/bio/types/bio.types.ts`
  - `src/features/appearance/types/appearance.types.ts`
  - `src/app/api/profile/route.ts`
- **التفاصيل الفنية:**
  1. إضافة الحقول إلى `Profile` في `prisma/schema.prisma`:
     - `backgroundType`: `String @default("THEME")`
     - `customBackground`: `String?`
     - `buttonShadow`: `String @default("none")`
     - `socialPosition`: `String @default("top")`
     - تحديث افتراضيات `themeKey` إلى `"layanDark"` و `accentColor` إلى `"#4edea3"`.
  2. تشغيل `npx prisma db push` و `npx prisma generate` و `npx prisma validate`.
  3. تحديث `bio.types.ts` و `appearance.types.ts` لتضمين الحقول الأربعة والرموز المعيارية:
     - `buttonStyle`: `"filled" | "glass" | "soft" | "outline"`
     - `buttonShadow`: `"none" | "soft" | "strong" | "glow"`
     - `borderRadius`: `"rounded-none" | "rounded-md" | "rounded-xl" | "rounded-full"`
     - `font`: `"Cairo" | "Tajawal" | "IBMPlex" | "Almarai" | "ReadexPro"`
     - `backgroundType`: `"THEME" | "SOLID" | "GRADIENT"`
     - `socialPosition`: `"top" | "bottom"`
  4. في `src/app/api/profile/route.ts`:
     - تضمين الحقول الأربعة في مصفوفة السماح `textFields`.
     - تطبيق دالة `sanitizeCustomBackground`: التحقق من خلو النص من `url(`, `expression`, `javascript`, وعلامات الاقتباس، مع السماح بـ Hex (`^#([0-9a-fA-F]{3,8})$`) أو تدرجات CSS آمنة (`linear-gradient(...)` / `radial-gradient(...)`).
     - التحقق من الرموز المسموحة وحظر أي قيم غير صالحة.
     - مزامنة كائن الإنشاء التلقائي ليكون بالقيم الافتراضية الصحيحة.
- **معايير التحقق:**
  - `npx prisma validate` يمر بنجاح.
  - `npx tsc --noEmit` ينتهي بصفر أخطاء.

---

### Task 2: محرك حل السمات وتكوين الخطوط الخمسة وإعدادات Tailwind
- **الهدف:** توحيد الحسابات البصرية في دالة نقية `resolveThemeStyles`، وتحميل الخطوط الخمسة عبر `next/font/google` وضبط فئات Tailwind.
- **الملفات المعنية:**
  - `src/app/layout.tsx`
  - `tailwind.config.ts`
  - `src/features/appearance/constants/themes.ts`
  - `src/features/appearance/utils/theme-resolver.ts`
  - `src/features/appearance/index.ts`
- **التفاصيل الفنية:**
  1. تحديث `src/app/layout.tsx`:
     - استيراد الخطوط الخمسة: `Cairo`, `Tajawal`, `IBM_Plex_Sans_Arabic`, `Almarai`, `Readex_Pro` من `next/font/google`.
     - حقن متغيرات الخطوط: `--font-cairo`, `--font-tajawal`, `--font-plex`, `--font-almarai`, `--font-readex` في فئة الـ body أو html.
     - إزالة وسوم `<link>` الخارجية الزائدة للخطوط.
  2. تحديث `tailwind.config.ts`:
     - تعريف عائلات الخطوط في `fontFamily`:
       - `cairo`: `["var(--font-cairo)", "Cairo", "sans-serif"]`
       - `tajawal`: `["var(--font-tajawal)", "Tajawal", "sans-serif"]`
       - `plex`: `["var(--font-plex)", "'IBM Plex Sans Arabic'", "sans-serif"]`
       - `almarai`: `["var(--font-almarai)", "Almarai", "sans-serif"]`
       - `readex`: `["var(--font-readex)", "'Readex Pro'", "sans-serif"]`
  3. تحديث `src/features/appearance/constants/themes.ts`:
     - توسيع قائمة السمات `THEMES` إلى 12 سمة متكاملة عربية (مثل: ليان الداكن، روابط الفاخر، نيون الزمرد، بنفسج نيون، أزرق محيطي، غروب ناري، رمال نجد، رمادي راقٍ، وردي ناعم، سايبر داكن، شروق منعش، أبيض نقي).
     - إضافة حقل `surfaceColor` الصريح لكل سمة داخل `ThemeConfig`.
     - تحديث قاموس `FONTS` لربط كل خط بفئة Tailwind المناسبة (`font-cairo`, `font-tajawal`, `font-plex`, `font-almarai`, `font-readex`).
     - تحديث قاموس `BUTTON_STYLES` و `BUTTON_SHADOWS`.
  4. إنشاء `src/features/appearance/utils/theme-resolver.ts`:
     - دالة نقية `resolveThemeStyles(profile)` تقوم بحساب كلاسات وأنماط الخلفية، البطاقات، الأزرار، الظلال، وألوان النصوص والأيقونات، مع معالجة الخلفيات المخصصة والرجوع الآمن عند غياب السمة.
- **معايير التحقق:**
  - `npx tsc --noEmit` ينتهي بصفر أخطاء.

---

### Task 3: ترقية مجسم الهاتف الذكي وسياق المعاينة بدون بيانات وهمية
- **الهدف:** جعل مجسم الهاتف يعكس خيارات المظهر لحظياً 60fps في الذاكرة دون وميض، وإزالة كافة البيانات الوهمية نهائياً.
- **الملفات المعنية:**
  - `src/shared/ui/phone/PhoneScreenContent.tsx`
  - `src/shared/ui/phone/PhoneMockup.tsx`
  - `src/shared/ui/phone/PhoneChassis.tsx`
  - `src/features/dashboard/context/PreviewContext.tsx`
  - `tests/unit/phone-mockup-modular.test.ts`
- **التفاصيل الفنية:**
  1. في `PhoneScreenContent.tsx`:
     - حذف الثوابت الوهمية: `DEFAULT_LINKS`, `DEFAULT_SOCIALS`، واسم "فيصل الشمري"، وصورة Unsplash.
     - استبدال الصورة البديلة بدائرة أنيقة تعرض الحرف الأول من اسم المستخدم عند غياب الصورة (`avatarUrl`).
     - عرض رسالة فراغ لطيفة ("لا توجد روابط منشورة حالياً") عند خلو الروابط مطابقة لـ `BioPageContent.tsx`.
     - تطبيق `resolveThemeStyles` على خلفية الشاشة وكامل مساحتها الداخلية، وعلى الأزرار وظلالها والخط المختار.
     - ترتيب شريط أيقونات التواصل بحسب `socialPosition` (أعلى الروابط أو أسفلها).
  2. في `PhoneChassis.tsx` و `PhoneMockup.tsx`:
     - السماح لـ `PhoneScreenContent` بتغطية مساحة الشاشة بالكامل دون اقتطاع أو عزل خلفية السمة.
  3. في `PreviewContext.tsx`:
     - توسيع `PreviewState` و `DEFAULT_PREVIEW` لدعم الحقول الجديدة بالكامل بدون `any`.
     - إضافة خاصية `isLoaded: boolean` (تبدأ بـ false وتصبح true فور انتهاء استدعاء جلب الملف الشخصي).
  4. في `tests/unit/phone-mockup-modular.test.ts`:
     - تحديث نصوص التوكيد لتعكس حذف الثوابت الوهمية دون كسر الاختبار القائم.
- **معايير التحقق:**
  - اختبار `phone-mockup-modular.test.ts` ينجح 100%.
  - `npx tsc --noEmit` ينتهي بصفر أخطاء.

---

### Task 4: ترقية مكونات محرر المظهر وصفحة التخصيص (`/dashboard/appearance`)
- **الهدف:** توفير واجهة مستخدم متناسقة وقوية في لوحة التحكم للتحكم بكافة عناصر الهوية، مع حفظ تلقائي هادئ وحفظ يدوي مؤكد.
- **الملفات المعنية:**
  - `src/features/appearance/components/ProfileEditorCard.tsx`
  - `src/features/appearance/components/ThemePresetsGrid.tsx`
  - `src/features/appearance/components/ButtonAndRadiusPicker.tsx`
  - `src/features/appearance/components/FontPicker.tsx`
  - `src/features/appearance/components/BackgroundPicker.tsx` (جديد)
  - `src/features/appearance/components/ThemeCustomizer.tsx`
  - `src/app/(dashboard)/dashboard/appearance/page.tsx`
- **التفاصيل الفنية:**
  1. ترقية `ProfileEditorCard.tsx`: إزالة Fallback الـ Unsplash، واستخدام دائرة الحرف الأول.
  2. ترقية `ThemePresetsGrid.tsx`: استخدام `theme.surfaceColor` وعرض السمات الـ 12 مع شارة السمة النشطة ومجموعات التصنيف.
  3. ترقية `ButtonAndRadiusPicker.tsx`: إتاحة الأنماط الأربعة (`filled`, `glass`, `soft`, `outline`) والاستدارات الأربع، وإضافة أداة اختيار الظل `buttonShadow` (`none`, `soft`, `strong`, `glow`).
  4. ترقية `FontPicker.tsx`: عرض الخطوط الخمسة بأسمائها وبأشكال خطوطها الحقيقية.
  5. إنشاء `BackgroundPicker.tsx`: واجهة سلسة للتبديل بين (خلفية السمة الافتراضية، لون مسمط Hex Color Picker مع خيارات سريعة، وتدرجات لونية عصرية جاهزة).
  6. إضافة محدد موضع شبكات التواصل (`socialPosition`: أعلى / أسفل الروابط).
  7. في `src/app/(dashboard)/dashboard/appearance/page.tsx`:
     - فحص `isLoaded` من `usePreview()` لمنع انطلاق الحفظ التلقائي قبل اكتمال جلب البيانات.
     - تطبيق `AbortController` لإلغاء طلبات الحفظ السابقة عند تسارع التعديلات.
     - إلغاء مؤقت الـ debounce عند النقر المباشر على زر "حفظ التغييرات".
     - إضافة زر تبديل لمعاينة مجسم الهاتف في الشاشات الصغيرة (<1024px).
- **معايير التحقق:**
  - `npx tsc --noEmit` ينتهي بصفر أخطاء.

---

### Task 5: توحيد المظهر مع الصفحة العامة للزوار (`/[username]`)
- **الهدف:** ضمان التطابق البصري بنسبة 100% بين ما يظهر في مجسم الهاتف وما يراه الزائر على الصفحة العامة الحقيقية.
- **الملفات المعنية:**
  - `src/features/bio/components/BioPageContent.tsx`
  - `src/features/bio/components/ProfileCard.tsx`
  - `src/features/bio/components/LinkButton.tsx`
- **التفاصيل الفنية:**
  1. في `BioPageContent.tsx`:
     - استدعاء `resolveThemeStyles` لتطبيق نفس الخلفية، فئات الخطوط، وظلال وألوان الأزرار.
     - تمرير كائن الأنماط المحسوب إلى `ProfileCard` و `LinkButton`.
     - ترتيب موضع شبكات التواصل وفق `profile.socialPosition`.
  2. في `LinkButton.tsx`:
     - تطبيق نمط الزر، وظل الزر، واستدارة الحواف المحسوبة بدقة.
     - معالجة الحواف لضمان عدم وجود أخطاء طباعية أو قيم `undefined`.
- **معايير التحقق:**
  - `npx tsc --noEmit` ينتهي بصفر أخطاء.

---

### Task 6: اختبارات الوحدة والتكامل للمظهر والمعاينة الحية
- **الهدف:** بناء شبكة أمان واختبارات شاملة تؤكد صحة المنظومة بنسبة 100%.
- **الملفات المعنية:**
  - `tests/unit/theme-resolver.test.ts` (جديد)
  - `tests/unit/phone-mockup-reflection.test.tsx` (جديد باستخدام `renderToStaticMarkup`)
  - `tests/integration/appearance-api.test.ts` (جديد لاختبار الـ API والتعقيم)
  - `tests/integration/appearance.test.ts` (تحديث وتوسيع)
- **التفاصيل الفنية:**
  1. `tests/unit/theme-resolver.test.ts`:
     - اختبار حل السمات الـ 12.
     - اختبار أنماط الأزرار والظلال.
     - اختبار تطبيق الخلفيات المخصصة (Hex و Gradients) والرجوع الآمن (Fallback) للسمة الأصلية عند تعذر القيمة.
  2. `tests/unit/phone-mockup-reflection.test.tsx`:
     - استخدام `renderToStaticMarkup` لاختبار تصيير `PhoneScreenContent` و `PhoneMockup`.
     - التحقق من تطبيق فئة الخط، وألوان السمة، ونمط الزر، وانعكاس اسم المستخدم الحقيقي بدون بيانات وهمية.
  3. `tests/integration/appearance-api.test.ts`:
     - اختبار مسار `PATCH /api/profile` مع حفظ الحقول الجديدة (`backgroundType`, `customBackground`, `buttonShadow`, `socialPosition`).
     - اختبار رفض وتعقيم الأنماط الخبيثة وحظر روابط `url(...)`.
- **معايير التحقق:**
  - `npm run test` يمر بنسبة 100% (أكثر من 50 ملف اختبار و 420+ اختباراً ناجحاً).

---

### Task 7: التحقق الشامل وبناء بيئة الإنتاج (Full Project Verification & Build)
- **الهدف:** التأكد من سلامة النظام وجودة بيئة الإنتاج وخلوها التام من أي أخطاء أو انكسارات.
- **الإجراءات:**
  1. `npx prisma validate`
  2. `npx tsc --noEmit`
  3. `npm run test`
  4. `npm run build`
- **معايير التحقق:**
  - نجاح بناء Next.js 15 الإنتاجي لجميع المسارات الـ 39+ دون أي تحذير حرج أو خطأ نمطي.

