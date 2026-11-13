export interface DetailedFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  metrics: string;
  colorClass: string;
}

export const DETAILED_FEATURES: DetailedFeature[] = [
  {
    id: "link-sentinel",
    title: "فاحص الروابط الذكي (Link Sentinel)",
    subtitle: "حماية استباقية لروابطك على مدار الساعة",
    description: "فحص دوري آلي لجميع الروابط وتنبيهك فوراً عبر البريد أو الإشعارات في حال تعطل أي رابط، حتى لا تخسر عملاء أو زيارات.",
    badge: "مراقبة مستمرة",
    metrics: "دقة 99.9%",
    colorClass: "text-amber-400 bg-amber-400/10",
  },
  {
    id: "digital-commerce",
    title: "بيع المنتجات الرقمية والاستشارات",
    subtitle: "حوّل صفحة البايو إلى متجر إلكتروني متكامل",
    description: "بيع الكتب الرقمية، القوالب، الدورات، أو حجز جلسات الاستشارة 1:1 مع استقبال المدفوعات محلياً وعالمياً بدون تعقيد.",
    badge: "تجارة رقمية",
    metrics: "+40% مبيعات",
    colorClass: "text-primary bg-primary/10",
  },
  {
    id: "utm-analytics",
    title: "تحليلات عميقة خالية من البوتات",
    subtitle: "أرقام ونقرات حقيقية لقرارات تسويقية صائبة",
    description: "محرك إحصاءات يفلتر تلقائياً زواحف وبوتات تطبيقات إنستغرام وتيك توك، ليعرض لك الزيارات الفعلية مع تتبع مصادر UTM.",
    badge: "بيانات حقيقية",
    metrics: "100% بدون زيف",
    colorClass: "text-tertiary bg-tertiary/10",
  },
  {
    id: "bento-customization",
    title: "تصميم بينتو زجاجي وهوية متكاملة",
    subtitle: "أحدث اتجاهات التصميم العالمية بروح عربية",
    description: "قوالب بانتو داكنة وفاتحة تجمع بين الزجاج المضيء والخطوط العربية الأصيلة (IBM Plex Sans & Cairo) مع تحكم كامل بالحدود والأزرار.",
    badge: "هوية فاخرة",
    metrics: "9+ قوالب حصرية",
    colorClass: "text-secondary bg-secondary/10",
  },
  {
    id: "smart-scheduling",
    title: "جدولة ذكية وتوجيه جغرافي",
    subtitle: "أظهر الرابط المناسب للشخص المناسب في الوقت المناسب",
    description: "حدد مواعيد لبدء وانتهاء ظهور الروابط بالتزامن مع حملاتك الإعلانية، ووجّه الزوار حسب الدولة أو نوع الجهاز (iOS/Android).",
    badge: "استهداف دقيق",
    metrics: "توجيه ديناميكي",
    colorClass: "text-emerald-400 bg-emerald-400/10",
  },
  {
    id: "dynamic-qr",
    title: "رموز QR ديناميكية قابلة للتخصيص",
    subtitle: "جسرك من العالم الحقيقي إلى صفحتك الرقمية",
    description: "أنشئ وخصص رمز QR احترافي لطباعته على بطاقات العمل، المنتجات، أو المطبوعات مع إمكانية تحديث الوجهة دون إعادة الطباعة.",
    badge: "مشاركة فورية",
    metrics: "تصدير عالي الدقة",
    colorClass: "text-cyan-400 bg-cyan-400/10",
  },
  {
    id: "custom-domain",
    title: "ربط النطاق المخصص ومحسنات SEO",
    subtitle: "احجز علامتك التجارية المستقلة بالكامل",
    description: "اربط نطاقك الخاص (links.yourbrand.com) مع شهادة SSL تلقائية وأدوات OpenGraph وSEO لظهور مثالي في محركات البحث.",
    badge: "نطاق احترافي",
    metrics: "SSL تلقائي",
    colorClass: "text-indigo-400 bg-indigo-400/10",
  },
  {
    id: "tracking-pixels",
    title: "أدوات التتبع والبكسل الإعلاني",
    subtitle: "إعادة استهداف ذكية لزيادة عوائد إعلاناتك",
    description: "اربط معرّفات Meta Pixel و TikTok Pixel و Google Analytics بضغطة زر لبناء جماهير مخصصة لحملاتك الإعلانية القادمة.",
    badge: "إعلانات متقدمة",
    metrics: "ربط بنقرة واحدة",
    colorClass: "text-pink-400 bg-pink-400/10",
  },
];

export interface AlternativeComparisonRow {
  feature: string;
  rawabet: string;
  linktree: string;
  beacons: string;
}

export const GLOBAL_ALTERNATIVES_COMPARISON: AlternativeComparisonRow[] = [
  {
    feature: "دعم أصيل للغة العربية واتجاه RTL",
    rawabet: "100% أصلي مع خطوط عربية فاخرة",
    linktree: "محدود ويعتمد على ترجمة المتصفح",
    beacons: "تنسيق مكسور مع الخطوط العربية",
  },
  {
    feature: "فاحص الروابط التلقائي (Link Sentinel)",
    rawabet: "مدمج مع تنبيهات فورية مجانية",
    linktree: "غير متوفر",
    beacons: "غير متوفر",
  },
  {
    feature: "وسائل الدفع المحلية (مدى، Apple Pay)",
    rawabet: "مباشرة لحسابك البنكي المحلي",
    linktree: "تقتصر على Stripe وPayPal فقط",
    beacons: "عمولات تحويل دولية مرتفعة",
  },
  {
    feature: "استبعاد روبوتات التواصل من الإحصاءات",
    rawabet: "تصفية فورية لنقرات الزوار الفعليين",
    linktree: "تُحتسب البوتات كزيارات حقيقية",
    beacons: "إحصاءات تقريبية مبالغ فيها",
  },
  {
    feature: "سرعة تحميل الصفحة واستجابة الخادم",
    rawabet: "أقل من 80ms عبر شبكة Edge إقليمية",
    linktree: "350ms - 800ms من خوادم أمريكية",
    beacons: "بطيء بسبب السكريبتات الثقيلة",
  },
];
