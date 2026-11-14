# [Architecture Plan v2.0.0] المعمارية الهندسية الشاملة لنظام وتصميم منصة روابط (UI Design System & Screen Architecture)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

## 1. Executive Summary & Core Decisions

### 1.1 Objective
بناء معمارية برمجية وبصرية فائقة المتانة لنظام تصميم منصة **روابط | AN LINKS**، تحقق:
1. **التوافق التام (Pixel-Perfect Parity)** مع كامل شاشات مرجع Stitch (`_1` إلى `_10`، وقوالب `light_mode_1/2/3`، و `layan_dark_arabic_bento`، و `rawabet_luxury_light`).
2. **عمارة مكونات ذرية نقية (Atomic Shared Components)** مع عقود TypeScript محكمة وخالية تماماً من الغموض (Zero-Decision Rule).
3. **محرك ثنائي النمط لحظي (Zero-CLS Dual Theming Engine)** بانتقال فوري بين النمط الليلي الفاخر (`Layan Dark Bento` - `#0f131c`) والمشرق الفاخر (`Rawabet Luxury Light` - `#faf8ff`)، مع دعم 9 سمات إبداعية مخصصة.
4. **مزامنة المعاينة الحية ثنائية الاتجاه (Two-Way Live Sync)** عبر `PreviewContext` المخصص وحفظ تلقائي ذكي (Debounced Auto-Save 500ms) عبر `PATCH /api/profile`.
5. **رسوم بيانية Pure SVG خفيفة الوزن** مدمجة بالكامل دون أي مكتبات خارجية ضخمة.

---

## 2. Detailed Component Contracts (عقود مكونات الطبقة الثانية)

### 2.1 `AppButtonProps` (`src/shared/ui/AppButton.tsx`)
```typescript
export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

### 2.2 `AppInputProps` (`src/shared/ui/AppInput.tsx`)
```typescript
export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}
```

### 2.3 `AppBadgeProps` (`src/shared/ui/AppBadge.tsx`)
```typescript
export interface AppBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "neutral" | "live" | "primary";
  size?: "sm" | "md";
  dot?: boolean;
}
```

### 2.4 `AppCardProps` (`src/shared/ui/AppCard.tsx`)
```typescript
export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "glass";
  glowColor?: "primary" | "secondary" | "none";
}
```

### 2.5 `BentoTileProps` (`src/shared/ui/BentoTile.tsx`)
```typescript
export interface BentoTileProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  glowColor?: "primary" | "secondary" | "tertiary";
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}
```

### 2.6 `FloatingMetricCardProps` (`src/shared/ui/FloatingMetricCard.tsx`)
```typescript
export interface FloatingMetricCardProps {
  title: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  positionClasses: string; // e.g. "-bottom-6 -left-6"
}
```

### 2.7 `ThemePreviewSwatchProps` (`src/shared/ui/ThemePreviewSwatch.tsx`)
```typescript
export interface ThemePreviewSwatchProps {
  themeKey: string;
  nameAr: string;
  primaryColor: string;
  surfaceColor: string;
  accentColor: string;
  isActive: boolean;
  onSelect: (themeKey: string) => void;
}
```

---

## 3. Live Sync Architecture & State Specification (الطبقة الرابعة)

### 3.1 Context & State (`src/features/dashboard/context/PreviewContext.tsx`)
```typescript
export interface PreviewLinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
}

export interface PreviewSocialItem {
  network: string;
  url: string;
  position: number;
}

export interface PreviewState {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  themeKey: string;
  accentColor: string;
  buttonStyle: "filled" | "outline" | "soft" | "shadow";
  borderRadius: "rounded-none" | "rounded-lg" | "rounded-xl" | "rounded-full";
  font: string;
  links: PreviewLinkItem[];
  socials: PreviewSocialItem[];
}
```

### 3.2 Auto-Save Endpoint (`PATCH /api/profile`)
- **المسار:** `src/app/api/profile/route.ts`
- **الحماية:** التحقق من جلسة المستخدم المسجل (`getServerSession`).
- **المدخلات (Body):**
  ```typescript
  export interface UpdateProfileInput {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    themeKey?: string;
    accentColor?: string;
    buttonStyle?: string;
    borderRadius?: string;
    font?: string;
  }
  ```
- **المخرجات (200 OK):** `{ success: true, profile: Profile }`.

### 3.3 تفكيك مجسم الهاتف (`PhoneMockup`) لمنع تجاوز الـ 250 سطراً
يتم تقسيم مكون `PhoneMockup` إلى 4 ملفات مستقلة لا يتجاوز أي منها 150 سطراً:
1. `src/shared/ui/phone/PhoneChassis.tsx`: الهيكل الخارجي، الإطار المعدني، والأزرار الجانبية.
2. `src/shared/ui/phone/PhoneDynamicIsland.tsx`: الجزيرة التفاعلية العلوية ومؤشرات البطارية والشبكة.
3. `src/shared/ui/phone/PhoneScreenContent.tsx`: تصيير شاشة النبذة، الأزرار، والشبكات الاجتماعية بالاعتماد على `PreviewState`.
4. `src/shared/ui/phone/FloatingMetricCards.tsx`: البطاقات العائمة ثلاثية الأبعاد (المبيعات، صحة الروابط، الزيارات).
5. `src/shared/ui/phone/PhoneMockup.tsx`: المجمع الرئيسي (Barrel Wrapper) بحجم < 80 سطراً.

---

## 4. Complete Screen Parity Matrix (خريطة شاشات Stitch الـ 10 + المشغّل)

| المعرف | الشاشة والمسار | المرجع في Stitch | الخصائص والمكونات الأساسية |
|---|---|---|---|
| **SCR-1** | الرئيسية (`/`) | Stitch `_9` | بطل بتوهج سينمائي، حجز فوري للمستخدم، شبكة بنتو، باقات شهرية وسنوية (مكتملة ومحققة 100%). |
| **SCR-2** | استعراض الميزات (`/features`) | Stitch `_10` | تفكيك بنتو الميزات، معمارية الأمان، تحويل التجارة بنقرة واحدة، ومحرك QR الموجه. |
| **SCR-3** | المصادقة (`/login`, `/register`) | Stitch `_3` | تصميم منقسم فخم، بانر إحصائي جانبي، حقول تحقق RTL، وتسجيل سريع عبر Google. |
| **SCR-4** | إدارة الروابط (`/dashboard`) | Stitch `_7` + `light_2` | حارس فحص صحة الروابط (Sentinel)، ترتيب بالسحب والإفلات، ومعاينة حية فورية بالهاتف. |
| **SCR-5** | مخصص المظهر (`/dashboard/appearance`) | Stitch `_2` + `_6` | اختيار بين 9 سمات إبداعية، أنماط أزرار ممتلئة ومحددة، وتحكم في الألوان والخطوط. |
| **SCR-6** | التحليلات (`/dashboard/analytics`) | Stitch `_4` + `light_1` | مخططات Pure SVG بيانية متقدمة، مقارنة الزيارات بالنقرات وCTR، وتوزيع الأجهزة والجغرافيا. |
| **SCR-7** | الأسعار والمقارنة (`/pricing`) | Stitch `_1` + `light_3` | جدول مقارنة الميزات المفصل، مبدل الفوترة (20% خصم)، وتأكيد الضمانات والأسئلة الشائعة. |
| **SCR-8** | الإعدادات (`/dashboard/settings`) | Stitch `_5` + `_8` | إدارة النطاقات المخصصة، الفوترة والاشتراكات، الأمان، وتصدير/حذف البيانات (AUTH-5). |
| **SCR-9** | الصفحة العامة (`/[username]`) | `public_bio_page` | أداء تصيير فائق (SSR)، دعم كامل للـ SEO ومشاركة QR وكشف الزواحف، ونموذج إبلاغ سريع. |
| **SCR-10** | لوحة المشغل (`/admin`) | Stitch `_7` Variant | استعراض وإيقاف الحسابات المخالفة وتصريف البلاغات (ADM-1, ADM-3). |

---

## 5. استراتيجية الاختبارات في بيئة Vitest Node (SSR Testing Strategy)

نظراً لأن المشروع مضبوط على `environment: "node"` لضمان السرعة الفائقة وتوافق التصيير في Next.js 15:
- **اعتماد `renderToStaticMarkup` من `react-dom/server`:**
  - اختبار تصيير كافة مكونات واجهة المستخدم (UI Components) كـ SSR HTML خفيف وسريع بنسبة 100% دون الحاجة إلى `jsdom` أو محاكاة DOM بطيئة.
  - تأكيد وجود فئات Tailwind الأساسية، والخصائص، وعناصر الأيقونات، واتجاه `dir="rtl"`.
- **ملفات الاختبار المخصصة:**
  - `tests/unit/atomic-components.test.ts`: اختبار `AppButton`, `AppInput`, `AppBadge`, `AppCard`, `BentoTile`.
  - `tests/unit/phone-mockup-modular.test.ts`: اختبار تصيير مجسم الهاتف وتفكيكه.

---

## 6. Execution Roadmap (مراحل التنفيذ الخمس)

### 📌 المرحلة 1: بناء مكتبة المكونات المشتركة وتفكيك مجسم الهاتف
- [ ] إنشاء `src/shared/ui/AppButton.tsx` وفق واجهة `AppButtonProps`.
- [ ] إنشاء `src/shared/ui/AppInput.tsx` وفق واجهة `AppInputProps`.
- [ ] إنشاء `src/shared/ui/AppBadge.tsx` وفق واجهة `AppBadgeProps`.
- [ ] إنشاء `src/shared/ui/AppCard.tsx` وفق واجهة `AppCardProps`.
- [ ] إنشاء `src/shared/ui/BentoTile.tsx` وفق واجهة `BentoTileProps`.
- [ ] إنشاء `src/shared/ui/ThemePreviewSwatch.tsx` وفق واجهة `ThemePreviewSwatchProps`.
- [ ] تفكيك مجسم الهاتف إلى المجلد `src/shared/ui/phone/` (`PhoneChassis`, `PhoneDynamicIsland`, `PhoneScreenContent`, `FloatingMetricCards`, `PhoneMockup`).
- [ ] إنشاء `tests/unit/atomic-components.test.ts` و `tests/unit/phone-mockup-modular.test.ts` والتحقق من نجاحها.

### 📌 المرحلة 2: تحديث شاشات المصادقة (`/login` & `/register`) بمطابقة Stitch `_3`
- [ ] إنشاء `src/features/auth/components/AuthSideBanner.tsx` مع الإحصاءات وشعار الثقة.
- [ ] تحديث `src/features/auth/components/LoginForm.tsx` و `RegisterForm.tsx` لاستخدام `AppInput` و `AppButton`.
- [ ] تحديث صفحتي `src/app/(auth)/login/page.tsx` و `register/page.tsx` بالتقسيم المنقسم (Split Layout).

### 📌 المرحلة 3: مخصص المظهر ومحرك المزامنة الحية (`/dashboard/appearance`)
- [ ] إنشاء `src/features/dashboard/context/PreviewContext.tsx` ومزود الحالة `PreviewProvider`.
- [ ] إنشاء مسار `PATCH /api/profile` في `src/app/api/profile/route.ts` مع دعم الحفظ التلقائي.
- [ ] تحديث صفحة `src/app/(dashboard)/dashboard/appearance/page.tsx` بشبكة الـ 9 سمات، وأشكال الأزرار، والخطوط مع الربط الفوري بمجسم الهاتف.

### 📌 المرحلة 4: استكمال شاشات الميزات والتحليلات والمشغّل (`_10`, `/analytics`, `/admin`)
- [ ] تحديث صفحة الميزات `src/app/features/page.tsx` لتطابق Stitch `_10` عبر مكونات `BentoTile`.
- [ ] تحديث لوحة التحليلات `src/app/(dashboard)/dashboard/analytics/page.tsx` بالمنحنيات البيانية عبر Pure SVG بدون مكتبات خارجية.
- [ ] بناء واجهة لوحة المشغل `src/app/(admin)/admin/page.tsx` لعرض قائمة المستخدمين وزر الإيقاف والبلاغات وفق ADM-1 و ADM-3.

### 📌 المرحلة 5: التحقق الشامل وضمان الجودة
- [ ] تشغيل كامل مجموعة الاختبارات (`npm test`) والتأكد من اجتياز كافة الاختبارات بنسبة 100%.
- [ ] تشغيل بناء الإنتاج الشامل (`npm run build`) والتأكد من نجاح تجميع كافة المسارات الـ 17+ دون أخطاء.
- [ ] توثيق التغييرات وعمل Commit نظيف.
