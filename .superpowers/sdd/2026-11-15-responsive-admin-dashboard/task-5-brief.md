# Task 5 Brief: Data Tables Overflow Audit & Package Exports

## Scope
1. Update `src/features/admin/index.ts` to export the new responsive sidebar hook and pull handle.
2. Ensure table elements in admin data tables have `min-w-[640px]` inside their `overflow-x-auto` wrappers to prevent column squishing on mobile screens:
   - `src/features/admin/components/AdminUsersTable.tsx`
   - `src/features/admin/components/AdminReportsTable.tsx`
   - `src/features/admin/components/payments/tabs/CouponsSubTab.tsx`
   - `src/features/admin/components/payments/tabs/CurrenciesSubTab.tsx`
   - `src/features/admin/components/payments/tabs/InvoicesTransactionsSubTab.tsx`

## Detailed Specification
1. **`src/features/admin/index.ts`:**
   Add:
   ```typescript
   export * from "./hooks/useAdminSidebar";
   export * from "./components/AdminSidebarPullHandle";
   ```

2. **Table Containers Min-Width Protection:**
   In each of the following files, ensure `<table className="w-full ...">` includes `min-w-[640px]`:
   - `AdminUsersTable.tsx`: `<table className="w-full min-w-[640px] text-right text-xs">`
   - `AdminReportsTable.tsx`: `<table className="w-full min-w-[640px] text-right text-xs">`
   - `CouponsSubTab.tsx`: `<table className="w-full min-w-[640px] text-right text-xs">`
   - `CurrenciesSubTab.tsx`: `<table className="w-full min-w-[640px] text-right text-xs">`
   - `InvoicesTransactionsSubTab.tsx`: `<table className="w-full min-w-[640px] text-right text-xs">`

3. **Verification:**
   - `npx tsc --noEmit`
   - `npx vitest run tests/unit/admin-financials-tabs.test.tsx`
   - `npx vitest run tests/integration/admin-sidebar-layout.test.ts`

