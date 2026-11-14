export interface LandingTemplate {
  id: string;
  category: "visual" | "author" | "designer" | "tech";
  categoryName: string;
  creatorName: string;
  handle: string;
  role: string;
  avatarUrl: string;
  bio: string;
  themeName: string;
  links: { title: string; subtitle: string; icon: string; badge?: string }[];
}

export const LANDING_TEMPLATES: LandingTemplate[] = [
  {
    id: "visual-creator",
    category: "visual",
    categoryName: "صانع محتوى مرئي",
    creatorName: "سارة المهيدب",
    handle: "sara.cine",
    role: "صانعة محتوى سينمائي وأسلوب حياة",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "صانعة محتوى في أسلوب الحياة والتصوير السينمائي. هنا تجد أعمالي، ورش العمل، وروابط المعدات المفضلة لدي.",
    themeName: "شفق البنفسج (Cyber Violet)",
    links: [
      { title: "قناتي على يوتيوب - أحدث فلوق سينمائي", subtitle: "240K مشاهدة", icon: "video", badge: "جديد" },
      { title: "حزمة فلاتر التصوير السينمائي (LUTs Pack)", subtitle: "متجر رقمي - تحميل فوري", icon: "shopping-bag", badge: "الأكثر طلباً" },
      { title: "معدات التصوير والإضاءة التي أستخدمها", subtitle: "روابط مع خصم حصري 15%", icon: "camera" },
    ],
  },
  {
    id: "author-creator",
    category: "author",
    categoryName: "الكاتب والمؤلف",
    creatorName: "عبدالله الراشد",
    handle: "alrashed.writer",
    role: "كاتب وباحث في الاقتصاد الرقمي",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "مؤلف كتاب «اقتصاد الانتباه». أكتب أسبوعياً عن استراتيجيات النمو والتحول الرقمي لأكثر من 40,000 قارئ.",
    themeName: "سليت الحداثة (Minimal Slate)",
    links: [
      { title: "تحميل الفصل الأول من كتاب «اقتصاد الانتباه»", subtitle: "PDF مجاني", icon: "book-open", badge: "هدية مجانية" },
      { title: "الاشتراك في نشرتي البريدية الأسبوعية", subtitle: "تصل كل يوم سبت صباحاً", icon: "mail" },
      { title: "شراء النسخة الكاملة من الكتاب عبر أمازون", subtitle: "متوفر ورقي وإلكتروني", icon: "shopping-cart" },
    ],
  },
  {
    id: "designer-creator",
    category: "designer",
    categoryName: "المصمم والمبدع",
    creatorName: "ليان ناصر",
    handle: "layan.ui",
    role: "مصممة هوية بصرية وواجهات مستخدم",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "أساعد الشركات التقنية الناشئة في بناء هويات بصرية لا تُنسى. شريكة تصميم معتمدة في Figma.",
    themeName: "نيون الزمرد (Emerald Dark)",
    links: [
      { title: "معرض أعمالي على Behance و Dribbble", subtitle: "+50 مشروع موثق", icon: "layout", badge: "معرض الأعمال" },
      { title: "حجز جلسة استشارة تصميم 1:1", subtitle: "جلسة 45 دقيقة عبر Google Meet", icon: "calendar", badge: "متاح مقعدين" },
      { title: "مكتبة أيقونات ومكونات Figma الجاهزة", subtitle: "تحميل مجاني للمصممين", icon: "box" },
    ],
  },
  {
    id: "tech-creator",
    category: "tech",
    categoryName: "رائد أعمال تقني",
    creatorName: "فيصل الشمري",
    handle: "faisal.tech",
    role: "مؤسس استوديو «ابتكار» ومستثمر ملائكي",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "أبني منتجات تقنية تخدم الملايين. أشارك دروس ريادة الأعمال والذكاء الاصطناعي أسبوعياً.",
    themeName: "ذهبي فاخر (Obsidian Gold)",
    links: [
      { title: "استمع إلى أحدث حلقة من بودكاست «تقنية الغد»", subtitle: "مع ضيف مميز من وادي السيليكون", icon: "mic", badge: "حلقة جديدة" },
      { title: "حجز استشارة نمو الشركات الناشئة", subtitle: "تقييم نموذج العمل وخطة التوسع", icon: "trending-up" },
      { title: "الانضمام إلى مجتمع رواد الأعمال على تلغرام", subtitle: "+15,000 مؤسس ومبرمج", icon: "send" },
    ],
  },
];
