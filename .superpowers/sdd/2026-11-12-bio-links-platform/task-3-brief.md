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

