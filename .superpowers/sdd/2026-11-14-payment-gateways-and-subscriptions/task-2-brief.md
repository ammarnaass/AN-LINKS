# Task 2 Brief: Core Cryptography & Type Definitions Contract

## Task Description
Implement Task 2 of the Payment Gateways & Subscriptions suite:
1. Cryptography helper with TDD (`encryptSecret` and `decryptSecret` using AES-256-GCM).
2. Comprehensive TypeScript contract in `src/features/admin/types/admin.types.ts` and export it through `src/features/admin/index.ts`.

## Files to touch:
- `src/shared/lib/crypto.ts` [Create]
- `tests/unit/crypto.test.ts` [Create]
- `src/features/admin/types/admin.types.ts` [Modify]
- `src/features/admin/index.ts` [Modify]

## Detailed Instructions:
1. **TDD Cryptography:**
   - Create `tests/unit/crypto.test.ts` with test cases:
     - Encrypts plaintext and returns format `${ivHex}:${authTagHex}:${encryptedHex}`.
     - Decrypts valid ciphertext back to original plaintext.
     - Handles empty string, special characters, Arabic strings, and long API keys (`sk_live_...`).
     - Throws an informative error if payload format is malformed or tampering occurs.
     - Throws an error if `PAYMENT_ENCRYPTION_KEY` environment variable is not 32 bytes (64 hex characters or 32 raw bytes).
   - Implement `src/shared/lib/crypto.ts` using Node's `node:crypto`:
     - `export function encryptSecret(plainText: string): string`
     - `export function decryptSecret(cipherPayload: string): string`
     - `export function maskSecret(secret: string): string` (e.g. `sk_live_••••••••3a8f`)
   - Run `npx vitest run tests/unit/crypto.test.ts` and ensure all tests pass.

2. **TypeScript Types (`src/features/admin/types/admin.types.ts`):**
   - Extend `GatewayId`:
     ```ts
     export type GatewayId = "mada" | "apple_pay" | "visa_mastercard" | "stc_pay" | "tamara" | "tabby" | "fawry" | "stripe" | "paypal";
     ```
   - Add financial gateway details:
     ```ts
     export interface AdminGatewayDetails {
       id: string;
       code: GatewayId | string;
       nameAr: string;
       nameEn: string;
       category: "NATIONAL" | "INTERNATIONAL" | "BNPL" | "WALLET";
       isEnabled: boolean;
       isTestMode: boolean;
       publishableKey: string | null;
       hasSecretKey: boolean; // secret is masked for security
       hasWebhookSecret: boolean;
       feePercentage: number;
       feeFixed: number;
       supportedCurrencies: string[];
       sortOrder: number;
       updatedAt: string;
     }
     ```
   - Add plan and pricing types:
     ```ts
     export interface AdminPlanPriceItem {
       id?: string;
       currency: string;
       billingCycle: "MONTHLY" | "YEARLY" | "LIFETIME";
       amount: number;
       originalAmount?: number | null;
       isActive: boolean;
     }

     export interface AdminPlanQuotaConfig {
       maxLinks: number;
       allowCustomDomain: boolean;
       allowRemoveBranding: boolean;
       allowAdvancedThemes: boolean;
       allowDetailedAnalytics: boolean;
       allowPrioritySupport: boolean;
       customCssAllowed: boolean;
       storeCommissionRate: number;
     }

     export interface AdminSubscriptionPlanItem {
       id: string;
       slug: string;
       nameAr: string;
       nameEn: string;
       descriptionAr?: string | null;
       badgeAr?: string | null;
       isActive: boolean;
       sortOrder: number;
       prices: AdminPlanPriceItem[];
       quotas: AdminPlanQuotaConfig;
       subscribersCount?: number;
     }
     ```
   - Add currency and coupon types:
     ```ts
     export interface AdminCurrencyItem {
       code: string;
       nameAr: string;
       symbol: string;
       exchangeRateToUSD: number;
       isBaseCurrency: boolean;
       isActive: boolean;
       autoDetectCountries: string[];
       updatedAt: string;
     }

     export interface AdminCouponItem {
       id: string;
       code: string;
       descriptionAr?: string | null;
       discountType: "PERCENTAGE" | "FIXED_AMOUNT";
       discountValue: number;
       maxUses?: number | null;
       usedCount: number;
       maxUsesPerUser: number;
       validFrom: string;
       validUntil?: string | null;
       isActive: boolean;
       applicablePlanSlugs: string[];
       createdAt: string;
     }
     ```
   - Add Audit Log item:
     ```ts
     export interface AdminAuditLogItem {
       id: string;
       adminId: string;
       adminEmail?: string;
       action: string;
       entity: string;
       entityId?: string | null;
       details?: Record<string, unknown> | null;
       createdAt: string;
     }
     ```
   - Add DTO inputs for mutations:
     ```ts
     export interface UpdateGatewayInput {
       id: string;
       isEnabled?: boolean;
       isTestMode?: boolean;
       publishableKey?: string;
       secretKey?: string;
       webhookSecret?: string;
       feePercentage?: number;
       feeFixed?: number;
       supportedCurrencies?: string[];
     }

     export interface UpsertPlanInput {
       id?: string;
       slug: string;
       nameAr: string;
       nameEn: string;
       descriptionAr?: string;
       badgeAr?: string;
       isActive?: boolean;
       sortOrder?: number;
       prices?: AdminPlanPriceItem[];
       quotas?: Partial<AdminPlanQuotaConfig>;
     }

     export interface UpdateCurrencyInput {
       code: string;
       nameAr?: string;
       symbol?: string;
       exchangeRateToUSD?: number;
       isActive?: boolean;
       autoDetectCountries?: string[];
     }

     export interface CreateCouponInput {
       code: string;
       descriptionAr?: string;
       discountType: "PERCENTAGE" | "FIXED_AMOUNT";
       discountValue: number;
       maxUses?: number;
       maxUsesPerUser?: number;
       validFrom?: string;
       validUntil?: string;
       applicablePlanSlugs?: string[];
     }
     ```
3. **Exports in `src/features/admin/index.ts`:**
   - Export all new types and `src/shared/lib/crypto.ts` functions.
4. **Validation:**
   - `npx vitest run tests/unit/crypto.test.ts` passes.
   - `npx tsc --noEmit` passes with 0 errors.
   - `npm run test` passes with 0 regressions.
5. **Commit:**
   - Commit changes: `git add src/ tests/ && git commit -m "feat(financials): add AES-256-GCM cryptography and financial admin types contract"`.

