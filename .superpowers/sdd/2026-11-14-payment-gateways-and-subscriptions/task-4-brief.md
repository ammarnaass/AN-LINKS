# Task 4 Brief: Client-Side State Management & Financial Admin Service

## Task Description
Implement Task 4 of the Payment Gateways & Subscriptions suite:
1. Client-side HTTP service in `src/features/admin/services/admin-financials.client.ts`.
2. React custom hook in `src/features/admin/hooks/useAdminFinancials.ts` managing the 6 sub-tabs, data loading, optimistic mutations, feedback messages, and error handling.
3. Unit tests in `tests/unit/admin-financials-client.test.ts`.
4. Export hook and client service in `src/features/admin/index.ts`.

## Files to touch:
- `src/features/admin/services/admin-financials.client.ts` [Create]
- `src/features/admin/hooks/useAdminFinancials.ts` [Create]
- `tests/unit/admin-financials-client.test.ts` [Create]
- `src/features/admin/index.ts` [Modify]

## Detailed Implementation Steps:
1. **Client Service (`src/features/admin/services/admin-financials.client.ts`):**
   - Provide typed API client wrapper around `fetch`:
     - `fetchFinancialOverview()`
     - `fetchAdminGateways()`
     - `updateAdminGateway(input: UpdateGatewayInput)`
     - `fetchAdminPlans()`
     - `upsertAdminPlan(input: UpsertPlanInput)`
     - `deleteAdminPlan(id: string)`
     - `updateAdminPlanQuotas(planId: string, quotas: Partial<AdminPlanQuotaConfig>)`
     - `fetchAdminCurrencies()`
     - `updateAdminCurrency(code: string, input: UpdateCurrencyInput)`
     - `fetchAdminCoupons()`
     - `createAdminCoupon(input: CreateCouponInput)`
     - `toggleAdminCoupon(id: string, isActive: boolean)`
     - `deleteAdminCoupon(id: string)`
     - `fetchAdminTransactions(query?: AdminTransactionsQuery)`
   - Graceful error handling (extracting `error` from json response on failure).

2. **Custom Hook (`src/features/admin/hooks/useAdminFinancials.ts`):**
   - `"use client";`
   - Define sub-tab type: `export type FinancialSubTab = "gateways" | "plans" | "quotas" | "currencies" | "coupons" | "transactions";`
   - State:
     - `activeSubTab`, `setActiveSubTab`
     - `overview`, `gateways`, `plans`, `currencies`, `coupons`, `transactions`
     - `isLoading`, `isSaving`, `error`, `feedback`
   - Functions:
     - `toggleGateway(id: string): Promise<boolean>` (optimistic update with rollback on failure)
     - `updateGatewayConfig(input: UpdateGatewayInput): Promise<boolean>`
     - `savePlan(input: UpsertPlanInput): Promise<boolean>`
     - `deletePlan(id: string): Promise<boolean>`
     - `saveQuotas(planId: string, quotas: Partial<AdminPlanQuotaConfig>): Promise<boolean>`
     - `saveCurrency(code: string, input: UpdateCurrencyInput): Promise<boolean>`
     - `createCoupon(input: CreateCouponInput): Promise<boolean>`
     - `toggleCoupon(id: string): Promise<boolean>`
     - `deleteCoupon(id: string): Promise<boolean>`
     - `refreshData(): Promise<void>`
     - `filterTransactions(query: AdminTransactionsQuery): Promise<void>`
   - Auto-fetch all data on initial mount with cleanup.

3. **Unit Tests (`tests/unit/admin-financials-client.test.ts`):**
   - Test client service API calls and error handling using mock `fetch`.
   - Verify proper request method, URL, headers, and body payloads.

4. **Exports in `src/features/admin/index.ts`:**
   - Export `* from "./services/admin-financials.client"` and `* from "./hooks/useAdminFinancials"`.

5. **Verification & Commit:**
   - `npx vitest run tests/unit/admin-financials-client.test.ts` passes.
   - `npx tsc --noEmit` passes with 0 errors.
   - `npm run test` passes with 0 regressions.
   - Commit: `git add src/ tests/ && git commit -m "feat(financials): implement client financial service and useAdminFinancials hook"`.

