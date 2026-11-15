# Payment Gateways & Subscriptions Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive, modular financial and subscription management suite in the AN LINKS admin panel. Enable dynamic control over national (mada, STC Pay, Tamara, Tabby, Fawry) and international (Stripe, PayPal, Apple Pay) gateways, multi-currency localized pricing by country with auto-detection, dynamic subscription tiers and quota customization, promotions and discount coupons, and transactional invoice history with audit logging.

**Architecture:** Next.js 15 App Router with Feature Modular Structure (`src/features/admin/...`), Prisma 6 with PostgreSQL, tab-based admin container (`AdminFinancialsContainer`) with 6 sub-tabs, AES-256-GCM encryption for gateway API keys, and Vitest unit/integration tests.

**Spec Reference:** [docs/designs/payment-gateways-and-subscriptions.md](file:///home/ammar/AN%20LINKS/docs/designs/payment-gateways-and-subscriptions.md) and [implementation_readiness_report.md](file:///home/ammar/AN%20LINKS/implementation_readiness_report.md).

---

### Task 1: Database Schema Expansion & Seed Script (Prisma & Migrations)

**Files:**
- [Modify] `prisma/schema.prisma`
- [Create] `prisma/seed-financials.ts`
- [Modify] `prisma/seed.ts`
- [Modify] `.env.example`

**Steps:**
- [x] Update `model User` in `prisma/schema.prisma` to add opposing relations:
  ```prisma
  model User {
    // existing fields...
    subscriptions UserSubscription[]
    invoices      FinancialInvoice[]
    auditLogs     FinancialAuditLog[]
  }
  ```
- [x] Add the 9 new financial models to `prisma/schema.prisma`:
  - `PaymentGateway`
  - `SubscriptionPlan`
  - `PlanPrice`
  - `PlanQuota`
  - `CurrencyConfig`
  - `PromotionCoupon`
  - `UserSubscription`
  - `FinancialInvoice`
  - `FinancialAuditLog`
- [x] Add `PAYMENT_ENCRYPTION_KEY` to `.env.example` (32-byte hex/base64 key).
- [x] Run `npx prisma validate` to verify schema integrity.
- [x] Create `prisma/seed-financials.ts` with default seed data for:
  - Gateways: `mada`, `apple_pay`, `stc_pay`, `tamara`, `tabby`, `stripe`, `paypal`, `fawry`.
  - Currencies: `SAR` (base), `AED`, `KWD`, `EGP`, `USD`, `EUR`.
  - Plans: `free`, `creator`, `pro`, `agency` with localized prices in SAR and USD.
  - Quotas: link counts, custom domains, branding removal, analytics tiers.
- [x] Import and call `seedFinancials()` in `prisma/seed.ts`.
- [x] Run `npx prisma db push` or `npx prisma migrate dev --name init_financials_system` to apply changes to the database.

---

### Task 2: Core Cryptography & Type Definitions Contract

**Files:**
- [Create] `src/shared/lib/crypto.ts`
- [Create] `tests/unit/crypto.test.ts`
- [Modify] `src/features/admin/types/admin.types.ts`
- [Modify] `src/features/admin/index.ts`

**Steps:**
- [x] Write failing test in `tests/unit/crypto.test.ts` verifying AES-256-GCM encryption/decryption:
  - `encryptSecret(text: string): string` returns format `${ivHex}:${authTagHex}:${encryptedHex}`.
  - `decryptSecret(payload: string): string` returns original text.
  - Throws error if `PAYMENT_ENCRYPTION_KEY` is missing or invalid length.
- [x] Implement `src/shared/lib/crypto.ts` using Node.js built-in `crypto`.
- [x] Run tests with `npx vitest run tests/unit/crypto.test.ts` and verify they pass.
- [x] Expand `src/features/admin/types/admin.types.ts`:
  - Extend `GatewayId` to include `"tabby" | "fawry" | "stripe" | "paypal"`.
  - Add interfaces: `AdminGatewayDetails`, `AdminSubscriptionPlanItem`, `AdminPlanPriceItem`, `AdminPlanQuotaConfig`, `AdminCurrencyItem`, `AdminCouponItem`, `AdminAuditLogItem`.
  - Add mutation DTOs: `UpdateGatewayInput`, `UpsertPlanInput`, `UpsertQuotaInput`, `CreateCouponInput`, `UpdateCurrencyInput`.
- [x] Export new types in `src/features/admin/index.ts`.

---

### Task 3: Backend Financial Service & Admin API Endpoints

**Files:**
- [Create] `src/features/admin/server/admin-financials.service.ts`
- [Create] `src/app/api/admin/financials/overview/route.ts`
- [Create] `src/app/api/admin/financials/gateways/route.ts`
- [Create] `src/app/api/admin/financials/plans/route.ts`
- [Create] `src/app/api/admin/financials/plans/[id]/route.ts`
- [Create] `src/app/api/admin/financials/quotas/route.ts`
- [Create] `src/app/api/admin/financials/currencies/route.ts`
- [Create] `src/app/api/admin/financials/coupons/route.ts`
- [Create] `src/app/api/admin/financials/coupons/[id]/route.ts`
- [Create] `src/app/api/admin/financials/transactions/route.ts`
- [Create] `tests/unit/admin-financials-service.test.ts`

**Steps:**
- [x] Write failing test `tests/unit/admin-financials-service.test.ts` for database CRUD operations and audit log creation.
- [x] Implement `admin-financials.service.ts`:
  - `getFinancialOverview()`
  - `getGateways()`, `updateGateway(id, data, adminId)`
  - `getPlans()`, `upsertPlan(data, adminId)`, `deletePlan(id, adminId)`
  - `updateQuotas(planId, data, adminId)`
  - `getCurrencies()`, `updateCurrency(code, data, adminId)`
  - `getCoupons()`, `createCoupon(data, adminId)`, `toggleCoupon(id, active, adminId)`
  - `getTransactions(query)`
  - `logAuditAction(adminId, action, entity, details)`
- [x] Implement all corresponding Next.js Route Handlers (`GET`, `POST`, `PUT`, `DELETE`) with role-based auth checking `role === 'ADMIN'`.
- [x] Run `npx vitest run tests/unit/admin-financials-service.test.ts` and verify passing.

---

### Task 4: Client-Side State Management & Financial Admin Service

**Files:**
- [Create] `src/features/admin/services/admin-financials.client.ts`
- [Create] `src/features/admin/hooks/useAdminFinancials.ts`
- [Modify] `src/features/admin/index.ts`

**Steps:**
- [x] Implement `src/features/admin/services/admin-financials.client.ts` with typed `fetch` methods for all `/api/admin/financials/*` routes.
- [x] Implement `src/features/admin/hooks/useAdminFinancials.ts`:
  - Active sub-tab state (`"gateways" | "plans" | "quotas" | "currencies" | "coupons" | "transactions"`).
  - Fetched state: `overview`, `gateways`, `plans`, `currencies`, `coupons`, `transactions`.
  - Optimistic mutation helpers: `toggleGateway`, `savePlan`, `saveQuotas`, `saveCurrency`, `createCoupon`.
  - Loading and toast notification states.
- [x] Export hook and client service in `src/features/admin/index.ts`.

---

### Task 5: Sub-Tab Components & Modal Windows

**Files:**
- [Create] `src/features/admin/components/payments/tabs/GatewaysSubTab.tsx`
- [Create] `src/features/admin/components/payments/tabs/PlansSubTab.tsx`
- [Create] `src/features/admin/components/payments/tabs/PlanQuotasSubTab.tsx`
- [Create] `src/features/admin/components/payments/tabs/CurrenciesSubTab.tsx`
- [Create] `src/features/admin/components/payments/tabs/CouponsSubTab.tsx`
- [Create] `src/features/admin/components/payments/tabs/InvoicesTransactionsSubTab.tsx`
- [Create] `src/features/admin/components/payments/modals/GatewayConfigModal.tsx`
- [Create] `src/features/admin/components/payments/modals/PlanEditorModal.tsx`
- [Create] `src/features/admin/components/payments/modals/CouponEditorModal.tsx`
- [Create] `src/features/admin/components/payments/modals/CurrencyRateModal.tsx`

**Steps:**
- [x] Implement `GatewaysSubTab.tsx`: National & International sections, test/live mode badges, fee rate display, toggle button, and "Edit Keys" button opening `GatewayConfigModal`.
- [x] Implement `PlansSubTab.tsx`: Pricing comparison cards for each plan, monthly/yearly/lifetime toggles, badges, and "Add New Plan" button opening `PlanEditorModal`.
- [x] Implement `PlanQuotasSubTab.tsx`: Interactive limits matrix (max links, custom domain, branding removal, custom CSS, store commission fee) with batch save.
- [x] Implement `CurrenciesSubTab.tsx`: Currency exchange rates table, country auto-detect tags, default currency indicator, and "Edit Rate" button opening `CurrencyRateModal`.
- [x] Implement `CouponsSubTab.tsx`: Active discount codes table (code, discount %, usage limits, expiry date, status) and "Create Coupon" button opening `CouponEditorModal`.
- [x] Implement `InvoicesTransactionsSubTab.tsx`: Transactions log with search, filters (status, gateway, currency), and PDF download trigger.
- [x] Implement the 4 modal components with masked secret inputs, validation, and accessibility focus management.

---

### Task 6: Tabbed Container & Backwards-Compatible Integration

**Files:**
- [Create] `src/features/admin/components/payments/AdminFinancialsContainer.tsx`
- [Modify] `src/features/admin/components/AdminPaymentsTab.tsx`
- [Modify] `src/app/(admin)/admin/page.tsx`
- [Modify] `src/features/admin/index.ts`
- [Create] `tests/unit/admin-financials-ui.test.tsx`

**Steps:**
- [x] Implement `AdminFinancialsContainer.tsx` with responsive sub-tab navigation, badge counts, and active sub-tab view switching.
- [x] Refactor `AdminPaymentsTab.tsx` to mount `AdminFinancialsContainer`, maintaining backwards-compatible optional props `{ settings?, transactions?, onUpdateSettings? }`.
- [x] Verify `src/app/(admin)/admin/page.tsx` renders `AdminPaymentsTab` with zero layout shift or console errors.
- [x] Write unit test `tests/unit/admin-financials-ui.test.tsx` testing sub-tab switching and modal triggers.
- [x] Run `npx vitest run tests/unit/admin-financials-ui.test.tsx` and verify passing.

---

### Task 7: Public Subscription APIs & Webhook Processor

**Files:**
- [Create] `src/app/api/subscriptions/plans/route.ts`
- [Create] `src/app/api/subscriptions/validate-coupon/route.ts`
- [Create] `src/app/api/subscriptions/checkout/route.ts`
- [Create] `src/app/api/subscriptions/webhooks/[gateway]/route.ts`
- [Create] `tests/integration/payment-webhooks.test.ts`

**Steps:**
- [x] Implement `GET /api/subscriptions/plans`:
  - Inspect `cf-ipcountry` or `x-vercel-ip-country` header, fallback to `SA` / `SAR` on localhost.
  - Return active plans with localized prices and quotas.
- [x] Implement `POST /api/subscriptions/validate-coupon`:
  - Validate code existence, date range, max uses, and plan applicability.
  - Return discounted total.
- [x] Implement `POST /api/subscriptions/checkout`:
  - Initiate session with configured gateway adapter (Moyasar/Stripe/Tamara).
- [x] Implement `POST /api/subscriptions/webhooks/[gateway]`:
  - Read raw body via `await req.text()`.
  - Verify gateway signature.
  - Check idempotency on `gatewayTxId`.
  - Atomically activate subscription and generate invoice via `prisma.$transaction`.
- [x] Implement `tests/integration/payment-webhooks.test.ts` testing signature verification and idempotency handling.
- [x] Run all project tests: `npm run test` and `npm run build` to ensure 0 TypeScript or lint regressions.

