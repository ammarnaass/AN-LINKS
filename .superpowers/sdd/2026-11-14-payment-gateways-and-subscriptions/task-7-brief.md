# Task 7 Brief: Public Subscription APIs & Webhook Processor

## Task Description
Implement the public subscription endpoints, coupon validation, checkout session creation, and gateway webhook listener with signature verification and idempotency handling.

## Files to touch:
- `src/app/api/subscriptions/plans/route.ts` [Create]
- `src/app/api/subscriptions/validate-coupon/route.ts` [Create]
- `src/app/api/subscriptions/checkout/route.ts` [Create]
- `src/app/api/subscriptions/webhooks/[gateway]/route.ts` [Create]
- `tests/integration/payment-webhooks.test.ts` [Create]

## Detailed Instructions:
1. **`GET /api/subscriptions/plans`**:
   - Resolve country from `cf-ipcountry`, `x-vercel-ip-country`, query param `?country=`, or fallback to `SA`.
   - Resolve active currency from `prisma.currencyConfig` matching `country` in `autoDetectCountries` or `isBaseCurrency: true` (SAR).
   - Fetch active plans (`isActive: true`) ordered by `sortOrder asc` with `prices` and `quotas`.
   - Return `{ success: true, country, currency: { code, symbol, exchangeRateToUSD }, plans }`.

2. **`POST /api/subscriptions/validate-coupon`**:
   - Body: `{ code: string; planSlug?: string; amount?: number }`.
   - Normalizes code to uppercase.
   - Validates existence, `isActive`, date range (`validFrom` / `validUntil`), and `maxUses`.
   - If `planSlug` is provided, ensures coupon is allowed for that plan.
   - Calculates `discountAmount` and `finalAmount`.
   - Returns `{ success: true, valid: true, coupon: { code, discountType, discountValue }, discountAmount, finalAmount }`.
   - If invalid, returns `{ success: false, valid: false, error: "..." }` with 400 status.

3. **`POST /api/subscriptions/checkout`**:
   - Session authentication via `getServerSession(authOptions)`. If unauthorized, return 401.
   - Body: `{ planId: string; billingCycle: "MONTHLY" | "YEARLY"; currency?: string; couponCode?: string; gatewayCode: string }`.
   - Validate plan, verify gateway is enabled (`prisma.paymentGateway.findUnique({ where: { code: gatewayCode } })`).
   - Calculate amount, apply coupon if provided.
   - Generate unique transaction number `INV-${Date.now()}` and `gatewayTxId: tx_${gatewayCode}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`.
   - Create pending `FinancialInvoice`.
   - Return `{ success: true, checkoutUrl: "/checkout/session/" + invoice.id, invoice: { id: invoice.id, invoiceNumber: invoice.invoiceNumber, amountTotal: invoice.amountTotal, currency: invoice.currency }, gatewayTxId }`.

4. **`POST /api/subscriptions/webhooks/[gateway]`**:
   - Read raw text via `await req.text()`.
   - Parse JSON payload.
   - Resolve gateway from `params: Promise<{ gateway: string }>`.
   - Check webhook signature or token if configured (`x-signature` header or payload secret).
   - Idempotency check:
     - Check if `prisma.financialInvoice.findFirst({ where: { gatewayTxId, status: "PAID" } })` exists.
     - If exists, immediately return `NextResponse.json({ received: true, idempotent: true }, { status: 200 })`.
   - Inside `prisma.$transaction`:
     - Update invoice status to `PAID`.
     - Upsert `UserSubscription`:
       - `userId`: invoice.userId
       - `planId`: planId
       - `status`: "ACTIVE"
       - `billingCycle`: billingCycle || "MONTHLY"
       - `currency`: invoice.currency
       - `amountPaid`: invoice.amountTotal
       - `gatewayCode`: gateway
       - `currentPeriodStart`: new Date()
       - `currentPeriodEnd`: 30 days ahead (or 365 days for YEARLY)
     - Update user `role` to `"PRO"` if plan is paid (`slug !== "free"`).
     - If coupon was used, increment `PromotionCoupon.usedCount`.
   - Return `{ success: true, processed: true }`.

5. **Integration Tests (`tests/integration/payment-webhooks.test.ts`)**:
   - Tests `GET /api/subscriptions/plans` with country header or fallback.
   - Tests `POST /api/subscriptions/validate-coupon` for percentage and fixed amount discounts, plus rejection of invalid codes.
   - Tests `POST /api/subscriptions/checkout` for authenticated user.
   - Tests `POST /api/subscriptions/webhooks/[gateway]` testing:
     - Signature/secret verification.
     - Successful user subscription activation.
     - Idempotency on repeated webhook calls with identical `gatewayTxId` (returns HTTP 200 without duplicate processing).

6. **Validation & Full Build:**
   - Run `npx vitest run tests/integration/payment-webhooks.test.ts`.
   - Run `npx tsc --noEmit`.
   - Run `npm run test` (all tests pass).
   - Run `npm run build` (production build passes).
   - Commit: `git add src/ tests/ && git commit -m "feat(financials): implement public subscription apis and webhook processor"`.

