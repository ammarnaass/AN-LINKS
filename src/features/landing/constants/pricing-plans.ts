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
      "روابط غير محدودة",
      "قالب بينتو الأساسي",
      "إحصاءات الزيارات لآخر 7 أيام",
      "تكامل 3 شبكات تواصل",
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
    priceMonthly: 24,
    priceYearly: 19,
    isPopular: true,
    description: "للمؤثرين والخبراء وصناع المحتوى المحترفين الباحثين عن أعلى معدل تحويل وأقوى تخصيص.",
    features: [
      "جميع مزايا البداية المجانية",
      "فاحص الروابط الذكي (Link Sentinel)",
      "بيع المنتجات الرقمية والاشتراكات",
      "تحليلات دقيقة خالية من البوتات (90 يوماً)",
      "إزالة علامة روابط المائية",
      "ربط نطاق مخصص (Custom Domain)",
      "تخصيص كامل للألوان والخطوط والأزرار",
      "دعم فني مباشر ذو أولوية",
    ],
    ctaText: "ابدأ التجربة المجانية (14 يوم)",
    ctaLink: "/register?plan=pro",
  },
  {
    id: "agency",
    name: "الأعمال والوكالات",
    tag: "للفرق والشركات",
    priceMonthly: 59,
    priceYearly: 47,
    description: "للشركات الناشئة، الوكالات الرقمية، والفرق الإبداعية التي تدير هويات متعددة بمستوى مؤسسي.",
    features: [
      "جميع مزايا صانع المحتوى المحترف",
      "إدارة حتى 5 صفحات بايو مستقلة",
      "فريق عمل غير محدود بصلاحيات دقيقة",
      "تكاملات Webhooks و Zapier",
      "تصدير تقارير التحليلات بصيغة CSV و PDF",
      "عقد مستوى خدمة موثوق (SLA 99.9%)",
      "مدير حساب مخصص وجلسات إرشادية",
    ],
    ctaText: "تواصل مع المبيعات",
    ctaLink: "/register?plan=agency",
  },
];

export function calculatePrice(plan: PricingPlan, isYearly: boolean): number {
  return isYearly ? plan.priceYearly : plan.priceMonthly;
}

export const COMPARISON_FEATURES: PricingComparisonRow[] = [
  { category: "الروابط والمحتوى", feature: "عدد الروابط", free: "غير محدود", pro: "غير محدود", agency: "غير محدود" },
  { category: "الروابط والمحتوى", feature: "فاحص الروابط التلقائي (Link Sentinel)", free: false, pro: true, agency: true },
  { category: "الروابط والمحتوى", feature: "تضمين الوسائط التفاعلية (يوتيوب، سبوتيفاي)", free: true, pro: true, agency: true },
  { category: "التجارة والتحويل", feature: "بيع المنتجات الرقمية والملفات", free: false, pro: "عمولة 5%", agency: "عمولة 2%" },
  { category: "التجارة والتحويل", feature: "حجز المواعيد والاستشارات 1:1", free: false, pro: true, agency: true },
  { category: "الهوية والتخصيص", feature: "قوالب بينتو المضيئة", free: "قالبين", pro: "كافة القوالب (9+)", agency: "قوالب مخصصة بالكامل" },
  { category: "الهوية والتخصيص", feature: "إزالة علامة روابط المائية", free: false, pro: true, agency: true },
  { category: "الهوية والتخصيص", feature: "ربط نطاق خاص (yourdomain.com)", free: false, pro: true, agency: true },
  { category: "التحليلات والأداء", feature: "تاريخ الاحتفاظ بالبيانات", free: "7 أيام", pro: "90 يوماً", agency: "سنتين" },
  { category: "التحليلات والأداء", feature: "تصفية روبوتات التواصل الاجتماعي", free: true, pro: true, agency: true },
  { category: "التحليلات والأداء", feature: "تصدير البيانات بصيغة CSV", free: false, pro: true, agency: true },
  { category: "الدعم والتعاون", feature: "أعضاء الفريق", free: "مستخدم واحد", pro: "مستخدم واحد", agency: "غير محدود" },
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
    question: "هل هناك فترة تجربة مجانية للخطط المدفوعة؟",
    answer: "نعم، نقدم فترة تجربة مجانية لمدة 14 يوماً لخطة المحترف دون الحاجة لبطاقة ائتمان مسبقة.",
  },
  {
    question: "كيف أستلم أرباح بيع المنتجات الرقمية والاستشارات؟",
    answer: "نربط حسابك مع Stripe ومقدمي الدفع المحليين في الشرق الأوسط لتحويل المبالغ مباشرة إلى حسابك البنكي.",
  },
];
