# خطة تنفيذ نظام تخصيص المظهر والهوية المتقدم والمعاينة الحية (EGM / SDD)

* **المشروع:** AN LINKS
* **التاريخ:** 2026-11-24
* **الخاصية:** تخصيص المظهر والهوية (تعديل الألوان المتقدم، رفع الصور الحقيقي، خلفيات مخصصة، أنماط البطاقات، والمعاينة الحية في مجسم الهاتف الذكي)
* **المسار الأساسي:** `src/features/appearance`
* **الحالة:** مسودة معتمدة للتنفيذ الهندسي (EGM Plan)
* **سجل التتبع:** `.superpowers/sdd/2026-11-24-appearance-advanced-customization-and-upload/progress.md`

---

## 1. نظرة عامة والهدف الهندسي

تطوير وترقية نظام **تخصيص المظهر والهوية البصرية** لمنصة AN LINKS لتمكين صناع المحتوى من التحكم الدقيق في كافة الجوانب البصرية لصفحاتهم الحيوية، مع انعكاس فوري (<16ms / 60fps) داخل مجسم الهاتف الذكي الحقيقي `PhoneMockup`، وتشمل التحسينات الأساسية:
1. **رفع الصورة الشخصية (Avatar Upload):** إمكانية رفع صورة حقيقية من الجهاز أو عبر السحب والإفلات، ومعالجتها وحفظها عبر خادم `/api/upload` المعتمد، مع خيار الإزالة الفوري.
2. **نظام ألوان متقدم ومولد تدرجات حر (Advanced Colors & Gradient Builder):** منتقي ألوان دقيق للون التمييز وخلفية الصفحة، ومولد تدرجات لونية ثنائي الألوان بزوايا اتجاه مختلفة (0°-360°).
3. **خلفيات صور مخصصة مع طبقات التعتيم (Custom Background Images with Overlay/Blur):** إمكانية رفع صورة خلفية للصفحة مع التحكم بدرجة الشفافية والتعتيم والضبابية لضمان قراءة النصوص بوضوح.
4. **تخصيص أنماط البطاقات والحاويات (Card Surfaces & Glassmorphism):** خيارات لأنماط البطاقة (مسمط، زجاجي شفاف، إطار مضيء، إطار ناعم).
5. **معايير الجودة:** الصرامة في طول الملفات ($\le 250$ سطراً)، والتعقيم الأمني لمنع حقن CSS أو المسارات الخبيثة، والنجاح التام لكافة اختبارات Vitest وبناء Next.js الإنتاجي.

---

## 2. المهام التنفيذية (Tasks 1 - 6)

### Task 1: ترقية مخطط Prisma ومسار الحفظ والتعقيم الأمني للصور والتدرجات
- **الهدف:** إضافة حقول التخصيص الجديدة لنموذج `Profile`، وتحديث دالة التعقيم الأمني `sanitizer.ts` لدعم مسارات الصور الآمنة `/uploads/*` والتدرجات والتحكم بالتعتيم.
- **الملفات المعنية:**
  - `prisma/schema.prisma`
  - `src/features/appearance/types/appearance.types.ts`
  - `src/features/appearance/utils/sanitizer.ts`
  - `src/app/api/profile/route.ts`
- **التفاصيل:**
  1. في `prisma/schema.prisma`:
     - تحديث خيارات `backgroundType` لتدعم: `"THEME" | "SOLID" | "GRADIENT" | "IMAGE"`.
     - إضافة حقل `cardStyle`: `String @default("glass")` (خيارات: `solid`, `glass`, `glow`, `outline`).
     - إضافة حقل `bgOverlayOpacity`: `Int @default(40)` (نسبة تعتيم خلفية الصورة 0-100%).
  2. مزامنة قاعدة البيانات عبر `npx prisma db push` و `npx prisma generate`.
  3. تحديث `sanitizer.ts` للسماح بمسارات الصور الآمنة (`/uploads/*` و `https://*` بدون أكواد خبيثة) وفحص Hex والتدرجات الآمنة.
  4. تحديث `src/app/api/profile/route.ts` لدعم استقبال وحفظ الحقول الجديدة مع التعقيم.
- **التحقق:**
  - `npx prisma validate` يمر بنجاح.
  - اختبارات تعقيم البيانات في `tests/unit/sanitizer.test.ts`.

---

### Task 2: حقل ومكون رفع الصورة الشخصية المباشر (`AvatarUploadField`)
- **الهدف:** توفير واجهة رفع صور حقيقية تسحب وتفلت أو تفتح نافذة الاختيار، وتتكامل مع `/api/upload` لعرض الصورة فورياً في بطاقة المحرر ومجسم الهاتف.
- **الملفات المعنية:**
  - `src/features/appearance/components/AvatarUploadField.tsx`
  - `src/features/appearance/components/ProfileEditorCard.tsx`
- **التفاصيل:**
  1. إنشاء `AvatarUploadField.tsx`:
     - منطقة سحب وإفلات ودعم لاختيار ملفات الصور (`image/jpeg`, `image/png`, `image/webp`).
     - رفع مباشر عبر `FormData` إلى `/api/upload`.
     - حالة تحميل أثناء الرفع مع معالجة الأخطاء.
     - زر إزالة الصورة لحذف `avatarUrl` والعودة للأيقونة الأبجدية.
     - الاحتفاظ بحقل إدخال الرابط الخارجي (URL) كخيار بديل وسريع.
  2. تضمين المكون داخل `ProfileEditorCard.tsx` مع الحفاظ على صغر حجم الملف ($\le 250$ سطراً).
- **التحقق:**
  - اختبارات محاكاة الرفع وتحديث الحقل في `tests/unit/appearance-avatar-upload.test.tsx`.

---

### Task 3: منتقي الألوان المتقدم ومولد التدرجات اللونية (`AdvancedColorPicker` و `GradientBuilder`)
- **الهدف:** منح المستخدم حرية اختيار أي لون بدقة أو بناء تدرج لوني خاص به بزوايا مختلفة.
- **الملفات المعنية:**
  - `src/features/appearance/components/AdvancedColorPicker.tsx`
  - `src/features/appearance/components/GradientBuilder.tsx`
  - `src/features/appearance/components/BackgroundPicker.tsx`
- **التفاصيل:**
  1. إنشاء `AdvancedColorPicker.tsx`:
     - منتقي ألوان بصري مع إمكانية كتابة كود Hex مباشرة.
     - مصفوفة ألوان شائعة متناسقة ومصممة لواجهات الهواتف الذكية.
  2. إنشاء `GradientBuilder.tsx`:
     - اختيار اللون الأول واللون الثاني.
     - شريط لتحديد زاوية التدرج (0° إلى 360° بخطوات 45°).
     - توليد صيغة CSS الآمنة: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`.
  3. دمج المكونين في `BackgroundPicker.tsx` تحت تبويب الألوان المسمطة والتدرجات المخصصة.
- **التحقق:**
  - فحص توليد التدرجات الصحيحة وتعقيمها.

---

### Task 4: دعم صور الخلفية المخصصة وضبط التعتيم والضبابية
- **الهدف:** تمكين المستخدم من رفع صورة خلفية كاملة لصفحته مع شريط للتحكم بنسبة التعتيم والضبابية لتسهيل القراءة.
- **الملفات المعنية:**
  - `src/features/appearance/components/BackgroundImagePicker.tsx`
  - `src/features/appearance/components/BackgroundPicker.tsx`
  - `src/features/appearance/utils/theme-resolver.ts`
  - `src/shared/ui/phone/PhoneScreenContent.tsx`
  - `src/features/bio/components/BioPageContent.tsx`
- **التفاصيل:**
  1. إنشاء `BackgroundImagePicker.tsx`:
     - رفع صورة الخلفية عبر `/api/upload`.
     - شريط تحكم في نسبة التعتيم الأسود فوق الصورة (0% إلى 80%).
     - خيارات ضبابية الصورة (بدون، خفيفة `blur-sm`، متوسطة `blur-md`).
  2. في `theme-resolver.ts`:
     - دعم `backgroundType === "IMAGE"`.
     - توليد كائن `backgroundStyle` بالصورة والتعتيم والضبابية.
  3. تطبيق النتيجة على `PhoneScreenContent` (مجسم الهاتف) و `BioPageContent` (الصفحة العامة).
- **التحقق:**
  - فحص تطابق المظهر بين مجسم الهاتف والصفحة العامة.

---

### Task 5: تخصيص أنماط البطاقات والحاويات (`CardStylePicker`)
- **الهدف:** تمكين المستخدم من اختيار المظهر العام لبطاقات الروابط وحاوية الملف الشخصي.
- **الملفات المعنية:**
  - `src/features/appearance/components/CardStylePicker.tsx`
  - `src/features/appearance/components/ThemeCustomizer.tsx`
  - `src/features/appearance/utils/theme-resolver.ts`
- **التفاصيل:**
  1. إنشاء `CardStylePicker.tsx`:
     - 4 خيارات بصرية:
       - `glass`: زجاجي شبه شفاف مع تأثير ضبابي (Frosted Glass).
       - `solid`: مسمط معتم تماماً بلون السطح.
       - `glow`: إطار مضيء مشع بلون التمييز.
       - `outline`: إطار خفيف بدون خلفية معتمة.
  2. تحديث `theme-resolver.ts` لعكس `cardStyle` على `cardClass` و `buttonClass`.
  3. ربطه في `ThemeCustomizer.tsx`.
- **التحقق:**
  - فحص تغير مظهر البطاقات في المعاينة الفورية.

---

### Task 6: التحقق الشامل، الاختبارات، وبناء الإنتاج
- **الهدف:** التأكد من خلو المشروع من أي أخطاء وامتثال الكود لجميع المعايير.
- **الملفات والمعايير:**
  - فحص عدد الأسطر: $\le 250$ سطراً لكل ملف.
  - فحص الأنواع الصارم: `npx tsc --noEmit` بصفر أخطاء.
  - حزمة الاختبارات: `npm run test` (نجاح 100%).
  - بناء الإنتاج: `npm run build` بنجاح لكافة المسارات الـ 44.
  - خلو مجسم الهاتف وصفحة `/[username]` من أي بيانات وهمية.

---

## 3. مقاييس النجاح الصارمة (Quality Invariants)

1. **انعكاس فوري 60fps:** أي تعديل في الألوان، الصور، الخلفيات، أو الأنماط ينعكس في مجسم الهاتف في أقل من 16ms دون وميض.
2. **تطابق بنسبة 100%:** مجسم الهاتف في لوحة التحكم يعرض تماماً ما يراه الزائر في `http://localhost:3000/[username]`.
3. **حفظ تلقائي مع Debounce:** الحفظ التلقائي يتم خلال 600ms من التوقف عن التعديل، مع وجود زر حفظ يدوي.
4. **صفر بيانات وهمية:** كافة الصور والبيانات مصدرها الحقيقي من قاعدة البيانات أو ما يرفعه المستخدم.
