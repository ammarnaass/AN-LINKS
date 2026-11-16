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

