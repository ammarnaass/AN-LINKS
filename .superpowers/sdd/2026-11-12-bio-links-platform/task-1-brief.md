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

