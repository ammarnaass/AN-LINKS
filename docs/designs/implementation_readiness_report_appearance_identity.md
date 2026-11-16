# تقرير تجميع مراجعات الجاهزية للتنفيذ: نظام تخصيص المظهر والهوية (Appearance & Visual Identity System)

* **المشروع:** AN LINKS
* **التاريخ:** 2026-11-16
* **الحالة:** معتمد وجاهز للتنفيذ بعد المعالجة (Synthesized & Approved for Execution)
* **المراجعون (Goldfish Reviewers):**
  1. `egm-style` (محرر الأسلوب والمصطلحات والاتساق البصري)
  2. `egm-implementation-readiness` (قائد الفريق التقني ومعايير الجاهزية والصلابة)
  3. `egm-codebase-details` (مدقق مطابقة الكود والمكتبات وجودة التنفيذ)

---

## 1. ملخص تنفيذي (Executive Summary)

تم إخضاع وثيقة التصميم الفني [appearance-and-identity-customizer.md](file:///home/ammar/AN%20LINKS/docs/designs/appearance-and-identity-customizer.md) لتدقيق متزامن ثلاثي المحاور. أجمع المراجعون على قوة المعمارية المقترحة المبنية على محرك الدالة النقية `resolveThemeStyles` والفصل بين المعاينة اللحظية في الذاكرة (60fps / <16ms) والحفظ الشبكي المتأني (Debounced 600ms).

تم تحديد **4 ملاحظات حرجة (Blockers)** و **5 ملاحظات جوهرية (Majors)**، وتم وضع حلول هندسية قطعية لكل منها وتم دمجها مباشرة في وثيقة التصميم وخطة التنفيذ.

---

## 2. مصفوفة تجميع الملاحظات والمعالجات الفنية

| المعرف | التصنيف | الوصف والتعارض المكتشف | الحل الهندسي المعتمد في التصميم والخطة |
| :--- | :--- | :--- | :--- |
| **BLK-01** | حرج (Blocker) | **تحميل الخطوط وإعدادات Tailwind:** القرار 1 اعتمد تحميل الخطوط الخمسة (`Cairo`, `Tajawal`, `IBMPlex`, `Almarai`, `ReadexPro`) عبر `next/font/google`، إلا أن `layout.tsx` لا زال يستخدم `<link>` لخطين فقط، و `tailwind.config.ts` يفتقر لـ 3 خطوط، وقاموس `FONTS` في `themes.ts` يربط الخطوط بـ `font-sans`. | إدراج مهمة صريحة في **Task 2**: تحديث `src/app/layout.tsx` لتحميل الخطوط الخمسة عبر `next/font/google` وحقن CSS variables، وتحديث `tailwind.config.ts` بـ 5 أصناف خطوط، وتصحيح قاموس `FONTS` كاملاً. |
| **BLK-02** | حرج (Blocker) | **إسقاط حقول المظهر في `PATCH /api/profile`:** المسار يحصر الحقول المسموحة في مصفوفة صلبة قديمة ويسقط الحقول الأربعة الجديدة (`backgroundType`, `customBackground`, `buttonShadow`, `socialPosition`). | تحديث **Task 1**: توسيع `schema.prisma` بـ 4 حقول، وتحديث `src/app/api/profile/route.ts` مع فلترة دقيقة، وتحديث دالتي الحفظ التلقائي واليدوي في `page.tsx` لإرسال واستقبال كافة الحقول. |
| **BLK-03** | حرج (Blocker) | **أمان حقن CSS في `customBackground`:** إمكانية تسريب التوكنز أو حقن أنماط ضارة إذا سُمح بروابط خارجية مثل `url(...)`. | تطبيق معالج تعقيم (CSS Sanitizer) صارم في `route.ts` يسمح فقط بـ Hex (`^#([0-9a-fA-F]{3,8})$`) أو تدرجات لونية آمنة خالية تماماً من `url`, `javascript`, `expression` أو علامات التنصيص. |
| **BLK-04** | حرج (Blocker) | **تعارض الرموز (Token Collisions):** تداخل بين `buttonStyle` و `buttonShadow` في واجهات Typescript و Prisma. | توحيد الرموز المعيارية: <br/>• `buttonStyle`: `filled \| glass \| soft \| outline`<br/>• `buttonShadow`: `none \| soft \| strong \| glow`<br/>• `borderRadius`: `rounded-none \| rounded-md \| rounded-xl \| rounded-full`<br/>• `font`: `Cairo \| Tajawal \| IBMPlex \| Almarai \| ReadexPro`<br/>• `backgroundType`: `THEME \| SOLID \| GRADIENT`<br/>• `socialPosition`: `top \| bottom` |
| **MAJ-01** | جوهري (Major) | **انتهاك معيار منع البيانات الوهمية (Zero Fake/Mock Data):** وجود `DEFAULT_LINKS` و `DEFAULT_SOCIALS` وأسماء وصور Unsplash وهمية في `PhoneScreenContent.tsx` و `ProfileEditorCard.tsx`. | تنظيف `PhoneScreenContent.tsx` من كافة الثوابت الوهمية في **Task 3**، وعرض الحرف البديل (Avatar Initial) والحالة الفارغة المتطابقة تماماً مع `BioPageContent.tsx`. |
| **MAJ-02** | جوهري (Major) | **تزامن وسياق المعاينة `PreviewContext`:** عدم وجود مؤشر جاهزية `isLoaded` مما يسبب إطلاق حفظ تلقائي بالقيم الافتراضية قبل اكتمال جلب البيانات من الخادم، وعدم إلغاء الطلبات المتزامنة. | إضافة `isLoaded: boolean` إلى `PreviewContext` لمنع أي حفظ قبل التحميل، واستخدام `AbortController` في `AppearancePage.tsx` وإلغاء مؤقت الـ debounce عند الضغط على الحفظ اليدوي. |
| **MAJ-03** | جوهري (Major) | **تأكيد بيئة اختبارات المكونات (Testing Environment):** ملفات `.test.tsx` يجب أن تتوافق مع بيئة Vitest `node`. | اعتماد نموذج `renderToStaticMarkup` المتوافق تماماً مع بيئة Node في اختبار مجسم الهاتف، واختبارات الدوال النقية لـ `theme-resolver.test.ts`. |
| **MAJ-04** | جوهري (Major) | **حاوية الشاسيه `PhoneChassis.tsx`:** عزل كلاس الخلفية في الشاسيه يمنع تمدد خلفيات السمات والتدرجات. | جعل `PhoneScreenContent` تمتد بنسبة 100% داخل الشاسيه وتمرير نمط وخلفية السمة للحاوية المستهدفة لمنع أي حواف غير متناسقة. |
| **MAJ-05** | جوهري (Major) | **مكون اختيار الخلفية المستقل:** غياب واجهة واضحة للاختيار بين خلفية السمة التلقائية أو اللون المخصص. | بناء مكون `BackgroundPicker.tsx` في **Task 4** يتيح التبديل السلس بين خلفية السمة الأصلية، ولون مسمط (Solid Hex)، وتدرج لوني جاهز (Safe Gradients). |

---

## 3. القرار النهائي

تم اعتماد التعديلات وتحديث وثيقة التصميم التقني [docs/designs/appearance-and-identity-customizer.md](file:///home/ammar/AN%20LINKS/docs/designs/appearance-and-identity-customizer.md) والانتقال فوراً لصياغة خطة التنفيذ المفصلة وسجل مهام SDD (Tasks 1-7).

