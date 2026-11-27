# EGM Approved Architecture Specification: نظام تجارة الخدمات وحجز المواعيد الاحترافي V2 (Post-Goldfish Resolution)

* **Author:** AN LINKS Architecture (Elephant + Goldfish Audit Convergence)
* **Date:** 2026-11-27
* **Review Status:** **APPROVED AFTER 4-LENS GOLDFISH AUDIT** (`egm-design`, `egm-zoom-out`, `egm-codebase-details`, `egm-implementation-readiness`)

---

## 1. Critique Summary & Resolved Goldfish Decisions

All 5+ Blockers and Major risks identified across V1 (`0e4ea87`) and the V2 draft have been resolved as hard invariants:

1. **Single-Step Authenticated Gateway Checkout (Anti-Bypass + YAGNI):**
   - Because platform `PaymentGateway` records currently operate in sandbox/test mode (`isTestMode: true`) without external PSP redirect webhooks, two unverified HTTP steps (`/book -> /confirm`) expose an unpaid confirmation bypass and a 10-minute calendar DoS vector.
   - Instead, `POST /api/bio/[username]/appointments/book` executes **single-step atomic booking + gateway validation**:
     - For `price > 0`, `BookingClientForm` selects an enabled gateway matching `service.currency`. `/book` validates `gateway.isEnabled && gateway.supportedCurrencies.includes(service.currency)` and rejects unverified live calls if `gateway.isTestMode !== true`.
     - Server strictly computes `endTime`, validates `schedule`, acquires `pg_advisory_xact_lock`, checks buffer-aware overlaps, snapshots `amountPaid`, `platformCommission`, `creatorNetAmount`, `bufferMinutes`, and creates the booking as `CONFIRMED` + enqueues `WebhookOutbox` inside the **same transaction**.
     - Keeps `confirmBookingAtomic` hardened with `pg_advisory_xact_lock` + conditional `updateMany` for future live PSP webhooks.
2. **Payout Balance & Financial Snapshot Integrity (`payouts.service.ts` + `onDelete: Restrict`):**
   - `getPayoutBalance()` updated to query `status: { in: ["CONFIRMED", "COMPLETED"] }` and sum stored `creatorNetAmount` / `amountPaid` (falling back to live `service?.price` only for legacy pre-V2 `amountPaid === 0` rows).
   - `AppointmentBooking.service` uses `onDelete: Restrict`; deleting a service with historical bookings soft-archives (`isActive: false`) instead of cascading deletions.
3. **True IANA Timezone & DST Engine (`hourCycle: "h23"`, Rollover Rejection, Midnight Buffer Padding):**
   - `zonedWallClockToUtc` uses `hourCycle: "h23"` and round-trip local time verification to skip Spring-Forward non-existent slots and derive `endDateTime = startDateTime + durationMinutes` for Fall-Back folds.
   - `calculateAvailableSlots` defaults `timezone` to `"UTC"` only when omitted in pure-math test calls, while all production routes inject `profile.timezone || "Asia/Riyadh"`.
   - Booking queries use padded UTC intervals (`dayStartUtc - maxBuffer .. dayEndUtc + maxDuration + maxBuffer`) and enforce asymmetric buffers (`S < B.end + B.buffer && E + candidate.buffer > B.start`).
   - Client date selector (`BookingDateSlotStep.tsx`) formats dates in `creatorTimezone` (`en-CA`) and formats weekday labels using `T12:00:00.000Z` with `{ timeZone: "UTC" }`.
4. **Minimal Non-Bloated Prisma Delta:**
   - `Profile`: `timezone String @default("Asia/Riyadh")`
   - `ConsultationService`: `meetingType String @default("ONLINE")`, `meetingLocation String?`, `bufferMinutes Int @default(10)`, `intakePrompt String?`
   - `AvailabilityException`: `id`, `creatorId`, `date String`, `reason String?`, `createdAt`, `@@unique([creatorId, date])`
   - `AppointmentBooking`: `clientNotes`, `clientTimezone`, `amountPaid`, `platformCommission`, `creatorNetAmount`, `bufferMinutes`, `gatewayCode`, `manageTokenHash @unique`, `cancelReason`, `rescheduleCount`, plus `@@index([status, startTime])`, `@@index([createdAt])`
5. **Cryptographic `manageTokenHash` (SHA-256) + Reschedule/Cancel State Matrix:**
   - Store **only** `SHA-256(token)` in `manageTokenHash` and verify via `crypto.timingSafeEqual`. Enforce `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, and pass `x-manage-token` header on client portal fetch calls.
   - Enforce state guards (`CONFIRMED` & future `startTime > now + 2h`): forbid rescheduling `COMPLETED`/`CANCELLED`/`EXPIRED` or double-cancelling (`409 Conflict`).
6. **Transactional Outbox + Mailer Hardening + Webhook Event Alignment:**
   - Add `"booking.cancelled"` and `"booking.rescheduled"` to `WebhookEventType` and `CreatorWebhooksCard.tsx`.
   - Enqueue `WebhookOutbox` inside `$transaction`, then `Promise.allSettled([processPendingOutboxBatch(5), sendBookingEmails(...)])`.
   - Harden `src/lib/mailer.ts` with `AbortSignal.timeout(4000)` and `escapeHtml` user inputs.
7. **250-Line Architecture Hygiene:**
   - Extract `admin-tabs.ts` from `admin/page.tsx`; split `ServiceFormModal.tsx`, `CancelBookingModal.tsx`, `ClientRescheduleModal.tsx`, `ClientCancelModal.tsx`, and `PhoneBookingsBadge.tsx`; remove redundant `appointments.service.ts` and update test fixtures cleanly.

---

## Detailed Implementation Plan

### Step 1: Prisma Schema, Plan Quotas & Financial Payout Alignment
- Edit `prisma/schema.prisma`: apply minimal additive fields + `AvailabilityException` + `onDelete: Restrict` on `AppointmentBooking.service`.
- Run `npx prisma db push && npx prisma generate`.
- Update `prisma/seed-financials.ts`: add explicit `allowAppointments: false` on `free` and `allowAppointments: true` on `creator`, `pro`, `agency`; run seed update on `PlanQuota`.
- Update `src/features/settings/server/subscription.service.ts` & `src/features/dashboard/hooks/useDashboardPlan.ts` & `src/features/admin/components/payments/tabs/PlanQuotasSubTab.tsx` to expose `allowAppointments` & `storeCommissionRate`.
- Update `src/features/settings/server/payouts.service.ts`: include `"COMPLETED"` and snapshot `amountPaid`/`creatorNetAmount`.
- Update `src/features/webhooks/types/webhooks.types.ts` & `src/features/settings/components/profile/CreatorWebhooksCard.tsx` for `"booking.cancelled"` and `"booking.rescheduled"`.
- Add `AbortSignal.timeout(4000)` to `src/lib/mailer.ts`.

### Step 2: Modular Appointments Engine (`src/features/appointments/`)
- Delete obsolete `src/features/appointments/server/appointments.service.ts`.
- Create `src/features/appointments/utils/timezone.ts` ($\le 110$ lines).
- Update `src/features/appointments/types/appointments.types.ts` ($\le 105$ lines) & `src/features/appointments/validators/appointments.validator.ts` ($\le 120$ lines).
- Update `src/features/appointments/server/appointments.scheduler.ts` ($\le 185$ lines): unified slot calculation + server-side `assertSlotWithinCreatorSchedule`.
- Update `src/features/appointments/server/slot-locker.service.ts` ($\le 195$ lines): advisory lock (`1001, hashtext`), asymmetric buffer overlap, commission snapshot, SHA-256 `manageTokenHash`, transactional outbox write, meeting link resolution (`ONLINE` custom URL or high-entropy Jitsi fallback, `PHONE`, `IN_PERSON`), atomic `rescheduleBookingAtomic`, atomic `cancelBookingAtomic`, and hardened `confirmBookingAtomic`.
- Create `src/features/appointments/server/booking-notifications.service.ts` ($\le 130$ lines): escaped RTL HTML emails + `processPendingOutboxBatch`.
- Update `services.service.ts`, `availability.service.ts`, `bookings.service.ts`, `calendar-export.service.ts` (`meetingType`/`location`/`status`/`sequence`), and `index.ts`.

### Step 3: API Endpoints (`src/app/api/`)
- Update `/api/appointments/overview`, `/api/appointments/services`, `/api/appointments/services/[id]` (soft-archive if bookings exist + quota re-check), `/api/appointments/availability` (weekly rules + `timezone` + `POST`/`DELETE` blackout exceptions), `/api/appointments/bookings/[id]` (state transition matrix + notifications), `/api/appointments/[id]/calendar` (`token` / creator session guard).
- Update `/api/bio/[username]/appointments/slots` (creator timezone, blackout dates, weekday mask, currency-filtered enabled gateways).
- Update `/api/bio/[username]/appointments/book` (single-step gateway validation + schedule validation + quota check + atomic reserve/confirm + `manageToken` + notifications).
- Create `/api/bio/bookings/[id]/route.ts` (token-protected GET/PATCH reschedule & cancel).
- Create `/api/admin/bookings/route.ts` (`requireAdminSession`, platform stats, multi-currency summary, paginated list, cancel action).

### Step 4: Frontend Studio, Semantic Light/Dark Bio Card, Client Portal, Phone Mockup & Admin Tab
- Refactor `src/features/bio/components/booking/*` to use semantic Stitch tokens (`bg-surface-container/60`, `text-on-surface`, `text-primary`, `text-error`) + gateway picker for paid services + intake prompt/notes + creator timezone display.
- Update `src/features/bio/services/profile.service.ts` (`services` V2 fields + `timezone`) and `src/features/bio/components/BioPageContent.tsx`.
- Upgrade `/dashboard/bookings` studio (`ServiceFormModal.tsx`, `ServicesCatalogTab.tsx`, `CancelBookingModal.tsx`, `BookingsListTab.tsx`, `AvailabilityExceptionsCard.tsx`, `AvailabilityRulesTab.tsx`, `AppointmentsStudio.tsx`) + `AppointmentsDashboardCard.tsx`.
- Create public Client Portal `src/app/(public)/bookings/[id]/page.tsx` + `ClientBookingPortal.tsx` + `ClientRescheduleModal.tsx` + `ClientCancelModal.tsx`.
- Update `PhoneScreenContent.tsx` + `MobilePreview.tsx` + `dashboard/page.tsx` cleanly using `PhoneBookingsBadge.tsx`.
- Update `/admin`: extract `admin-tabs.ts` to keep `admin/page.tsx` $\le 235$ lines, add `"bookings"` to `AdminTabKey`, `AdminNavTabs.tsx`, `AdminSidebarNavList.tsx`, and create `src/features/admin/components/bookings/AdminBookingsTab.tsx`.

### Step 5: Verification Gate
- Update `tests/unit/appointments-locking.test.ts` and `tests/unit/appointments-locker.test.ts` for V2 contracts + add `tests/unit/appointments-timezone.test.ts` (DST/midnight/Riyadh/buffer/rollover) & V2 portal/theme checks.
- Verify `wc -l` across ALL files $\le 250$ lines.
- Run full `npx tsc --noEmit`, `npx vitest run`, and `npm run build`.
