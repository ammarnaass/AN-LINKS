# Real Auth Navigation, Session Management Tool & Mock Data Purge Plan (v2.0.0)

> **Document Version:** v2.0.0 (Audited & Hardened)  
> **Status:** Revised in response to Implementation Readiness Audit findings  
> **Target Date:** 2026-11-14  

---

## 1. Executive Summary & Root Cause Analysis

### 1.1 "أين نظام تسجيل الدخول والتسجيل في الموقع؟" (Real Auth Navigation)
- **Problem:** The landing page (`/`) hijacked authentication clicks with a mock modal (`AuthModal.tsx`) that contained a bypass button ("المتابعة إلى لوحة التحكم فوراً") using a dummy `setTimeout` and fake handle (`faisal`), preventing users from reaching the real authentication pages ([/login](file:///home/ammar/AN%20LINKS/src/app/(auth)/login/page.tsx) and [/register](file:///home/ammar/AN%20LINKS/src/app/(auth)/register/page.tsx)).
- **Remediation:**
  - Route all "تسجيل الدخول" buttons directly to `/login`.
  - Route all "ابدأ مجاناً" and Hero claim buttons directly to `/register?username={encodeURIComponent(handle)}`.
  - In `RegisterForm.tsx`, read `useSearchParams().get("username")` and pre-fill the username field automatically.
  - Delete `AuthModal.tsx` completely and clean up landing page callbacks.

### 1.2 "أداة الجلسات" (Session Management Tool for User & Admin)
- **Problem:** In NextAuth with stateless JWTs (`strategy: "jwt"`), the server has no record of active sessions across the platform, and `prisma/schema.prisma` had no session model. The "الجلسات النشطة" section in `SecurityTab.tsx` was static mock HTML.
- **Remediation:**
  - Add a first-class `UserSession` model in `prisma/schema.prisma`:
    ```prisma
    model UserSession {
      id           String   @id @default(cuid())
      userId       String
      user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
      sessionToken String   @unique
      ipAddress    String?
      userAgent    String?
      deviceType   String   @default("desktop")
      browser      String?
      os           String?
      isActive     Boolean  @default(true)
      lastActive   DateTime @default(now())
      expiresAt    DateTime
      createdAt    DateTime @default(now())

      @@index([userId, isActive])
    }
    ```
  - Record the session in NextAuth `callbacks.jwt` upon login or token issuance.
  - Implement user session inspection & revocation API:
    - `GET /api/auth/sessions`: List active sessions for the authenticated user.
    - `DELETE /api/auth/sessions/[id]`: Revoke a user's session (sets `isActive: false`).
  - Implement admin session audit & revocation API:
    - `GET /api/admin/sessions`: List all active platform sessions with user email, role, IP, device, and last active time.
    - `DELETE /api/admin/sessions/[id]`: Admin revokes any session platform-wide.
  - In `SecurityTab.tsx`, replace static HTML with a dynamic session list and working "تسجيل الخروج من الجلسة" action.
  - In `/admin`, add a dedicated 6th tab `AdminSessionsTab.tsx`.

### 1.3 "احذف البيانات الوهمية" (Purge Mock Data)
- **Problem:** Multiple dashboard pages had hardcoded mock creators, fake links, and fake formulas:
  - `/dashboard`: Hardcoded `tariq` ("طارق المنصور") with 3 fake links and 7 fake socials, stored only in React state and never persisted to PostgreSQL.
  - `/dashboard/settings`: Hardcoded `faisal@almansour.sa` with fake `setTimeout` save.
  - `/dashboard/analytics`: Hardcoded `TOP_LINKS_DATA` with dummy click counts.
  - `/admin` & `admin.service.ts`: Hardcoded `INITIAL_TRANSACTIONS` (dummy Saudi names) and `Math.sin(...)` trigonometric mock curves.
- **Remediation:**
  - Create `/api/links` (GET, POST, PUT) and `/api/links/[id]` (PATCH, DELETE) to persist and manage real links and socials in Prisma.
  - Create `/api/analytics` (GET) to query real `DailyProfileStat` and `DailyLinkStat` data.
  - Update `prisma/schema.prisma` `Profile` model with `phone String?` and `seoIndexing Boolean @default(true)`.
  - Connect `/dashboard`, `/dashboard/settings`, and `/dashboard/analytics` to real APIs with clean Arabic empty states when no records exist.
  - In `admin.defaults.ts`, set `INITIAL_TRANSACTIONS = []`. In `admin.service.ts`, compute real aggregations from `prisma.user`, `prisma.link`, `prisma.dailyLinkStat`, and `prisma.dailyProfileStat`.

---

## 2. File Structure & Modular Architecture

```
prisma/
└── schema.prisma                           (Add UserSession model, update Profile with phone/seoIndexing)

src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx                  (Clean page, role-aware redirect)
│   │   └── register/page.tsx               (Reads searchParams for claim username)
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx                    (Refactored: fetches real user links from DB)
│   │   │   ├── settings/page.tsx           (Refactored: loads & updates real user profile in DB)
│   │   │   └── analytics/page.tsx          (Refactored: fetches real user analytics from /api/analytics)
│   │   └── layout.tsx
│   ├── (admin)/admin/page.tsx              (Modularized via useAdminConsole hook, < 180 lines)
│   └── api/
│       ├── links/
│       │   ├── route.ts                    (NEW: GET links/socials, POST create link, PUT batch reorder)
│       │   └── [id]/route.ts               (NEW: PATCH update link, DELETE remove link)
│       ├── profile/route.ts                (UPDATED: Add GET to return current user profile)
│       ├── analytics/route.ts              (NEW: GET user-specific analytics from Prisma stats)
│       ├── auth/
│       │   └── sessions/
│       │       ├── route.ts                (NEW: GET active sessions for current user)
│       │       └── [id]/route.ts           (NEW: DELETE revoke session by id)
│       └── admin/
│           └── sessions/
│               ├── route.ts                (NEW: GET all platform sessions for admin)
│               └── [id]/route.ts           (NEW: DELETE admin revoke session)
├── features/
│   ├── auth/
│   │   ├── components/RegisterForm.tsx     (Reads ?username= and pre-fills)
│   │   ├── server/session.service.ts       (NEW: Session registration, lookup, revocation)
│   │   └── types/session.types.ts          (NEW: Session DTOs and contracts)
│   ├── landing/
│   │   ├── components/LandingHeader.tsx    (Direct hrefs to /login and /register)
│   │   ├── components/HeroSection.tsx      (Direct router.push to /register?username=...)
│   │   ├── components/PricingBannerSection.tsx (Direct hrefs to /register)
│   │   ├── components/GiantCtaSection.tsx  (Direct hrefs to /register)
│   │   └── components/LandingPageClient.tsx (Removed mock AuthModal bypass)
│   ├── links/
│   │   ├── services/links.client.ts        (NEW: Client API helpers for links CRUD)
│   │   └── types/links.types.ts            (Updated DTOs)
│   ├── settings/
│   │   └── components/SecurityTab.tsx      (Dynamic active sessions with revoke button)
│   └── admin/
│       ├── hooks/useAdminConsole.ts        (NEW: Extracted hook to keep admin/page.tsx < 180 lines)
│       ├── services/admin.defaults.ts      (Empty real store: INITIAL_TRANSACTIONS = [])
│       ├── services/admin.service.ts       (Real Prisma aggregations; zero Math.sin mocks)
│       ├── components/AdminNavTabs.tsx     (Includes 'sessions' tab)
│       └── components/AdminSessionsTab.tsx (NEW: Admin sessions inspection table)
```

---

## 3. Strict EGM Line Budget & Design Standards
- **File line length:** Strictly < 250 lines (aim < 180 lines).
  - `src/app/(admin)/admin/page.tsx` will be refactored with `useAdminConsole.ts` to reduce line count from 245 to ~120 lines.
- **Function line length:** Strictly < 40 lines.
- **Zero-Decision Principle:** All interfaces, schemas, and return contracts are fully written below.
- **Test Harness:** Pure Node environment via `NextRequest` and real Prisma integration tests.

---

## 4. Complete TypeScript Interfaces & Contracts (Zero-Decision)

### 4.1 Session DTOs (`src/features/auth/types/session.types.ts`)
```ts
export interface UserSessionDTO {
  id: string;
  sessionToken: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  isCurrent: boolean;
  lastActive: string;
  createdAt: string;
  expiresAt: string;
}

export interface AdminSessionDTO extends UserSessionDTO {
  userId: string;
  userEmail: string;
  userRole: "ADMIN" | "USER";
  username: string;
}
```

### 4.2 Links & Profile DTOs (`src/features/links/types/links.types.ts`)
```ts
export interface LinkData {
  id: string;
  userId: string;
  title: string;
  url: string;
  icon?: string | null;
  position: number;
  isActive: boolean;
  category?: string;
  clicks?: number;
  createdAt?: string;
}

export interface SocialItem {
  id: string;
  network: string;
  url: string;
  position: number;
}

export interface LinksPayload {
  links: LinkData[];
  socials: SocialItem[];
}

export interface CreateLinkInput {
  title: string;
  url: string;
  icon?: string;
  category?: string;
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  icon?: string | null;
  isActive?: boolean;
  position?: number;
}

export interface BatchReorderInput {
  links: { id: string; position: number; isActive?: boolean }[];
  socials?: { id?: string; network: string; url: string; position: number }[];
}

export interface UserProfileDTO {
  id: string;
  userId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  seoIndexing: boolean;
  themeKey: string;
  accentColor: string;
  buttonStyle: string;
  borderRadius: string;
  font: string;
  isPublished: boolean;
}
```

### 4.3 User Analytics DTO (`src/features/analytics/types/analytics.types.ts`)
```ts
export interface UserAnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  averageCtr: number;
  chartData: {
    date: string;
    views: number;
    clicks: number;
  }[];
  topLinks: {
    id: string;
    title: string;
    url: string;
    clicks: number;
    ctr: number;
  }[];
}
```

---

## 5. Detailed Task Decomposition & Test Specifications

### Task 1: Real Landing Navigation & Remove Mock AuthModal
- **Files Modified:**
  - `src/features/landing/components/LandingHeader.tsx` (Use `<Link href="/login">` and `<Link href="/register">`).
  - `src/features/landing/components/HeroSection.tsx` (Form submission routes to `/register?username=${encodeURIComponent(handle)}`).
  - `src/features/landing/components/PricingBannerSection.tsx` & `GiantCtaSection.tsx` (Direct links to `/register`).
  - `src/features/landing/components/LandingPageClient.tsx` (Remove `AuthModal` import, state, and JSX).
  - `src/features/landing/index.ts` (Remove `AuthModal` export).
  - `src/features/auth/components/RegisterForm.tsx` (Use `useSearchParams` to read `username` and pre-fill `formData.username`).
- **File Deleted:**
  - `src/features/landing/components/AuthModal.tsx`.
- **Node Integration Test:** `tests/integration/landing-auth-routing.test.ts`
  - Case 1: Validate `/register?username=newcreator` parses query parameters and validates username.
  - Case 2: Validate registration endpoint registers account and redirects to dashboard with valid credentials.
  - Case 3: Validate landing header components export valid links pointing to `/login` and `/register`.

### Task 2: Database Schema Upgrade & Real CRUD APIs (`/api/links`, `/api/profile`, `/api/analytics`)
- **Files Modified/Created:**
  - `prisma/schema.prisma`: Add `UserSession` model; add `phone String?` and `seoIndexing Boolean @default(true)` to `Profile`.
  - Run `npx prisma db push`.
  - `src/app/api/profile/route.ts`:
    - Add `GET`: Authenticates session, returns `UserProfileDTO` from `prisma.profile` + `prisma.user`.
    - Update `PATCH`: Upserts `displayName`, `bio`, `avatarUrl`, `phone`, `seoIndexing`, `themeKey`, `accentColor`, `buttonStyle`, `borderRadius`, `font`, `isPublished`.
  - `src/app/api/links/route.ts`:
    - `GET`: Authenticates session, returns `{ success: true, links: LinkData[], socials: SocialItem[] }`.
    - `POST`: Validates input with `CreateLinkInput`, creates `Link` with position `existingCount`, returns `{ success: true, link }`.
    - `PUT`: Accepts `BatchReorderInput`, updates positions and status in a `prisma.$transaction`.
  - `src/app/api/links/[id]/route.ts`:
    - `PATCH`: Validates `UpdateLinkInput`, verifies link belongs to `session.user.id`, updates `Link`.
    - `DELETE`: Verifies ownership, deletes `Link`.
  - `src/app/api/analytics/route.ts`:
    - `GET`: Authenticates session, queries user's links from `prisma.link`, sums clicks from `DailyLinkStat`, queries views from `DailyProfileStat` for user's username over last 7 or 30 days. Returns `UserAnalyticsSummary`.
- **Node Integration Test:** `tests/integration/links-api-real.test.ts`
  - Case 1: `GET /api/profile` returns 401 when unauthenticated.
  - Case 2: `GET /api/profile` returns profile for authenticated user.
  - Case 3: `POST /api/links` creates a link and sets position.
  - Case 4: `PUT /api/links` reorders multiple links in a single transaction.
  - Case 5: `DELETE /api/links/[id]` deletes a link and prevents deleting links owned by other users (403/404).
  - Case 6: `GET /api/analytics` returns zeroed clean metrics when no clicks/views exist.

### Task 3: Purge Mock Data from Dashboard & Settings
- **Files Created/Modified:**
  - `src/features/links/services/links.client.ts`: Client fetch functions (`fetchUserLinks`, `createLink`, `updateLink`, `deleteLink`, `batchUpdateLinks`).
  - `src/app/(dashboard)/dashboard/page.tsx`:
    - Use `useEffect` to fetch real profile & links via client services.
    - If `links.length === 0`, render clean Arabic empty state:
      *"أهلاً بك! لم تقم بإضافة روابط بعد. اضغط على 'إضافة رابط جديد' لإنشاء أول رابط في صفحتك"*.
    - Replaces hardcoded `tariq` and mock links with real backend persistence.
  - `src/app/(dashboard)/dashboard/settings/page.tsx`:
    - On mount, fetches real user profile from `/api/profile`.
    - Updates local states (`displayName`, `username`, `email`, `phone`, `bio`, `seoIndexing`).
    - `handleSaveProfile` calls `PATCH /api/profile` and shows real toast.
  - `src/app/(dashboard)/dashboard/analytics/page.tsx`:
    - Fetches real analytics from `/api/analytics`.
    - If `totalViews === 0 && totalClicks === 0`, displays clean empty state:
      *"لا توجد زيارات مسجلة بعد لصفحتك. شارك رابطك للبدء في جمع الزيارات وتحليل تفاعل الجمهور"*.
  - `src/features/dashboard/context/PreviewContext.tsx`:
    - Initializes from real logged-in user profile & links rather than hardcoded `faisal_client`.
- **Node Integration Test:** `tests/integration/dashboard-real-data.test.ts`
  - Case 1: Verifies `fetchUserLinks` and `PATCH /api/profile` payload validations.
  - Case 2: Asserts that empty user records produce empty arrays and zero counts, never fallback mock strings.

### Task 4: Session Management Tool Implementation
- **Files Created/Modified:**
  - `src/features/auth/server/session.service.ts`:
    - `recordSession(userId, token, ip, userAgent)`: Parses browser/OS with UAParser-like regex, calculates 30-day expiry, creates `UserSession` in Prisma.
    - `getUserActiveSessions(userId, currentToken)`: Queries `prisma.userSession.findMany({ where: { userId, isActive: true } })`.
    - `getAllPlatformSessions()`: For admin. Includes `user.email`, `user.role`, `user.username`.
    - `revokeSession(sessionId, requesterUserId, isAdmin)`: Sets `isActive: false`.
  - `src/features/auth/server/auth.options.ts`:
    - In `jwt` callback, record or refresh active session in `UserSession`.
    - If `UserSession.isActive === false`, clear token to force logout.
  - `src/app/api/auth/sessions/route.ts`:
    - `GET`: Returns active sessions for `session.user.id`.
  - `src/app/api/auth/sessions/[id]/route.ts`:
    - `DELETE`: Revokes session if owned by current user.
  - `src/app/api/admin/sessions/route.ts`:
    - `GET`: Admin guard, returns all platform sessions.
  - `src/app/api/admin/sessions/[id]/route.ts`:
    - `DELETE`: Admin guard, revokes any platform session.
  - `src/features/settings/components/SecurityTab.tsx`:
    - Fetches `/api/auth/sessions`.
    - Renders dynamic cards: Browser/OS, IP, Last Active, "الجلسة الحالية" badge, and "تسجيل الخروج من الجلسة" button.
  - `src/features/admin/components/AdminSessionsTab.tsx` (110 lines):
    - Table of active platform sessions: User, Role, Device, IP, Last Active, Revoke action.
  - `src/features/admin/components/AdminNavTabs.tsx`:
    - Add `sessions` tab (`الجلسات النشطة`).
  - `src/features/admin/hooks/useAdminConsole.ts` (NEW, 90 lines):
    - Extracts data-fetching, tabs state, role promotions, suspensions, settings save, and session revoking from `src/app/(admin)/admin/page.tsx`.
  - `src/app/(admin)/admin/page.tsx`:
    - Refactored using `useAdminConsole()`.
    - Reduced from 245 lines to ~130 lines, well below the 180-line target!
- **Node Integration Test:** `tests/integration/session-management-tool.test.ts`
  - Case 1: `recordSession` creates a `UserSession` with parsed OS and browser.
  - Case 2: `getUserActiveSessions` marks current session token as `isCurrent: true`.
  - Case 3: `revokeSession` marks session `isActive: false`.
  - Case 4: Non-admin user cannot revoke another user's session (403/Forbidden).
  - Case 5: Admin can revoke any session platform-wide.

### Task 5: Purge Mock Data from Admin Suite & Database Analytics
- **Files Modified:**
  - `src/features/admin/services/admin.defaults.ts`:
    - Set `INITIAL_TRANSACTIONS: AdminTransaction[] = []`.
  - `src/features/admin/services/admin.service.ts`:
    - In `getPlatformAnalyticsData()`:
      - Replace `Math.sin(...)` formulas with real counts:
        - `totalUsers`: `await prisma.user.count()`
        - `activeUsers`: `await prisma.user.count({ where: { isSuspended: false } })`
        - `proSubscribersCount`: `await prisma.user.count({ where: { role: "ADMIN" } })`
        - `totalPlatformClicks`: `await prisma.dailyLinkStat.aggregate({ _sum: { clicks: true } })`
        - `totalPlatformViews`: `await prisma.dailyProfileStat.aggregate({ _sum: { views: true } })`
        - `mrr`: 0 if no paid subscriptions recorded yet.
        - `mrrGrowthRate`: 0 if baseline is empty.
        - `chartData`: 14 days of real sums from `DailyLinkStat` and `DailyProfileStat`. If empty, returns zeroes.
        - `recentTransactions`: `statefulTransactions` (empty `[]` by default).
  - `src/features/admin/components/AdminAnalyticsTab.tsx` & `AdminPaymentsTab.tsx`:
    - Display clean Arabic empty states when transactions or revenue data are zero:
      *"لا توجد عمليات دفع مسجلة بعد. عند اشتراك صناع المحتوى في الباقات المدفوعة، ستظهر العمليات هنا فوراً."*
- **Node Integration Test:** `tests/integration/admin-real-analytics.test.ts`
  - Case 1: Platform analytics calculates real counts from Prisma without trigonometric formulas.
  - Case 2: Empty transactions store returns `[]` without error.

### Task 6: Comprehensive Verification & Build
- **Execution Steps:**
  - Check line counts of all modified and newly created files to ensure strict `< 250 lines` compliance.
  - Run `npm test` across all Vitest integration and unit tests.
  - Run `rm -rf .next && npx next build` to guarantee 100% clean production build.
  - Git commit with standard conventional commit message:
    `feat(auth): enable real landing auth navigation, session management tool and purge mock data`.
