import { PrismaClient } from "@prisma/client";

export async function seedFinancials(prisma: PrismaClient): Promise<void> {
  console.log("💳 Seeding Financial Management Data (Gateways, Currencies, Plans, Quotas)...");

  // 1. Seed Payment Gateways
  const gateways = [
    {
      code: "mada",
      nameAr: "مدى (بطاقات الخصم المباشر)",
      nameEn: "mada Debit Cards",
      category: "NATIONAL",
      isEnabled: true,
      isTestMode: true,
      publishableKey: "pk_test_mada_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_mada_dummy_sample",
      feePercentage: 1.0,
      feeFixed: 1.0,
      supportedCurrencies: ["SAR"],
      sortOrder: 1,
    },
    {
      code: "apple_pay",
      nameAr: "Apple Pay",
      nameEn: "Apple Pay",
      category: "WALLET",
      isEnabled: true,
      isTestMode: true,
      publishableKey: "pk_test_applepay_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_applepay_dummy_sample",
      feePercentage: 1.75,
      feeFixed: 1.0,
      supportedCurrencies: ["SAR", "AED", "USD", "EUR", "KWD"],
      sortOrder: 2,
    },
    {
      code: "stc_pay",
      nameAr: "STC Pay",
      nameEn: "STC Pay",
      category: "WALLET",
      isEnabled: true,
      isTestMode: true,
      publishableKey: "pk_test_stcpay_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_stcpay_dummy_sample",
      feePercentage: 1.5,
      feeFixed: 0.0,
      supportedCurrencies: ["SAR"],
      sortOrder: 3,
    },
    {
      code: "tamara",
      nameAr: "تمارا (قسمها على 4 دفعات)",
      nameEn: "Tamara Buy Now Pay Later",
      category: "BNPL",
      isEnabled: true,
      isTestMode: true,
      publishableKey: "pk_test_tamara_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_tamara_dummy_sample",
      feePercentage: 4.5,
      feeFixed: 1.5,
      supportedCurrencies: ["SAR", "AED", "KWD"],
      sortOrder: 4,
    },
    {
      code: "tabby",
      nameAr: "تابي (تسوق الآن وادفع لاحقاً)",
      nameEn: "Tabby BNPL",
      category: "BNPL",
      isEnabled: true,
      isTestMode: true,
      publishableKey: "pk_test_tabby_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_tabby_dummy_sample",
      feePercentage: 4.9,
      feeFixed: 1.0,
      supportedCurrencies: ["SAR", "AED", "KWD", "EGP"],
      sortOrder: 5,
    },
    {
      code: "stripe",
      nameAr: "Stripe (بطاقات ائتمانية عالمية)",
      nameEn: "Stripe International Cards",
      category: "INTERNATIONAL",
      isEnabled: true,
      isTestMode: true,
      publishableKey: "pk_test_stripe_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_stripe_dummy_sample",
      feePercentage: 2.9,
      feeFixed: 1.0,
      supportedCurrencies: ["USD", "EUR", "SAR", "AED", "EGP", "KWD"],
      sortOrder: 6,
    },
    {
      code: "paypal",
      nameAr: "PayPal (المحفظة الدولية)",
      nameEn: "PayPal Express Checkout",
      category: "INTERNATIONAL",
      isEnabled: false,
      isTestMode: true,
      publishableKey: "client_id_paypal_dummy_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_paypal_dummy_sample",
      feePercentage: 3.9,
      feeFixed: 1.5,
      supportedCurrencies: ["USD", "EUR"],
      sortOrder: 7,
    },
    {
      code: "fawry",
      nameAr: "فوري (المدفوعات المصرية)",
      nameEn: "Fawry Pay Egypt",
      category: "NATIONAL",
      isEnabled: false,
      isTestMode: true,
      publishableKey: "merchant_code_fawry_sample",
      secretKeyEncrypted: null,
      webhookSecret: "whsec_fawry_dummy_sample",
      feePercentage: 2.0,
      feeFixed: 2.0,
      supportedCurrencies: ["EGP"],
      sortOrder: 8,
    },
  ];

  for (const gw of gateways) {
    await prisma.paymentGateway.upsert({
      where: { code: gw.code },
      update: {
        nameAr: gw.nameAr,
        nameEn: gw.nameEn,
        category: gw.category,
        feePercentage: gw.feePercentage,
        feeFixed: gw.feeFixed,
        supportedCurrencies: gw.supportedCurrencies,
        sortOrder: gw.sortOrder,
      },
      create: gw,
    });
  }
  console.log(`✅ Seeded ${gateways.length} payment gateways.`);

  // 2. Seed Currencies
  const currencies = [
    {
      code: "SAR",
      nameAr: "ريال سعودي",
      symbol: "ر.س",
      exchangeRateToUSD: 0.2667,
      isBaseCurrency: true,
      isActive: true,
      autoDetectCountries: ["SA"],
    },
    {
      code: "AED",
      nameAr: "درهم إماراتي",
      symbol: "د.إ",
      exchangeRateToUSD: 0.2723,
      isBaseCurrency: false,
      isActive: true,
      autoDetectCountries: ["AE"],
    },
    {
      code: "KWD",
      nameAr: "دينار كويتي",
      symbol: "د.ك",
      exchangeRateToUSD: 3.25,
      isBaseCurrency: false,
      isActive: true,
      autoDetectCountries: ["KW"],
    },
    {
      code: "EGP",
      nameAr: "جنيه مصري",
      symbol: "ج.م",
      exchangeRateToUSD: 0.020,
      isBaseCurrency: false,
      isActive: true,
      autoDetectCountries: ["EG"],
    },
    {
      code: "USD",
      nameAr: "دولار أمريكي",
      symbol: "$",
      exchangeRateToUSD: 1.0,
      isBaseCurrency: false,
      isActive: true,
      autoDetectCountries: ["US"],
    },
    {
      code: "EUR",
      nameAr: "يورو أوروبي",
      symbol: "€",
      exchangeRateToUSD: 1.08,
      isBaseCurrency: false,
      isActive: true,
      autoDetectCountries: ["FR", "DE", "ES", "IT"],
    },
  ];

  for (const cur of currencies) {
    await prisma.currencyConfig.upsert({
      where: { code: cur.code },
      update: {
        nameAr: cur.nameAr,
        symbol: cur.symbol,
        exchangeRateToUSD: cur.exchangeRateToUSD,
        isBaseCurrency: cur.isBaseCurrency,
        isActive: cur.isActive,
        autoDetectCountries: cur.autoDetectCountries,
      },
      create: cur,
    });
  }
  console.log(`✅ Seeded ${currencies.length} currency configurations.`);

  // 3. Seed Subscription Plans, Quotas & Localized Prices
  const plans = [
    {
      slug: "free",
      nameAr: "الباقة المجانية",
      nameEn: "Free Plan",
      descriptionAr: "للانطلاق والبداية الشخصية بروابط أساسية وإحصائيات بسيطة",
      badgeAr: null,
      isActive: true,
      sortOrder: 1,
      quotas: {
        maxLinks: 5,
        allowCustomDomain: false,
        allowRemoveBranding: false,
        allowAdvancedThemes: false,
        allowDetailedAnalytics: false,
        allowPrioritySupport: false,
        customCssAllowed: false,
        allowAppointments: false,
        allowOutgoingWebhooks: false,
        allowAiCopilot: false,
        storeCommissionRate: 10.0,
      },
      prices: [
        { currency: "SAR", billingCycle: "MONTHLY", amount: 0.0, originalAmount: 0.0 },
        { currency: "SAR", billingCycle: "YEARLY", amount: 0.0, originalAmount: 0.0 },
        { currency: "USD", billingCycle: "MONTHLY", amount: 0.0, originalAmount: 0.0 },
        { currency: "USD", billingCycle: "YEARLY", amount: 0.0, originalAmount: 0.0 },
      ],
    },
    {
      slug: "creator",
      nameAr: "باقة صناع المحتوى",
      nameEn: "Creator Plan",
      descriptionAr: "مثالية للمؤثرين والمبدعين وأصحاب المتاجر الرقمية الناشئة",
      badgeAr: "الأكثر اختياراً",
      isActive: true,
      sortOrder: 2,
      quotas: {
        maxLinks: 25,
        allowCustomDomain: true,
        allowRemoveBranding: true,
        allowAdvancedThemes: true,
        allowDetailedAnalytics: true,
        allowPrioritySupport: false,
        customCssAllowed: false,
        allowAppointments: true,
        allowOutgoingWebhooks: false,
        allowAiCopilot: true,
        storeCommissionRate: 5.0,
      },
      prices: [
        { currency: "SAR", billingCycle: "MONTHLY", amount: 29.0, originalAmount: 39.0 },
        { currency: "SAR", billingCycle: "YEARLY", amount: 290.0, originalAmount: 348.0 },
        { currency: "USD", billingCycle: "MONTHLY", amount: 8.0, originalAmount: 11.0 },
        { currency: "USD", billingCycle: "YEARLY", amount: 80.0, originalAmount: 96.0 },
        { currency: "AED", billingCycle: "MONTHLY", amount: 29.0, originalAmount: 39.0 },
        { currency: "AED", billingCycle: "YEARLY", amount: 290.0, originalAmount: 348.0 },
        { currency: "EGP", billingCycle: "MONTHLY", amount: 390.0, originalAmount: 490.0 },
        { currency: "EGP", billingCycle: "YEARLY", amount: 3900.0, originalAmount: 4680.0 },
      ],
    },
    {
      slug: "pro",
      nameAr: "باقة المحترفين",
      nameEn: "Pro Plan",
      descriptionAr: "للمحترفين ورواد الأعمال مع تحليلات متقدمة ودعم أولوية",
      badgeAr: "الأكثر شعبية",
      isActive: true,
      sortOrder: 3,
      quotas: {
        maxLinks: 100,
        allowCustomDomain: true,
        allowRemoveBranding: true,
        allowAdvancedThemes: true,
        allowDetailedAnalytics: true,
        allowPrioritySupport: true,
        customCssAllowed: true,
        allowAppointments: true,
        allowOutgoingWebhooks: true,
        allowAiCopilot: true,
        storeCommissionRate: 2.5,
      },
      prices: [
        { currency: "SAR", billingCycle: "MONTHLY", amount: 49.0, originalAmount: 69.0 },
        { currency: "SAR", billingCycle: "YEARLY", amount: 490.0, originalAmount: 588.0 },
        { currency: "USD", billingCycle: "MONTHLY", amount: 14.0, originalAmount: 19.0 },
        { currency: "USD", billingCycle: "YEARLY", amount: 140.0, originalAmount: 168.0 },
        { currency: "AED", billingCycle: "MONTHLY", amount: 49.0, originalAmount: 69.0 },
        { currency: "AED", billingCycle: "YEARLY", amount: 490.0, originalAmount: 588.0 },
        { currency: "EGP", billingCycle: "MONTHLY", amount: 690.0, originalAmount: 890.0 },
        { currency: "EGP", billingCycle: "YEARLY", amount: 6900.0, originalAmount: 8280.0 },
      ],
    },
    {
      slug: "agency",
      nameAr: "باقة الوكالات والشركات",
      nameEn: "Agency Plan",
      descriptionAr: "حلول متكاملة لفرق العمل والوكالات مع روابط غير محدودة وأقل نسبة عمولة",
      badgeAr: "للشركات والفرق",
      isActive: true,
      sortOrder: 4,
      quotas: {
        maxLinks: 9999,
        allowCustomDomain: true,
        allowRemoveBranding: true,
        allowAdvancedThemes: true,
        allowDetailedAnalytics: true,
        allowPrioritySupport: true,
        customCssAllowed: true,
        allowAppointments: true,
        allowOutgoingWebhooks: true,
        allowAiCopilot: true,
        storeCommissionRate: 1.0,
      },
      prices: [
        { currency: "SAR", billingCycle: "MONTHLY", amount: 149.0, originalAmount: 199.0 },
        { currency: "SAR", billingCycle: "YEARLY", amount: 1490.0, originalAmount: 1788.0 },
        { currency: "USD", billingCycle: "MONTHLY", amount: 39.0, originalAmount: 55.0 },
        { currency: "USD", billingCycle: "YEARLY", amount: 390.0, originalAmount: 468.0 },
        { currency: "AED", billingCycle: "MONTHLY", amount: 149.0, originalAmount: 199.0 },
        { currency: "AED", billingCycle: "YEARLY", amount: 1490.0, originalAmount: 1788.0 },
        { currency: "EGP", billingCycle: "MONTHLY", amount: 1990.0, originalAmount: 2490.0 },
        { currency: "EGP", billingCycle: "YEARLY", amount: 19900.0, originalAmount: 23880.0 },
      ],
    },
  ];

  for (const p of plans) {
    const plan = await prisma.subscriptionPlan.upsert({
      where: { slug: p.slug },
      update: {
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionAr: p.descriptionAr,
        badgeAr: p.badgeAr,
        isActive: p.isActive,
        sortOrder: p.sortOrder,
      },
      create: {
        slug: p.slug,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionAr: p.descriptionAr,
        badgeAr: p.badgeAr,
        isActive: p.isActive,
        sortOrder: p.sortOrder,
      },
    });

    // Upsert Quota
    await prisma.planQuota.upsert({
      where: { planId: plan.id },
      update: p.quotas,
      create: {
        planId: plan.id,
        ...p.quotas,
      },
    });

    // Upsert Prices
    for (const pr of p.prices) {
      await prisma.planPrice.upsert({
        where: {
          planId_currency_billingCycle: {
            planId: plan.id,
            currency: pr.currency,
            billingCycle: pr.billingCycle,
          },
        },
        update: {
          amount: pr.amount,
          originalAmount: pr.originalAmount,
          isActive: true,
        },
        create: {
          planId: plan.id,
          currency: pr.currency,
          billingCycle: pr.billingCycle,
          amount: pr.amount,
          originalAmount: pr.originalAmount,
          isActive: true,
        },
      });
    }
  }
  console.log(`✅ Seeded ${plans.length} subscription plans with quotas & localized pricing.`);

  // 4. Seed Sample Promotional Coupon
  await prisma.promotionCoupon.upsert({
    where: { code: "LAUNCH50" },
    update: {
      discountType: "PERCENTAGE",
      discountValue: 50.0,
      maxUses: 500,
      maxUsesPerUser: 1,
      isActive: true,
      applicablePlanSlugs: ["creator", "pro", "agency"],
    },
    create: {
      code: "LAUNCH50",
      descriptionAr: "كوبون خصم الإطلاق الرسمي 50% لجميع الباقات المدفوعة",
      discountType: "PERCENTAGE",
      discountValue: 50.0,
      maxUses: 500,
      usedCount: 0,
      maxUsesPerUser: 1,
      isActive: true,
      applicablePlanSlugs: ["creator", "pro", "agency"],
    },
  });
  console.log("✅ Seeded promotional coupon: LAUNCH50 (50% OFF).");
}
