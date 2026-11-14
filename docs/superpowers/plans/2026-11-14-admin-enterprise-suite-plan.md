# [Architecture Plan v3.1.0] المعمارية الشاملة للوحة تحكم المشرف وإدارة النظام (Admin Enterprise Suite)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** بناء وتطوير لوحة تحكم متكاملة واحترافية للمشرف (Admin Enterprise Suite) تشمل 5 قطاعات حيوية: إحصائيات المنصة والإيرادات، إدارة المستخدمين والترقيات، بوابات الدفع والاشتراكات، إعدادات النظام ووضع الصيانة، وإدارة البلاغات والاعتدال.

**Architecture:** بنية معمارية معيارية (Modular Domain Architecture) مقسمة إلى مكونات مستقلة لا يتجاوز أي منها 250 سطراً، تتصل بخدمات خادم محكمة (`admin.service.ts` و `admin.defaults.ts`) ومحمية بحارس `admin.guard.ts` والجلسات الحية، مع مخططات Pure SVG خفيفة ومخزن إعدادات معياري لحظي (Stateful Configuration Store).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, NextAuth v4, Prisma ORM, PostgreSQL, Tailwind CSS, Lucide Icons, Pure SVG Curves, Vitest.

---

## 1. Global Constraints (المعايير الهندسية الصارمة)
- **حد حجم الملفات:** كل ملف يجب أن يكون أقل من 250 سطراً (الهدف < 180 سطراً).
- **حد الدوال:** كل دالة أقل من 40 سطراً وبمسؤولية واحدة واضحة.
- **التوافق التام:** اتجاه `dir="rtl"`، خطوط `Cairo` و `IBM Plex Sans Arabic`.
- **الأمان المطلق:** منع المشرف من إيقاف أو تخفيض رتبة حسابه الشخصي؛ التحقق الإلزامي من جلسة `ADMIN` عبر `admin.guard.ts`.
- **الاختبارات:** بقاء كافة الاختبارات السابقة (131 اختبار) خضراء بنسبة 100%، وإضافة 5 اختبارات تكاملية شاملة.

---

## 2. Zero-Decision Type Contracts (`src/features/admin/types/admin.types.ts`)

```typescript
export type GatewayId = "mada" | "apple_pay" | "visa_mastercard" | "stc_pay" | "tamara";

export interface AdminGatewayConfig {
  id: GatewayId;
  name: string;
  nameAr: string;
  descriptionAr: string;
  icon: string;
  isEnabled: boolean;
  isTestMode: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface AdminPlatformPricing {
  proMonthlyPrice: number;
  proYearlyPrice: number;
  storeCommissionRate: number; // e.g. 5 for 5%
}

export interface AdminPlatformSettings {
  siteName: string;
  supportEmail: string;
  canonicalDomain: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowRegistration: boolean;
  rateLimitMaxAttempts: number;
  linkSentinelActive: boolean;
  pricing: AdminPlatformPricing;
  gateways: Record<GatewayId, AdminGatewayConfig>;
}

export interface AdminTransaction {
  id: string;
  transactionNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  gateway: GatewayId;
  plan: "PRO_MONTHLY" | "PRO_YEARLY" | "STORE_COMMISSION";
  status: "COMPLETED" | "PENDING" | "REFUNDED";
  createdAt: string;
}

export interface AdminCreatorLeaderboardItem {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  linksCount: number;
  viewsCount: number;
  revenue: number;
}

export interface AdminAnalyticsData {
  mrr: number;
  mrrGrowthRate: number;
  totalUsers: number;
  activeUsers: number;
  proSubscribersCount: number;
  totalPlatformClicks: number;
  totalPlatformViews: number;
  chartData: Array<{
    date: string;
    revenue: number;
    users: number;
    clicks: number;
  }>;
  topCreators: AdminCreatorLeaderboardItem[];
  recentTransactions: AdminTransaction[];
}

export interface RoleUpdateInput {
  role: "ADMIN" | "USER";
}
```

---

## 3. Server Logic & API Contracts

### 3.1 فصل الثوابت والإعدادات (`src/features/admin/services/admin.defaults.ts`)
- يحتوي على القيم الافتراضية للبوابات السعودية الخمس (مدى، Apple Pay، فيزا، STC Pay، تمارا).
- يحتوي على المخزن اللحظي `statefulSettings` و `statefulTransactions` لتجنب تضخم `admin.service.ts` والحفاظ على حجم أقل من 120 سطراً.

### 3.2 توقيع العمليات في `admin.service.ts`
```typescript
export async function toggleUserRole(
  targetUserId: string,
  newRole: "ADMIN" | "USER",
  currentAdminId: string
): Promise<{ ok: boolean; status: number; error?: string; user?: any }>;

export function getPlatformSettings(): AdminPlatformSettings;

export function updatePlatformSettings(
  partial: Partial<AdminPlatformSettings>
): { ok: boolean; settings: AdminPlatformSettings };

export async function getPlatformAnalyticsData(): Promise<AdminAnalyticsData>;
```

### 3.3 المسارات والمنافذ البرمجية (REST Endpoints)
1. `GET /api/admin/analytics`: جلب كائن `AdminAnalyticsData` (200 OK).
2. `GET /api/admin/settings`: جلب كائن `AdminPlatformSettings` (200 OK).
3. `PATCH /api/admin/settings`: استقبال تعديل الإعدادات وحفظها وإرجاع الإعدادات المحدثة (200 OK).
4. `POST /api/admin/users/[id]/role`: تغيير رتبة المستخدم (`{ role: "ADMIN" | "USER" }`) مع منع المشرف من تعديل حسابه (400 Bad Request).
5. `POST /api/admin/users/[id]/suspend`: إيقاف/تنشيط الحساب (موجود ومحمي).
6. `GET /api/admin/reports` و `PATCH /api/admin/reports/[id]`: معالجة البلاغات (موجود ومحمي).

---

## 4. خطة المهام التنفيذية (Task Roadmap)

### 📌 المهمة 1: كتابة الأنواع والإعدادات الافتراضية
- [ ] تحديث `src/features/admin/types/admin.types.ts` بإدراج الواجهات الخمس (`AdminGatewayConfig`, `AdminPlatformSettings`, `AdminAnalyticsData`, `AdminTransaction`, `RoleUpdateInput`).
- [ ] إنشاء `src/features/admin/services/admin.defaults.ts` وتضمين بوابات الدفع الخمس، التسعير، والمعاملات الافتراضية (< 120 سطراً).
- [ ] إضافة دوال `toggleUserRole`, `getPlatformSettings`, `updatePlatformSettings`, `getPlatformAnalyticsData` في `src/features/admin/services/admin.service.ts` (< 190 سطراً).
- [ ] إنشاء مسار `POST /api/admin/users/[id]/role/route.ts` مع حماية المشرف.
- [ ] إنشاء مسار `src/app/api/admin/settings/route.ts` (`GET` و `PATCH`).
- [ ] إنشاء مسار `src/app/api/admin/analytics/route.ts` (`GET`).

### 📌 المهمة 2: بناء مكونات التبويبات الخمسة للواجهة
- [ ] إنشاء `src/features/admin/components/AdminNavTabs.tsx` لشريط التبويبات الخمسة مع شارات العدادات التفاعلية (< 80 سطراً).
- [ ] إنشاء `src/features/admin/components/AdminAnalyticsTab.tsx` ببطاقات KPI ومخطط Pure SVG تفاعلي وقائمة المتصدرين (< 170 سطراً).
- [ ] إنشاء `src/features/admin/components/AdminUsersTab.tsx` بجدول المستخدمين المتقدم وزر الترقية إلى ADMIN والفلترة السريعة (< 190 سطراً).
- [ ] إنشاء `src/features/admin/components/AdminPaymentsTab.tsx` ببطاقات تفعيل مدى و Apple Pay وبطاقات الائتمان وحقول المفاتيح وسجل المعاملات (< 200 سطراً).
- [ ] إنشاء `src/features/admin/components/AdminSettingsTab.tsx` بإعدادات وضع الصيانة وسياسة التسجيل وحارس الأمان وزر الحفظ التلقائي (< 180 سطراً).
- [ ] تحديث `src/features/admin/index.ts` لإعادة تصدير المكونات والخدمات والأنواع.

### 📌 المهمة 3: تجميع وتحديث صفحة المشغل الرئيسية (`/admin`)
- [ ] تحديث `src/app/(admin)/admin/page.tsx` للربط المتزامن والتنقل السلس بين التبويبات الخمسة (< 210 سطراً).
- [ ] التحقق الصارم من عدم تجاوز أي ملف 250 سطراً.

### 📌 المهمة 4: الاختبارات التكاملية وضمان الجودة
- [ ] إنشاء `tests/integration/admin-enterprise-suite.test.ts` وتغطية الحالات الخمس المحددة من المدقق:
  1. جلب إحصائيات `GET /api/admin/analytics` والتأكد من بيانات الـ MRR والمتصدرين والـ SVG.
  2. فحص استرجاع بوابات الدفع الخمس (مدى، Apple Pay، فيزا، STC Pay، تمارا).
  3. تعديل الإعدادات عبر `PATCH /api/admin/settings` والتأكد من نجاح التعديل.
  4. ترقية مستخدم عميل إلى `ADMIN` عبر `toggleUserRole`.
  5. التحقق من منع المشغل من تغيير رتبة حسابه الشخصي وإرجاع كود 400.
- [ ] تشغيل `npm test` والتأكد من اجتياز كافة ملفات الاختبار الـ 27+.
- [ ] تشغيل بناء الإنتاج `rm -rf .next && npx next build` والتأكد من توليد كافة المسارات بنجاح.
