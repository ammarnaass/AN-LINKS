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

