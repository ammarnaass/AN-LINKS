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

export const INITIAL_TRANSACTIONS: AdminTransaction[] = [];

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

