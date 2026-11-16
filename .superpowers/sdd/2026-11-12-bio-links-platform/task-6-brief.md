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

