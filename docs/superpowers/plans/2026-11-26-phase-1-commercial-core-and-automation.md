# Phase 1: Commercial Core & Essential Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform AN LINKS into a 2026 creator commerce platform by building 1-on-1 consultation booking with atomic slot reservation, creator outgoing webhooks with transactional outbox, automated welcome email sequences, and real revenue ledger aggregation governed by plan quotas.

**Architecture:** Modular architecture (`src/features/appointments/`, `src/features/webhooks/`) with single-responsibility files strictly $\le 250$ lines each. Concurrency protection via Prisma interactive transactions for appointment slots. Resilient asynchronous dispatching for webhooks with HMAC-SHA256 signatures and SSRF safeguards. Real financial aggregation from `DigitalOrder` and `AppointmentBooking` replacing all static mock balances in payouts.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Prisma ORM, PostgreSQL, Vitest / React Testing Library, Zod, HMAC-SHA256 crypto, Nodemailer.

**Spec:** [`egm-2026-market-competitiveness-and-gap-analysis.md`](file:///home/ammar/.gemini/antigravity/brain/d13a14c0-ba72-468c-a2d5-428bcc4190b1/egm-2026-market-competitiveness-and-gap-analysis.md)

---

## Global Constraints

- Every single `.ts` and `.tsx` file must strictly stay within $\le 250$ lines of code.
- Zero mock or placeholder values in production financial calculations (`payouts.service.ts`).
- Full RTL and Arabic localization support across all creator and visitor interfaces.
- Outgoing Webhooks must strictly block internal and private IP ranges (SSRF protection: RFC 1918, loopback, and cloud metadata IPs `169.254.169.254`).
- All 103 existing test suites (763+ tests) must continue to pass with 0 regressions.

---

## Review Focus

1. **Double-booking race conditions:** Simultaneous reservation requests for the exact same slot must atomically lock for the first client (`lockedUntil = NOW() + 10m`) and return `409 Conflict` (`SLOT_ALREADY_RESERVED`) to the second.
2. **Webhook failure isolation:** Creator webhooks must never block or delay user checkout/subscribe flows; delivery must use transactional outbox with exponential backoff and replay-resistant timestamps.
3. **Escrow & payout balance safety:** Available withdrawal balance must strictly equal cleared earnings minus platform commission minus transferred/pending payouts; negative balances or unverified IBAN requests must be rejected.
4. **Quota gate enforcement:** Calling appointments or webhooks endpoints without corresponding `PlanQuota` permissions (`allowAppointments`, `allowOutgoingWebhooks`) must fail with `403 Forbidden`.
5. **SSRF protection:** Webhook endpoint URLs resolving to `127.0.0.1`, `localhost`, `10.*.*.*`, `172.16-31.*.*`, `192.168.*.*`, or `169.254.169.254` must be rejected at validation time.

---

## Implementation Tasks

### Task 1: Database Schema Expansion & Quota Governance

**Files:**
- Modify: `prisma/schema.prisma`
- Test: `tests/unit/prisma-schema-phase1.test.ts`

- [ ] **Step 1: Write schema validation test**
  Create `tests/unit/prisma-schema-phase1.test.ts` verifying that `PlanQuota`, `ConsultationService`, `AvailabilityRule`, `AppointmentBooking`, `CreatorWebhookEndpoint`, and `WebhookOutbox` models and fields exist in Prisma metadata.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run tests/unit/prisma-schema-phase1.test.ts` to confirm missing models/fields.
- [ ] **Step 3: Update `prisma/schema.prisma`**
  - Add to `PlanQuota`:
    ```prisma
    allowAppointments      Boolean @default(false)
    allowOutgoingWebhooks  Boolean @default(false)
    allowAiCopilot         Boolean @default(false)
    ```
  - Add to `Profile`:
    ```prisma
    welcomeSubject String?
    welcomeBody    String?
    welcomeGiftUrl String?
    ```
  - Add `ConsultationService`, `AvailabilityRule`, and `AppointmentBooking` models with appropriate indexes (`[creatorId, isActive]`, `[creatorId, startTime, endTime]`, `[status, lockedUntil]`).
  - Add `CreatorWebhookEndpoint` and `WebhookOutbox` models with exponential backoff tracking and indexes (`[status, nextRetryAt]`).
  - Add `referralCode` and `referredById` relations to `User`.
- [ ] **Step 4: Generate Prisma Client**
  Execute `npx prisma generate` and `npx prisma validate`.
- [ ] **Step 5: Run test to verify it passes**
  Run `npx vitest run tests/unit/prisma-schema-phase1.test.ts`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(db): add phase 1 schemas for appointments, webhooks, and quotas"`

---

### Task 2: Appointments Feature Core & Atomic Slot Locking Engine

**Files:**
- Create: `src/features/appointments/types/appointments.types.ts`
- Create: `src/features/appointments/validators/appointments.validator.ts`
- Create: `src/features/appointments/server/appointments.scheduler.ts`
- Create: `src/features/appointments/server/appointments.service.ts`
- Create: `src/features/appointments/index.ts`
- Test: `tests/unit/appointments-locking.test.ts`

- [ ] **Step 1: Write failing unit test for slot calculation & atomic locking**
  Create `tests/unit/appointments-locking.test.ts` testing:
  1. `calculateAvailableSlots`: takes availability rules and active bookings and returns open 30/60m slots.
  2. `reserveSlotAtomic`: sets `status = "PENDING_PAYMENT"` with `lockedUntil = Date.now() + 10 mins`.
  3. Concurrent reservation of the same slot fails with `SLOT_ALREADY_RESERVED`.
  4. Expired lock (`lockedUntil < NOW()`) releases the slot for reservation.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run tests/unit/appointments-locking.test.ts`.
- [ ] **Step 3: Implement `src/features/appointments/` modules**
  - `types/appointments.types.ts`: Define `ConsultationSlot`, `AppointmentCreateInput`, `AppointmentStatus`. Keep $\le 80$ lines.
  - `validators/appointments.validator.ts`: Zod schema for slot booking and creator availability rules. Keep $\le 90$ lines.
  - `server/appointments.scheduler.ts`: Pure scheduling logic for generating time slots from weekly rules. Keep $\le 160$ lines.
  - `server/appointments.service.ts`: Atomic transaction queries using `prisma.$transaction`. Keep $\le 210$ lines.
  - `index.ts`: Barrel export.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run tests/unit/appointments-locking.test.ts`.
- [ ] **Step 5: Verify strict $\le 250$ line limit**
  Run line count check on all files in `src/features/appointments/`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(appointments): implement scheduler and atomic slot reservation engine"`

---

### Task 3: Creator Outgoing Webhooks with Transactional Outbox & HMAC Signatures

**Files:**
- Create: `src/features/webhooks/types/webhooks.types.ts`
- Create: `src/features/webhooks/validators/webhooks.validator.ts`
- Create: `src/features/webhooks/services/webhook-signer.service.ts`
- Create: `src/features/webhooks/services/webhook-outbox.service.ts`
- Create: `src/features/webhooks/index.ts`
- Create: `src/app/api/cron/dispatch-webhooks/route.ts`
- Test: `tests/unit/webhook-outbox-and-signature.test.ts`

- [ ] **Step 1: Write failing test for SSRF guard, HMAC signing, and outbox retry**
  Create `tests/unit/webhook-outbox-and-signature.test.ts` verifying:
  1. SSRF URL validator rejects `127.0.0.1`, `10.0.0.1`, `192.168.1.1`, `169.254.169.254`, and `localhost`.
  2. HMAC signer generates `X-AnLinks-Signature: t={timestamp},v1={hash}` matching expected SHA-256 HMAC.
  3. Outbox retry calculator returns exponential backoffs: Attempt 1 $\to$ 1m, Attempt 2 $\to$ 5m, Attempt 3 $\to$ 15m, Attempt 4 $\to$ 60m, Attempt 5 $\to$ FAILED.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run tests/unit/webhook-outbox-and-signature.test.ts`.
- [ ] **Step 3: Implement `src/features/webhooks/` modules**
  - `types/webhooks.types.ts`: Define event types (`order.completed`, `lead.collected`, `booking.confirmed`). Keep $\le 60$ lines.
  - `validators/webhooks.validator.ts`: URL validator with IP address / DNS private IP blacklisting. Keep $\le 110$ lines.
  - `services/webhook-signer.service.ts`: `createWebhookSignature` and `verifyWebhookSignature`. Keep $\le 80$ lines.
  - `services/webhook-outbox.service.ts`: `enqueueWebhookEvent` and `processPendingOutboxBatch` with 4-second timeout per dispatch. Keep $\le 210$ lines.
  - `src/app/api/cron/dispatch-webhooks/route.ts`: Secure cron worker route. Keep $\le 80$ lines.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run tests/unit/webhook-outbox-and-signature.test.ts`.
- [ ] **Step 5: Verify strict $\le 250$ line limit**
  Run line count check on all files in `src/features/webhooks/`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(webhooks): add transactional outbox, HMAC signer, and SSRF validator"`

---

### Task 4: Automated Welcome Email for Newsletter Subscribers

**Files:**
- Modify: `src/app/api/bio/[username]/subscribe/route.ts`
- Modify: `src/features/settings/types/settings.types.ts`
- Modify: `src/features/settings/components/newsletter/NewsletterSettingsTab.tsx`
- Test: `tests/unit/newsletter-welcome-email.test.ts`

- [ ] **Step 1: Write failing test for automatic welcome email**
  Create `tests/unit/newsletter-welcome-email.test.ts` testing that when a user subscribes, if creator profile has `welcomeSubject` and `welcomeBody`, `sendTransactionalEmail` is dispatched with creator's subject and greeting.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run tests/unit/newsletter-welcome-email.test.ts`.
- [ ] **Step 3: Implement welcome email dispatch and UI settings**
  - In `subscribe/route.ts`: query creator's welcome email settings and trigger email asynchronously via `void sendTransactionalEmail(...)` wrapped in try/catch to ensure subscribe never fails if SMTP is delayed.
  - In `NewsletterSettingsTab.tsx`: add inputs for welcome email subject, body, and gift download link.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run tests/unit/newsletter-welcome-email.test.ts`.
- [ ] **Step 5: Verify strict $\le 250$ line limit**
  Verify line counts for `subscribe/route.ts` and `NewsletterSettingsTab.tsx`.
- [ ] **Step 6: Commit**
  `git commit -m "feat(newsletter): add automated welcome email sequence on new subscriber"`

---

### Task 5: Real Creator Payout Ledger Calculation & Admin Quotas Controls

**Files:**
- Modify: `src/features/settings/server/payouts.service.ts`
- Modify: `src/features/admin/types/financial.types.ts`
- Modify: `src/features/admin/components/payments/tabs/quotas/PlanQuotasFeatureSwitches.tsx`
- Test: `tests/unit/creator-real-payout-ledger.test.ts`

- [ ] **Step 1: Write failing test for real payout ledger**
  Create `tests/unit/creator-real-payout-ledger.test.ts` asserting that `getPayoutBalance(userId)` computes real aggregate sums from `DigitalOrder` and `AppointmentBooking` minus platform commission rate, completely removing `baseEarnings = 1850.0`.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run tests/unit/creator-real-payout-ledger.test.ts`.
- [ ] **Step 3: Implement real ledger aggregation & admin UI switches**
  - Refactor `payouts.service.ts`:
    - Compute `ordersTotal = SUM(DigitalOrder.amount)` for `PAID` orders.
    - Compute `appointmentsTotal = SUM(AppointmentBooking.amount)` for `CONFIRMED` bookings.
    - Apply platform fee: `netEarnings = (ordersTotal + appointmentsTotal) * (1 - storeCommissionRate / 100)`.
    - `availableBalance = Math.max(0, netEarnings - totalWithdrawn - pendingWithdrawal)`.
  - Update `financial.types.ts` and `PlanQuotasFeatureSwitches.tsx`:
    - Add UI switches for `allowAppointments`, `allowOutgoingWebhooks`, and `allowAiCopilot`.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run tests/unit/creator-real-payout-ledger.test.ts`.
- [ ] **Step 5: Verify strict $\le 250$ line limit**
  Run line count checks on modified files.
- [ ] **Step 6: Commit**
  `git commit -m "feat(payouts): replace mock baseline with real revenue ledger and add quota switches"`

---

### Task 6: Comprehensive Regression Testing, Type Checking & Build Verification

**Files:**
- All affected and existing test suites

- [ ] **Step 1: Run full unit test suite**
  Execute `npm test` and verify that all test suites pass with 0 failures.
- [ ] **Step 2: Run TypeScript and ESLint validation**
  Execute `npx tsc --noEmit` to verify 0 type errors across the entire codebase.
- [ ] **Step 3: Run production build verification**
  Execute `npm run build` and ensure Next.js build succeeds with 100% route generation.
- [ ] **Step 4: Verify $\le 250$ lines on all modified/new files**
  Execute script checking all `.ts` and `.tsx` files in the workspace.
- [ ] **Step 5: Commit & push**
  `git push origin main`
