import { PricingPlan, PricingComparisonRow, FaqItem } from "../types/pricing.types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "البداية المجانية",
    tag: "للمبتدئين والمستكشفين",
    priceMonthly: 0,
    priceYearly: 0,
    description: "للأفراد وصناع المحتوى الناشئين الراغبين في بناء حضور رقمي أنيق وبدء تنظيم روابطهم.",
    features: [
      "5 روابط في الصفحة الرئيسية",
      "قالب بينتو الأساسي",
      "إحصاءات الزيارات لآخر 7 أيام",
      "تكامل شبكات التواصل الاجتماعي",
      "رمز QR ذكي للمشاركة",
      "دعم مجتمعي سريع",
    ],
    ctaText: "ابدأ مجاناً الآن",
    ctaLink: "/register",
  },
  {
    id: "pro",
    name: "صانع المحتوى المحترف",
    tag: "الخيار الأكثر شعبية",
    priceMonthly: 14,
    priceYearly: 12,
    isPopular: true,
    description: "للمؤثرين والخبراء وصناع المحتوى المحترفين الباحثين عن أعلى معدل تحويل وأقوى تخصيص.",
    features: [
      "جميع مزايا البداية المجانية حتى 100 رابط",
      "فاحص الروابط الذكي (Link Sentinel)",
      "بيع المنتجات الرقمية والاستشارات (عمولة 2.5%)",
      "تكاملات Webhooks ومساعد الذكاء الاصطناعي",
      "إزالة علامة روابط المائية",
      "ربط نطاق مخصص (Custom Domain)",
      "تخصيص كامل للألوان والخطوط والـ CSS",
      "دعم فني مباشر ذو أولوية",
    ],
    ctaText: "الترقية إلى باقة المحترفين",
    ctaLink: "/register?plan=pro",
  },
  {
    id: "agency",
    name: "الأعمال والوكالات",
    tag: "للفرق والشركات",
    priceMonthly: 39,
    priceYearly: 33,
    description: "للشركات الناشئة، الوكالات الرقمية، والفرق الإبداعية بإمكانات غير محدودة وأقل عمولة.",
    features: [
      "جميع مزايا صانع المحتوى المحترف بلا حدود",
      "روابط غير محدودة",
      "بيع المنتجات والخدمات بأقل عمولة (1%)",
      "تكاملات Webhooks و AI Copilot متقدمة",
      "تصدير تقارير التحليلات بصيغة CSV",
      "دعم فني خاص VIP واستقرار عالي",
      "مدير حساب مخصص وجلسات إرشادية",
    ],
    ctaText: "اختر باقة الوكالات",
    ctaLink: "/register?plan=agency",
  },
];

export function calculatePrice(plan: PricingPlan, isYearly: boolean): number {
  return isYearly ? plan.priceYearly : plan.priceMonthly;
}

export const COMPARISON_FEATURES: PricingComparisonRow[] = [
  { category: "الروابط والمحتوى", feature: "عدد الروابط", free: "حتى 5 روابط", pro: "حتى 100 رابط", agency: "غير محدود" },
  { category: "الروابط والمحتوى", feature: "فاحص الروابط التلقائي (Link Sentinel)", free: false, pro: true, agency: true },
  { category: "الروابط والمحتوى", feature: "تضمين الوسائط التفاعلية (يوتيوب، سبوتيفاي)", free: true, pro: true, agency: true },
  { category: "التجارة والتحويل", feature: "بيع المنتجات الرقمية والملفات", free: "عمولة 10%", pro: "عمولة 2.5%", agency: "عمولة 1%" },
  { category: "التجارة والتحويل", feature: "حجز المواعيد والاستشارات 1:1", free: false, pro: true, agency: true },
  { category: "الهوية والتخصيص", feature: "قوالب بينتو المضيئة", free: "قوالب أساسية", pro: "كافة القوالب", agency: "قوالب + CSS مخصص" },
  { category: "الهوية والتخصيص", feature: "إزالة علامة روابط المائية", free: false, pro: true, agency: true },
  { category: "الهوية والتخصيص", feature: "ربط نطاق خاص (yourdomain.com)", free: false, pro: true, agency: true },
  { category: "التحليلات والأداء", feature: "تصفية روبوتات التواصل الاجتماعي", free: true, pro: true, agency: true },
  { category: "التحليلات والأداء", feature: "تصدير البيانات بصيغة CSV", free: false, pro: true, agency: true },
  { category: "الأتمتة والربط", feature: "خطافات الويب (Webhooks) + AI Copilot", free: false, pro: true, agency: true },
];

export const PRICING_FAQS: FaqItem[] = [
  {
    question: "هل يمكنني الترقية أو تغيير الخطة في أي وقت؟",
    answer: "نعم، يمكنك الترقية أو النزول إلى خطة أخرى في أي وقت من لوحة التحكم، وسيتم احتساب الفارق النسبي تلقائياً.",
  },
  {
    question: "ما هو فاحص الروابط الذكي (Link Sentinel)؟",
    answer: "هو نظام مراقبة يعمل على مدار الساعة يفحص جميع الروابط في صفحتك، وفي حال تعطل أي رابط يرسل لك تنبيهاً فورياً لمنع خسارة الزيارات والعملاء.",
  },
  {
    question: "هل هناك خطط مدفوعة سنوية بتوفير مالي؟",
    answer: "نعم، الاشتراك السنوي يمنحك توفيراً حتى شهرين مجاناً على باقات صناع المحتوى والمحترفين والوكالات.",
  },
  {
    question: "كيف أستلم أرباح بيع المنتجات الرقمية والاستشارات؟",
    answer: "نربط حسابك مع Stripe ومقدمي الدفع المحليين في الشرق الأوسط لتحويل المبالغ مباشرة إلى حسابك البنكي.",
  },
];

