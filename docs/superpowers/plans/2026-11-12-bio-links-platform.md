# Bio Links Platform (AN LINKS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Arabic-first, high-performance link-in-bio web platform (`AN LINKS`) that allows users to create and publish a personal link-in-bio page at `/{username}` in under 3 minutes, with an authenticated dashboard, live mobile preview, and traffic metrics.

**Architecture:** Unified full-stack TypeScript application built with Next.js (App Router), Tailwind CSS (RTL-first), Prisma ORM, and PostgreSQL. Public profiles (`/{username}`) are server-side rendered (SSR) for instant loading (LCP < 1.5s), sharing the exact same UI components with the interactive dashboard's live mobile preview. Outbound redirects (`/go/[id]`) and page views (`/api/views/[username]`) use direct atomic PostgreSQL increments with bot filtering, avoiding external queue/cache overhead for the MVP.

**Tech Stack:** Next.js 15+ (App Router, Server Actions, API Routes), TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, NextAuth.js / Auth.js (Credentials + Google OAuth), Lucide Icons / Simple Icons (SVGs), Sharp (Image optimization).

**Spec:** `/home/ammar/AN LINKS/PRD.md` (and EGM review synthesis in `intermediate_zoom_out_report.md`).

## Global Constraints

- **Language & Direction:** Arabic-first default (`dir="rtl"`, Cairo font), full responsive RTL layout, with LTR support for English and specific links.
- **Performance:** Public page LCP < 1.5s on 4G, bundle size < 100KB excluding user avatar.
- **Security:** Strict URL scheme allowlist (`http://`, `https://`), reject `javascript:`/`data:`, block direct IP hostnames and double shorteners; rate-limiting on auth and click endpoints; image uploads capped at 2MB and 4000x4000 px with EXIF stripping.
- **Privacy:** Anonymized IP tracking via `/24` (IPv4) or `/48` (IPv6) subnet truncation; no raw IP storage.
- **Data Integrity:** Users have unique usernames; links have foreign key cascades; reserved paths (`/dashboard`, `/api`, `/go`, `/login`, `/register`, `/robots.txt`) cannot be claimed as usernames.

## Review Focus

1. **Bot & Crawler Traffic:** Automated social media prefetch bots (Instagram, TikTok, WhatsApp scrapers) hitting `/go/[id]` must not inflate click analytics.
2. **Preview Drift:** Changes in the dashboard (title, theme, avatar, button style) must reflect instantly in the mobile preview without template drift or iframe lag.
3. **Route Collision:** Users attempting to register system names (e.g., `api`, `dashboard`, `go`, `admin`, `login`) must be rejected at schema validation and signup.
4. **Malicious URL Schemes:** Links containing dangerous schemes (e.g., `javascript:alert(1)`, `data:text/html`) or raw IP destinations must be blocked with explicit error feedback.
5. **Decompression Bomb Defense:** Malicious images crafted with tiny file size but extreme pixel dimensions (e.g. 15,000x15,000) must be rejected prior to heavy in-memory processing.

---

## File Structure

```
an-links/
├── prisma/
│   └── schema.prisma                  # PostgreSQL schema definitions & migrations
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root RTL layout with Cairo font
│   │   ├── page.tsx                   # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx         # Login page
│   │   │   └── register/page.tsx      # Registration & username selection
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx             # Authenticated dashboard shell
│   │   │   ├── dashboard/page.tsx     # Main links & appearance management
│   │   │   └── dashboard/analytics/   # Analytics overview & charts
│   │   │       └── page.tsx
│   │   ├── (public)/
│   │   │   └── [username]/page.tsx    # Public SSR link-in-bio page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # Auth.js / NextAuth handler
│   │   │   │   └── route.ts
│   │   │   ├── upload/route.ts        # Avatar upload & Sharp sanitization
│   │   │   └── views/[username]/      # Asynchronous page view beacon
│   │   │       └── route.ts
│   │   └── go/[id]/route.ts           # 302 redirect & click counter
│   ├── components/
│   │   ├── public/
│   │   │   ├── ProfileCard.tsx        # Avatar, Name, Bio, Social links
│   │   │   ├── LinkButton.tsx         # Styled link button
│   │   │   └── BioPageContent.tsx     # Unified component shared by SSR & preview
│   │   └── dashboard/
│   │       ├── LinkEditor.tsx         # Add/Edit/Delete/Toggle link list
│   │       ├── ThemeCustomizer.tsx    # Themes, fonts, button styling
│   │       ├── SocialLinksEditor.tsx  # Social icon inputs
│   │       └── MobilePreview.tsx      # Phone frame embedding BioPageContent
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── auth.ts                    # NextAuth config & session helpers
│   │   ├── url-sanitizer.ts           # URL validation & anti-phishing logic
│   │   ├── reserved-usernames.ts      # Reserved slug blacklist
│   │   ├── bot-detector.ts            # Crawler & prefetch header filtering
│   │   └── themes.ts                  # Theme definitions & presets
│   └── types/
│       └── index.ts                   # DTOs, theme types, database interfaces
├── tests/
│   ├── unit/
│   │   ├── url-sanitizer.test.ts
│   │   ├── reserved-usernames.test.ts
│   │   └── bot-detector.test.ts
│   └── integration/
│       ├── redirect.test.ts
│       └── profile-ssr.test.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

## Tasks

### Task 1: Project Scaffolding & Database Schema Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `src/lib/prisma.ts`
- Create: `prisma/schema.prisma`
- Test: `tests/unit/db-schema.test.ts`

**Interfaces:**
- Produces: Prisma models (`User`, `Profile`, `Link`, `SocialLink`, `DailyLinkStat`, `DailyProfileStat`, `Report`).
- Exports: `prisma` client singleton from `src/lib/prisma.ts`.

- [ ] **Step 1: Scaffolding dependencies and configuration files**
  Initialize Next.js 15+ project with TypeScript, Tailwind CSS, Prisma, and Lucide icons.

- [ ] **Step 2: Define Prisma Data Model in `prisma/schema.prisma`**
  Write schema models with indices:
  ```prisma
  model User {
    id            String    @id @default(cuid())
    email         String    @unique
    passwordHash  String?
    username      String    @unique
    emailVerified DateTime?
    isSuspended   Boolean   @default(false)
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
    profile       Profile?
    links         Link[]
    socials       SocialLink[]
  }

  model Profile {
    id          String   @id @default(cuid())
    userId      String   @unique
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    displayName String
    bio         String?
    avatarUrl   String?
    themeKey    String   @default("default")
    accentColor String   @default("#000000")
    buttonStyle String   @default("filled")
    borderRadius String  @default("rounded-xl")
    font        String   @default("Cairo")
    isPublished Boolean  @default(true)
  }

  model Link {
    id        String   @id @default(cuid())
    userId    String
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    title     String
    url       String
    icon      String?
    position  Int      @default(0)
    isActive  Boolean  @default(true)
    createdAt DateTime @default(now())
    stats     DailyLinkStat[]
    @@index([userId, position])
  }

  model SocialLink {
    id       String @id @default(cuid())
    userId   String
    user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
    network  String
    url      String
    position Int    @default(0)
    @@index([userId, position])
  }

  model DailyLinkStat {
    id      String   @id @default(cuid())
    linkId  String
    link    Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)
    date    DateTime @db.Date
    clicks  Int      @default(0)
    @@unique([linkId, date])
  }

  model DailyProfileStat {
    id        String   @id @default(cuid())
    username  String
    date      DateTime @db.Date
    views     Int      @default(0)
    @@unique([username, date])
  }

  model Report {
    id          String   @id @default(cuid())
    username    String
    reason      String
    details     String?
    reporterIp  String?
    status      String   @default("PENDING")
    createdAt   DateTime @default(now())
  }
  ```

- [ ] **Step 3: Write test for schema validation and singleton instantiations**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**
  `git commit -m "chore: scaffold project structure and define Prisma database schema"`

---

### Task 2: Core Validation Utilities (Sanitizer, Bot Detector, Reserved Names)

**Files:**
- Create: `src/lib/url-sanitizer.ts`
- Create: `src/lib/bot-detector.ts`
- Create: `src/lib/reserved-usernames.ts`
- Test: `tests/unit/url-sanitizer.test.ts`
- Test: `tests/unit/bot-detector.test.ts`
- Test: `tests/unit/reserved-usernames.test.ts`

**Interfaces:**
- Produces:
  - `sanitizeUrl(rawUrl: string): { valid: boolean; normalizedUrl?: string; error?: string }`
  - `isBotOrPrefetch(userAgent: string | null, headers: Headers): boolean`
  - `isUsernameReserved(username: string): boolean`
  - `truncateIp(ip: string): string`

- [ ] **Step 1: Write failing unit tests for `url-sanitizer`, `bot-detector`, and `reserved-usernames`**
  - Verify rejection of `javascript:`, `data:`, raw IP addresses (`http://192.168.1.1`), and double shorteners (`bit.ly`).
  - Verify auto-prefixing of `https://` for valid domains without protocols.
  - Verify detection of `facebookexternalhit`, `Twitterbot`, `TelegramBot`, `WhatsApp`, `Bytespider`, and `Purpose: prefetch`.
  - Verify rejection of reserved names (`api`, `dashboard`, `admin`, `login`, `register`, `go`).
  - Verify IP truncation (`192.168.1.50` -> `192.168.1.0/24`).

- [ ] **Step 2: Run tests to verify failures**
- [ ] **Step 3: Implement validation utilities in `src/lib/`**
- [ ] **Step 4: Run tests to verify all pass**
- [ ] **Step 5: Commit**
  `git commit -m "feat: add url sanitization, bot detection, and reserved usernames utilities"`

---

### Task 3: Authentication & User Management

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Test: `tests/integration/auth.test.ts`

**Interfaces:**
- Consumes: `prisma` from `src/lib/prisma.ts`, `isUsernameReserved` from `src/lib/reserved-usernames.ts`.
- Produces: Session management, password hashing via bcrypt, user signup, username availability API.

- [ ] **Step 1: Write integration tests for registration and username validation**
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement Auth.js configuration and registration server action**
  Ensure username check enforces `^[a-zA-Z0-9_-]+$`, checks database uniqueness, and verifies against `isUsernameReserved`.
- [ ] **Step 4: Build Login and Register forms with Arabic RTL UI**
- [ ] **Step 5: Run tests to verify pass**
- [ ] **Step 6: Commit**
  `git commit -m "feat: implement authentication and username registration with RTL UI"`

---

### Task 4: Unified UI Components & Public Profile SSR (`/{username}`)

**Files:**
- Create: `src/lib/themes.ts`
- Create: `src/components/public/ProfileCard.tsx`
- Create: `src/components/public/LinkButton.tsx`
- Create: `src/components/public/BioPageContent.tsx`
- Create: `src/app/(public)/[username]/page.tsx`
- Create: `src/app/not-found.tsx`
- Test: `tests/integration/profile-ssr.test.ts`

**Interfaces:**
- Consumes: `prisma` for user profile & links retrieval.
- Produces: `BioPageContent` (pure component accepting `profile`, `links`, `socials`, and `isPreview?: boolean`).
- Produces: High-speed SSR route `GET /[username]`.

- [ ] **Step 1: Define Theme presets in `src/lib/themes.ts`**
  Define 4 default themes (Minimal Clean, Dark Midnight, Emerald Gradient, Warm Sunset) with specific font, border, and color tokens.
- [ ] **Step 2: Write integration tests for `GET /[username]` SSR**
  - Verify valid username renders profile title, bio, and links without requiring client JS.
  - Verify non-existent username returns 404.
  - Verify SEO Open Graph tags generation.
- [ ] **Step 3: Run tests to verify failure**
- [ ] **Step 4: Implement `BioPageContent` and `src/app/(public)/[username]/page.tsx`**
  Render SSR layout with semantic HTML, `<Link href="/go/${link.id}">`, and SVG icons.
- [ ] **Step 5: Run tests to verify pass**
- [ ] **Step 6: Commit**
  `git commit -m "feat: implement unified bio page components and public SSR route"`

---

### Task 5: Click Redirection (`/go/[id]`) & Asynchronous View Beacon

**Files:**
- Create: `src/app/go/[id]/route.ts`
- Create: `src/app/api/views/[username]/route.ts`
- Test: `tests/integration/analytics-tracking.test.ts`

**Interfaces:**
- Consumes: `isBotOrPrefetch` from `src/lib/bot-detector.ts`, `prisma` client.
- Produces: `GET /go/[id]` (302 redirect + atomic click upsert), `POST /api/views/[username]` (view beacon upsert).

- [ ] **Step 1: Write integration tests for redirect and view tracking**
  - Verify `/go/[id]` redirects with 302 to target URL.
  - Verify standard browser request increments `DailyLinkStat` clicks by 1 for the current date.
  - Verify social prefetch / bot user-agents receive 302 redirect but do NOT increment click counts.
  - Verify `/api/views/[username]` increments `DailyProfileStat` for current date.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement atomic upsert redirect in `src/app/go/[id]/route.ts`**
  ```typescript
  await prisma.dailyLinkStat.upsert({
    where: { linkId_date: { linkId: link.id, date: today } },
    update: { clicks: { increment: 1 } },
    create: { linkId: link.id, date: today, clicks: 1 }
  });
  ```
- [ ] **Step 4: Implement view tracking beacon in `src/app/api/views/[username]/route.ts`**
- [ ] **Step 5: Run tests to verify pass**
- [ ] **Step 6: Commit**
  `git commit -m "feat: implement 302 click redirect and view tracking with bot filtering"`

---

### Task 6: Interactive Dashboard with Live Mobile Preview

**Files:**
- Create: `src/components/dashboard/LinkEditor.tsx`
- Create: `src/components/dashboard/SocialLinksEditor.tsx`
- Create: `src/components/dashboard/ThemeCustomizer.tsx`
- Create: `src/components/dashboard/MobilePreview.tsx`
- Create: `src/app/(dashboard)/dashboard/page.tsx`
- Test: `tests/integration/dashboard-actions.test.ts`

**Interfaces:**
- Consumes: `BioPageContent` from `src/components/public/BioPageContent.tsx`.
- Produces: Full dashboard management UI with live synchronized preview.

- [ ] **Step 1: Write integration tests for Link CRUD and Ordering Server Actions**
  - Add link with sanitization.
  - Reorder links by position.
  - Toggle active state.
  - Delete link with cascade.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement Dashboard components and Server Actions**
  - Implement `LinkEditor` with drag-and-drop or reordering arrows.
  - Implement `ThemeCustomizer` with real-time state updates.
  - Embed `BioPageContent` inside `MobilePreview` phone mockup, bound directly to local React state (0ms preview latency, zero template duplication).
- [ ] **Step 4: Run tests to verify pass**
- [ ] **Step 5: Commit**
  `git commit -m "feat: implement interactive dashboard with instant live mobile preview"`

---

### Task 7: Image Upload & Avatar Processing

**Files:**
- Create: `src/app/api/upload/route.ts`
- Test: `tests/unit/image-upload.test.ts`

**Interfaces:**
- Consumes: Sharp image processing library.
- Produces: `POST /api/upload` endpoint returning optimized avatar URL.

- [ ] **Step 1: Write tests for image upload security**
  - Verify rejection of non-image MIME types.
  - Verify rejection of files > 2MB.
  - Verify rejection of images exceeding 4000x4000 px dimensions (decompression bomb protection).
  - Verify stripping of EXIF metadata and output conversion to WebP.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement upload handler with Sharp in `src/app/api/upload/route.ts`**
- [ ] **Step 4: Run tests to verify pass**
- [ ] **Step 5: Commit**
  `git commit -m "feat: implement secure avatar upload and image optimization pipeline"`

---

### Task 8: Analytics Dashboard & Metrics Visualization

**Files:**
- Create: `src/app/(dashboard)/dashboard/analytics/page.tsx`
- Create: `src/components/dashboard/AnalyticsChart.tsx`
- Test: `tests/integration/analytics-api.test.ts`

**Interfaces:**
- Consumes: `DailyLinkStat` and `DailyProfileStat` aggregated records.
- Produces: 7-day and 30-day views and clicks breakdown with total CTR computation.

- [ ] **Step 1: Write tests for analytics queries and aggregation calculations**
  Verify query aggregates 7-day and 30-day views/clicks and formats daily time series accurately.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement analytics overview page and SVG/Canvas charts**
- [ ] **Step 4: Run tests to verify pass**
- [ ] **Step 5: Commit**
  `git commit -m "feat: implement analytics dashboard for views, clicks, and CTR"`

---

### Task 9: Abuse Reporting & Operator Moderation (P1 Foundation)

**Files:**
- Create: `src/app/api/reports/route.ts`
- Create: `src/components/public/ReportModal.tsx`
- Test: `tests/integration/reports.test.ts`

**Interfaces:**
- Produces: Public report modal on `/{username}` and `POST /api/reports` submission handler.

- [ ] **Step 1: Write integration tests for report submission**
- [ ] **Step 2: Implement `ReportModal` on public profiles and `POST /api/reports` with rate limiting**
- [ ] **Step 3: Run tests to verify pass**
- [ ] **Step 4: Commit**
  `git commit -m "feat: implement public abuse reporting modal and endpoint"`

---

## Self-Review Verification Checklist

1. **Spec Coverage:**
   - Auth (AUTH 1–3): Task 3.
   - Links (LNK 1–5): Task 6.
   - Socials (SOC 1–3): Task 6.
   - Themes & Live Preview (THM 1–4): Task 4 & Task 6.
   - Public SSR (PUB 1–4): Task 4.
   - Analytics & Bot Filter (ANL 1–3): Task 2, Task 5, Task 8.
   - Abuse Reports (ADM-3 / Security): Task 9.
2. **Step Scan:** Every step specifies test commands, exact signatures, or verification outcomes.
3. **Type Consistency:** Model types (`User`, `Profile`, `Link`, `DailyLinkStat`, `DailyProfileStat`) align across all tasks.
4. **Review Focus Verification:** Bot filtering (Task 2 & 5), Live preview drift (Task 4 & 6), Reserved route collisions (Task 2 & 3), Malicious URL schemes (Task 2 & 6), Image decompression bombs (Task 7).
5. **Proportion:** Plan is structured in 9 focused, test-driven deliverables.

