export interface LandingTestimonial {
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  badge: string;
}

export const LANDING_TESTIMONIALS: LandingTestimonial[] = [
  {
    name: "د. هتان بن خالد",
    role: "مستشار ومؤلف رقمي",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "ميزة التنبيه عند تعطل أي رابط أنقذتني في حملة إطلاق دورتي التدريبية الأخيرة. تم إشعاري فوراً وقمت بتصحيح الرابط دون خسارة أي مبيعة أو زائر مهتم.",
    badge: "مؤلف الأكثر مبيعاً",
  },
  {
    name: "ريم السليمان",
    role: "مؤسسة براند مجوهرات وحلي فاخرة",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "أفضل تجربة RTL على الإطلاق. الخطوط العربية مريحة للعين، وتصميم البانتو يعطي انطباعاً راقياً يوازي كبرى البراندات العالمية ورفع معدل النقر بنسبة 45%.",
    badge: "تجارة إلكترونية",
  },
  {
    name: "م. طارق العسيري",
    role: "بودكاستر وصانع محتوى تقني",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "سهولة إضافة وبيع المنتجات الرقمية مباشرة من صفحة البايو ضاعفت دخلي الشهري بنسبة 35% في أول شهر فقط دون الحاجة لمنصة متجر منفصلة.",
    badge: "بودكاست +500K",
  },
];

export interface LandingFaq {
  question: string;
  answer: string;
}

export const LANDING_FAQS: LandingFaq[] = [
  {
    question: "كيف يختلف «روابط» عن Linktree والبدائل الأجنبية؟",
    answer: "تم بناء المنصة من الصفر لتكون عربية 100% بنظام RTL أصيل، مع فاحص ذكي للروابط (Link Sentinel) يكتشف الروابط المعطلة تلقائياً، وإمكانية بيع المنتجات الرقمية واستقبال المدفوعات المحلية (مدى، Apple Pay).",
  },
  {
    question: "هل يمكنني ربط دومين خاص باسم علامتي التجارية؟",
    answer: "نعم، في خطة المحترف يمكنك ربط نطاقك المخصص بالكامل (مثل links.yourbrand.com) مع شهادة أمان SSL مجانية وتلقائية.",
  },
  {
    question: "كيف تعمل ميزة فاحص الروابط التلقائي؟",
    answer: "يقوم نظامنا بفحص كافة روابطك بشكل دوري للتأكد من استجابتها وسرعتها، وفي حال تعطل أي صفحة أو فيديو يصلك تنبيه مباشر لتعديله فوراً.",
  },
  {
    question: "هل أحتاج إلى بطاقة ائتمانية لإنشاء حسابي؟",
    answer: "إطلاقاً. يمكنك البدء بالخطة المجانية مدى الحياة فوراً دون الحاجة لإدخال أي بيانات بنكية.",
  },
];
