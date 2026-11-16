# Task 3 Brief: Backend Financial Service & Admin API Endpoints

## Task Description
Implement Task 3 of the Payment Gateways & Subscriptions suite:
1. Backend financial service in `src/features/admin/server/admin-financials.service.ts` using Prisma and the AES-256 crypto helper.
2. Next.js App Router API endpoints under `src/app/api/admin/financials/*` protected with `requireAdminSession()`.
3. Unit tests in `tests/unit/admin-financials-service.test.ts`.
4. Export service functions in `src/features/admin/index.ts`.

## Files to touch:
- `src/features/admin/server/admin-financials.service.ts` [Create]
- `src/app/api/admin/financials/overview/route.ts` [Create]
- `src/app/api/admin/financials/gateways/route.ts` [Create]
- `src/app/api/admin/financials/plans/route.ts` [Create]
- `src/app/api/admin/financials/plans/[id]/route.ts` [Create]
- `src/app/api/admin/financials/quotas/route.ts` [Create]
- `src/app/api/admin/financials/currencies/route.ts` [Create]
- `src/app/api/admin/financials/coupons/route.ts` [Create]
- `src/app/api/admin/financials/coupons/[id]/route.ts` [Create]
- `src/app/api/admin/financials/transactions/route.ts` [Create]
- `tests/unit/admin-financials-service.test.ts` [Create]
- `src/features/admin/index.ts` [Modify]

## Detailed Implementation Steps:
1. **Financial Service (`src/features/admin/server/admin-financials.service.ts`):**
   - Import `prisma` from `@/shared/db/prisma` (or `@/lib/prisma` or wherever prisma client is exported - check `src/shared/db`).
   - Import `encryptSecret`, `decryptSecret`, `maskSecret` from `@/shared/lib/crypto`.
   - Implement:
     - `getFinancialOverview()`: Returns summary stats (totalGateways, activeGateways, totalPlans, totalCurrencies, totalCoupons, totalInvoices, totalRevenue).
     - `getAdminGateways()`: Returns gateways formatted as `AdminGatewayDetails` with masked secret keys (`hasSecretKey: !!gw.secretKeyEncrypted`).
     - `updateAdminGateway(id: string, input: UpdateGatewayInput, adminId: string)`:
       - If `secretKey` is provided and not already masked (i.e. does not contain `••`), encrypt it with `encryptSecret(input.secretKey)` and store in `secretKeyEncrypted`.
       - If `webhookSecret` is provided and not masked, store it.
       - Log audit action via `logFinancialAudit(adminId, "UPDATE_GATEWAY", "PaymentGateway", id, { changed: Object.keys(input) })`.
     - `getAdminPlans()`: Returns plans with their prices, quotas, and subscriber counts formatted as `AdminSubscriptionPlanItem[]`.
     - `upsertAdminPlan(input: UpsertPlanInput, adminId: string)`:
       - Uses `prisma.$transaction` to create/update `SubscriptionPlan`, upsert `PlanQuota`, and upsert each `PlanPrice`.
       - Log audit action.
     - `deleteAdminPlan(id: string, adminId: string)`: Sets `isActive: false` (soft delete) or deletes if 0 subscribers.
     - `updateAdminPlanQuotas(planId: string, quotas: UpsertQuotaInput, adminId: string)`: Updates `PlanQuota`.
     - `getAdminCurrencies()`: Returns `CurrencyConfig` list.
     - `updateAdminCurrency(code: string, input: UpdateCurrencyInput, adminId: string)`: Updates currency rate/countries, logs audit action.
     - `getAdminCoupons()`: Returns `PromotionCoupon` list.
     - `createAdminCoupon(input: CreateCouponInput, adminId: string)`: Validates code uniqueness, creates coupon, logs audit action.
     - `toggleAdminCoupon(id: string, isActive: boolean, adminId: string)`: Toggles active status, logs audit action.
     - `deleteAdminCoupon(id: string, adminId: string)`: Deletes coupon, logs audit action.
     - `getAdminTransactions(query: { page?: number; limit?: number; status?: string; gateway?: string })`: Fetches paginated `FinancialInvoice` records with user displayName and email.
     - `logFinancialAudit(adminId: string, action: string, entity: string, entityId?: string, details?: any)`: Writes to `FinancialAuditLog`.

2. **Admin API Route Handlers:**
   - Every route MUST call `const guard = await requireAdminSession(); if (!guard.authorized) return guard.response;`
   - Use standard JSON responses: `{ success: true, ... }` or `{ success: false, error: "..." }`.
   - Pass `guard.user.id` as the `adminId` for audit logging on mutations.
   - Routes:
     - `GET /api/admin/financials/overview`
     - `GET /api/admin/financials/gateways`, `PUT /api/admin/financials/gateways`
     - `GET /api/admin/financials/plans`, `POST /api/admin/financials/plans`
     - `PUT /api/admin/financials/plans/[id]`, `DELETE /api/admin/financials/plans/[id]`
     - `PUT /api/admin/financials/quotas`
     - `GET /api/admin/financials/currencies`, `PUT /api/admin/financials/currencies`
     - `GET /api/admin/financials/coupons`, `POST /api/admin/financials/coupons`
     - `PATCH /api/admin/financials/coupons/[id]` (toggle), `DELETE /api/admin/financials/coupons/[id]`
     - `GET /api/admin/financials/transactions`

3. **Unit Tests (`tests/unit/admin-financials-service.test.ts`):**
   - Write unit tests verifying:
     - Gateway masking and encrypted secret updating.
     - Currency retrieval and rate updates.
     - Plan upsertion with prices and quotas.
     - Coupon creation and validation.
     - Audit log creation on financial mutations.

4. **Verification & Commit:**
   - `npx vitest run tests/unit/admin-financials-service.test.ts` passes.
   - `npx tsc --noEmit` passes with 0 errors.
   - `npm run test` passes with 0 regressions.
   - Commit: `git add src/ tests/ && git commit -m "feat(financials): implement backend financial service and admin api endpoints"`.

