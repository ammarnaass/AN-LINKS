import { AdminPlatformSettings, AdminGatewayConfig, AdminTransaction, GatewayId } from "../types/admin.types";

export const DEFAULT_GATEWAYS: Record<GatewayId, AdminGatewayConfig> = {
  mada: {
    id: "mada",
    name: "Mada",
    nameAr: "مدى (Mada)",
    descriptionAr: "شبكة المدفوعات الوطنية السعودية لبطاقات الخصم المباشر",
    icon: "credit-card",
    isEnabled: true,
    isTestMode: false,
    publishableKey: "pk_live_mada_sa_8849204128",
    secretKey: "sk_live_mada_sec_************",
    webhookSecret: "whsec_mada_live_9921",
  },
  apple_pay: {
    id: "apple_pay",
    name: "Apple Pay",
    nameAr: "Apple Pay",
    descriptionAr: "الدفع السريع بلمسة واحدة أو Face ID عبر كافة أجهزة Apple",
    icon: "smartphone",
    isEnabled: true,
    isTestMode: false,
    publishableKey: "merchant.sa.anlinks.pay",
    secretKey: "sk_live_apple_cert_************",
    webhookSecret: "whsec_apple_live_4431",
  },
  visa_mastercard: {
    id: "visa_mastercard",
    name: "Visa & Mastercard",
    nameAr: "فيزا وماستركارد",
    descriptionAr: "قبول البطاقات الائتمانية الدولية والمحلية بأعلى معايير 3D Secure",
    icon: "credit-card",
    isEnabled: true,
    isTestMode: false,
    publishableKey: "pk_live_stripe_51Nz849201",
    secretKey: "sk_live_stripe_sec_************",
    webhookSecret: "whsec_stripe_live_7721",
  },
  stc_pay: {
    id: "stc_pay",
    name: "STC Pay",
    nameAr: "STC Pay",
    descriptionAr: "المحفظة الرقمية الأكثر استخداماً في المملكة العربية السعودية",
    icon: "wallet",
    isEnabled: true,
    isTestMode: false,
    publishableKey: "stc_merch_id_990142",
    secretKey: "sk_live_stc_sec_************",
    webhookSecret: "whsec_stc_live_1120",
  },
  tamara: {
    id: "tamara",
    name: "Tamara",
    nameAr: "تمارا (Tamara)",
    descriptionAr: "خدمة اشتري الآن وادفع لاحقاً (قسّمها على 3 أو 4 دفعات)",
    icon: "calendar-check",
    isEnabled: false,
    isTestMode: true,
    publishableKey: "tamara_test_pub_440192",
    secretKey: "tamara_test_sec_************",
    webhookSecret: "whsec_tamara_test_5532",
  },
};

export const DEFAULT_PLATFORM_SETTINGS: AdminPlatformSettings = {
  siteName: "روابط | AN LINKS",
  supportEmail: "support@anlinks.dev",
  canonicalDomain: "rawabet.me",
  maintenanceMode: false,
  maintenanceMessage: "المنصة تخضع لصيانة دورية مجدولة وسنعود للعمل خلال دقائق.",
  allowRegistration: true,
  rateLimitMaxAttempts: 5,
  linkSentinelActive: true,
  pricing: {
    proMonthlyPrice: 39,
    proYearlyPrice: 349,
    storeCommissionRate: 5,
  },
  gateways: DEFAULT_GATEWAYS,
};

export const INITIAL_TRANSACTIONS: AdminTransaction[] = [
  {
    id: "tx-1",
    transactionNumber: "TX-2026-9901",
    customerName: "سارة العتيبي",
    customerEmail: "sara@design.sa",
    amount: 349,
    currency: "SAR",
    gateway: "apple_pay",
    plan: "PRO_YEARLY",
    status: "COMPLETED",
    createdAt: "2026-11-14T10:30:00Z",
  },
  {
    id: "tx-2",
    transactionNumber: "TX-2026-9902",
    customerName: "فيصل الشمري",
    customerEmail: "client@anlinks.dev",
    amount: 39,
    currency: "SAR",
    gateway: "mada",
    plan: "PRO_MONTHLY",
    status: "COMPLETED",
    createdAt: "2026-11-14T08:15:00Z",
  },
  {
    id: "tx-3",
    transactionNumber: "TX-2026-9903",
    customerName: "محمد الدوسري",
    customerEmail: "mohammed@tech.sa",
    amount: 39,
    currency: "SAR",
    gateway: "stc_pay",
    plan: "PRO_MONTHLY",
    status: "COMPLETED",
    createdAt: "2026-11-13T16:45:00Z",
  },
  {
    id: "tx-4",
    transactionNumber: "TX-2026-9904",
    customerName: "أروى القحطاني",
    customerEmail: "arwa@creative.sa",
    amount: 349,
    currency: "SAR",
    gateway: "visa_mastercard",
    plan: "PRO_YEARLY",
    status: "COMPLETED",
    createdAt: "2026-11-12T12:00:00Z",
  },
];

// Stateful module store (in-memory persistent across requests in runtime)
export let statefulSettings: AdminPlatformSettings = JSON.parse(
  JSON.stringify(DEFAULT_PLATFORM_SETTINGS)
);

export let statefulTransactions: AdminTransaction[] = [...INITIAL_TRANSACTIONS];

export function getStatefulSettings(): AdminPlatformSettings {
  return statefulSettings;
}

export function updateStatefulSettings(
  partial: Partial<AdminPlatformSettings>
): AdminPlatformSettings {
  statefulSettings = {
    ...statefulSettings,
    ...partial,
    pricing: {
      ...statefulSettings.pricing,
      ...(partial.pricing || {}),
    },
    gateways: {
      ...statefulSettings.gateways,
      ...(partial.gateways || {}),
    },
  };
  return statefulSettings;
}
