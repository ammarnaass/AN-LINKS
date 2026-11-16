# Task 1 Brief: Database Schema Expansion & Seed Script (Prisma & Migrations)

## Task Description
You are implementing Task 1 of the Payment Gateways & Subscriptions suite.

## Files to touch:
- `prisma/schema.prisma` [Modify]
- `prisma/seed-financials.ts` [Create]
- `prisma/seed.ts` [Modify]
- `.env.example` [Modify]

## Detailed Instructions:
1. Update `model User` in `prisma/schema.prisma` to add:
   ```prisma
   subscriptions UserSubscription[]
   invoices      FinancialInvoice[]
   auditLogs     FinancialAuditLog[]
   ```
2. Add the 9 financial models to `prisma/schema.prisma` exactly as specified in the spec:
   - `PaymentGateway`: id, code (unique), nameAr, nameEn, category, isEnabled, isTestMode, publishableKey, secretKeyEncrypted, webhookSecret, feePercentage, feeFixed, supportedCurrencies, sortOrder, createdAt, updatedAt.
   - `SubscriptionPlan`: id, slug (unique), nameAr, nameEn, descriptionAr, badgeAr, isActive, sortOrder, prices PlanPrice[], quotas PlanQuota?, subscriptions UserSubscription[], createdAt, updatedAt.
   - `PlanPrice`: id, planId, plan SubscriptionPlan @relation(fields: [planId], references: [id], onDelete: Cascade), currency, billingCycle, amount, originalAmount?, isActive, externalPriceId?, @@unique([planId, currency, billingCycle]).
   - `PlanQuota`: id, planId (unique), plan SubscriptionPlan @relation(fields: [planId], references: [id], onDelete: Cascade), maxLinks (default 10), allowCustomDomain (default false), allowRemoveBranding (default false), allowAdvancedThemes (default false), allowDetailedAnalytics (default false), allowPrioritySupport (default false), customCssAllowed (default false), storeCommissionRate (default 5.0).
   - `CurrencyConfig`: code (id), nameAr, symbol, exchangeRateToUSD, isBaseCurrency (default false), isActive (default true), autoDetectCountries String[], updatedAt.
   - `PromotionCoupon`: id, code (unique), descriptionAr, discountType, discountValue, maxUses?, usedCount (default 0), maxUsesPerUser (default 1), validFrom (default now()), validUntil?, isActive (default true), applicablePlanSlugs String[], createdAt (default now()).
   - `UserSubscription`: id, userId, user User @relation(fields: [userId], references: [id], onDelete: Cascade), planId, plan SubscriptionPlan @relation(fields: [planId], references: [id]), status (default "ACTIVE"), billingCycle, currency, amountPaid, couponCode?, gatewayCode, gatewaySubscriptionId?, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd (default false), createdAt, updatedAt.
   - `FinancialInvoice`: id, invoiceNumber (unique), userId, user User @relation(fields: [userId], references: [id], onDelete: Cascade), amountSubtotal, discountAmount (default 0.0), taxAmount (default 0.0), amountTotal, currency, gatewayCode, gatewayTxId?, status, pdfUrl?, createdAt (default now()).
   - `FinancialAuditLog`: id, adminId String, action String, entity String, entityId String?, details Json?, ipAddress String?, createdAt DateTime @default(now()), user User @relation(fields: [adminId], references: [id], onDelete: Cascade).
3. Validate schema: `npx prisma validate`.
4. Add `PAYMENT_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` to `.env.example`. If `.env` exists and lacks it, also ensure `.env` has it.
5. Create `prisma/seed-financials.ts` with an exported `async function seedFinancials(prisma: PrismaClient)`:
   - Upsert gateways (`mada`, `apple_pay`, `stc_pay`, `tamara`, `tabby`, `stripe`, `paypal`, `fawry`).
   - Upsert currencies (`SAR`, `AED`, `KWD`, `EGP`, `USD`, `EUR`).
   - Upsert plans (`free`, `creator`, `pro`, `agency`) with prices and quotas.
6. In `prisma/seed.ts`, import `seedFinancials` and execute it within the main seed function.
7. Apply schema to the database using `npx prisma db push` (or `npx prisma migrate dev`), then test seed with `npx tsx prisma/seed.ts` (or `npm run seed`).
8. Commit your changes: `git add prisma/ .env.example && git commit -m "feat(financials): expand prisma schema and seed script for payment gateways and plans"`.

