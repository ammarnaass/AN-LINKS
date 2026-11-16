# Task 5 Brief: Sub-Tab Components & Modal Windows

## Task Description
Implement Task 5 of the Payment Gateways & Subscriptions suite:
Create the 6 specialized sub-tabs and 4 modal dialogs under `src/features/admin/components/payments/` with complete RTL support, Lucide icons, dark/light theme tokens, and accessibility.

## Files to touch:
- `src/features/admin/components/payments/tabs/GatewaysSubTab.tsx` [Create]
- `src/features/admin/components/payments/tabs/PlansSubTab.tsx` [Create]
- `src/features/admin/components/payments/tabs/PlanQuotasSubTab.tsx` [Create]
- `src/features/admin/components/payments/tabs/CurrenciesSubTab.tsx` [Create]
- `src/features/admin/components/payments/tabs/CouponsSubTab.tsx` [Create]
- `src/features/admin/components/payments/tabs/InvoicesTransactionsSubTab.tsx` [Create]
- `src/features/admin/components/payments/modals/GatewayConfigModal.tsx` [Create]
- `src/features/admin/components/payments/modals/PlanEditorModal.tsx` [Create]
- `src/features/admin/components/payments/modals/CouponEditorModal.tsx` [Create]
- `src/features/admin/components/payments/modals/CurrencyRateModal.tsx` [Create]
- `tests/unit/admin-financials-tabs.test.tsx` [Create]
- `src/features/admin/index.ts` [Modify]

## Detailed Implementation Steps:
1. **Sub-Tabs (`src/features/admin/components/payments/tabs/`):**
   - **`GatewaysSubTab.tsx`**:
     - Visual grid divided into "بوابات الدفع الوطنية (السعودية والخليج ومصر)" and "بوابات الدفع العالمية والبطاقات".
     - Gateway cards with icons (Mada, STC Pay, Tamara, Tabby, Fawry, Visa/Mastercard, Apple Pay, Stripe, PayPal).
     - Badges for status ("مفعلة" / "معطلة") and environment ("تجريبي" / "حي").
     - Shows transaction fees and supported currencies.
     - Toggle gateway button and "إعداد المفاتيح والربط" button opening `GatewayConfigModal`.
   - **`PlansSubTab.tsx`**:
     - Header with "إضافة باقة جديدة" button opening `PlanEditorModal`.
     - Cycle selector (شهري / سنوي).
     - Cards for each plan (Free, Creator, Pro, Agency) displaying prices in SAR and USD, badges ("الأكثر شعبية", "عرض خاص"), quota highlights, and action buttons ("تعديل الباقة", "أرشفة/حذف").
   - **`PlanQuotasSubTab.tsx`**:
     - Plan selector tab/pills.
     - Form controls for plan limits: max links, allow custom domain, remove branding, advanced themes, detailed analytics, priority support, custom CSS, store commission rate (%).
     - "حفظ التخصيص والمحددات" button with loading/saving state.
   - **`CurrenciesSubTab.tsx`**:
     - Table of configured currencies (SAR, AED, KWD, EGP, USD, EUR) showing code, nameAr, symbol, exchange rate to USD, base currency badge, auto-detected countries tags.
     - "تعديل سعر الصرف" button opening `CurrencyRateModal`.
   - **`CouponsSubTab.tsx`**:
     - Header with "إنشاء كود خصم" button opening `CouponEditorModal`.
     - Table of coupons: code, discount value (% or fixed amount), usage counter (used / max), validity dates, status toggle, and delete button.
   - **`InvoicesTransactionsSubTab.tsx`**:
     - Search and filter bar (filter by status: PAID, FAILED, REFUNDED; filter by gateway).
     - Table showing invoiceNumber, customer name & email, amount & currency, gateway, status badge, date, and print/download button.

2. **Modals (`src/features/admin/components/payments/modals/`):**
   - Backdrop overlay with exit on ESC and outside click.
   - **`GatewayConfigModal.tsx`**:
     - Inputs for publishableKey, secretKey (with mask indicator), webhookSecret, isTestMode toggle, feePercentage, feeFixed.
   - **`PlanEditorModal.tsx`**:
     - Inputs for slug, nameAr, nameEn, descriptionAr, badgeAr, sortOrder, isActive.
     - Pricing matrix: monthly and yearly prices in SAR, USD, AED, EGP.
   - **`CouponEditorModal.tsx`**:
     - Code, discountType, discountValue, maxUses, maxUsesPerUser, validFrom, validUntil, applicable plans multi-select.
   - **`CurrencyRateModal.tsx`**:
     - Symbol, nameAr, exchangeRateToUSD, autoDetectCountries (comma-separated), isActive.

3. **Module Exports:**
   - Export sub-tabs and modals in `src/features/admin/index.ts`.

4. **Unit Tests (`tests/unit/admin-financials-tabs.test.tsx`):**
   - Test rendering of `GatewaysSubTab`, `PlansSubTab`, `CouponsSubTab`, and modal opening/closing.

5. **Verification & Commit:**
   - `npx vitest run tests/unit/admin-financials-tabs.test.tsx` passes.
   - `npx tsc --noEmit` passes with 0 errors.
   - `npm run test` passes with 0 regressions.
   - Commit: `git add src/ tests/ && git commit -m "feat(financials): implement financial sub-tabs and modal dialogs"`.

