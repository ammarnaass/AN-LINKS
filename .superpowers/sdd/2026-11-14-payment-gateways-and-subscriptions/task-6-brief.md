# Task 6 Brief: Tabbed Container & Backwards-Compatible Integration

## Task Description
Implement Task 6 of the Payment Gateways & Subscriptions suite:
1. Create `AdminFinancialsContainer.tsx` under `src/features/admin/components/payments/AdminFinancialsContainer.tsx`.
   - Uses `useAdminFinancials()`.
   - Features responsive Arabic navigation tabs with icons (CreditCard, Package, Sliders, Globe, Tag, Receipt).
   - Features an overview statistics bar (Total/Active Gateways, Active Plans, Currencies, Active Coupons, Total Revenue).
   - Manages state for the 4 modals (`GatewayConfigModal`, `PlanEditorModal`, `CouponEditorModal`, `CurrencyRateModal`).
   - Renders the active sub-tab (`GatewaysSubTab`, `PlansSubTab`, `PlanQuotasSubTab`, `CurrenciesSubTab`, `CouponsSubTab`, `InvoicesTransactionsSubTab`).
2. Refactor `src/features/admin/components/AdminPaymentsTab.tsx`:
   - Keep `AdminPaymentsTabProps` with optional props `{ settings?, transactions?, onUpdateSettings? }`.
   - Mount `AdminFinancialsContainer`.
3. Export `AdminFinancialsContainer` in `src/features/admin/index.ts`.
4. Create comprehensive UI unit tests in `tests/unit/admin-financials-ui.test.tsx`:
   - Sub-tab switching between all 6 tabs.
   - Opening each modal dialog from its respective sub-tab.
   - Backward compatibility check when `AdminPaymentsTab` is mounted with or without props.
5. Verify TypeScript (`npx tsc --noEmit`), unit tests (`npx vitest run tests/unit/admin-financials-ui.test.tsx`), and regression (`npm run test`).
6. Commit: `git add src/ tests/ && git commit -m "feat(financials): implement AdminFinancialsContainer and integrate with AdminPaymentsTab"`.

