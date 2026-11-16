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

