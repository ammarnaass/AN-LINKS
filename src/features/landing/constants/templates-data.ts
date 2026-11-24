export interface LandingTemplateLink {
  title: string;
  subtitle?: string;
  icon: string;
  color?: string;
  badge?: string;
}

export interface LandingTemplate {
  id: string;
  category: "creator" | "store" | "podcast" | "writer";
  categoryName: string;
  creatorName: string;
  handle: string;
  role?: string;
  avatarUrl: string;
  bio: string;
  url: string;
  links: LandingTemplateLink[];
}

export const LANDING_TEMPLATES: LandingTemplate[] = [
  {
    id: "creator",
    category: "creator",
    categoryName: "صانع محتوى ومرئي",
    creatorName: "سارة المهيدب",
    handle: "sarah_m",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBW5Y6crJZQO6qFIJexjW6RZIKABM2b0vI_3lsCXvjLKlPALIP9y0fuaXG7-RvySmwdsMR0GDwJhGx7bgumRDwt7cmOXjNswkjuxC9niY9lbP2E4oPr6yg3GbCvTO7q9PiCh3CbXgG9W1Vp5ahbE-YV7UhRR2GH88O2spkmCF8QtwHMMpzOZlWI6shUOaQKOK_F52EOqSeO9CYGcB56dH5qDobW3GTns3bcXb-yBWPm",
    bio: "صانعة محتوى في أسلوب الحياة والتصوير السينمائي. هنا تجد أعمالي، ورش العمل، وروابط المعدات التي استخدمها.",
    url: "anlinks.dev/sarah_m",
    links: [
      {
        icon: "play_circle",
        title: "شاهد أحدث فيلم وثائقي: روح العمارة",
        color: "text-primary",
      },
      {
        icon: "download",
        title: "تحميل حزمة ألوان LUTs السينمائية مجاناً",
        color: "text-secondary",
      },
      {
        icon: "calendar_today",
        title: "حجز جلسة استشارية تصوير (30 دقيقة)",
        color: "text-tertiary",
      },
    ],
  },
  {
    id: "store",
    category: "store",
    categoryName: "متجر وعلامة تجارية",
    creatorName: "متجر نبتة وخزف",
    handle: "nabtastore",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiHQG-5svtX-byGr_5cfpU0mSLy0pofVz155SvSQQH1UwfxOH314vLEALfTETuPcpFpVborvY04-gRQQ5j0UOWNybAKJm6nI4sMsXlKFvWuYNZAf3HzfMxMFFC--yeAENJu8o-r3sUcTxmvgr-VQz4gtN7NDci5-hRrqOjyquNEayOUDOWhju3b6VME6vbBRITTVzHkNhLqHCidvKyWx33-wgjG-43Bn8EAopprhsv",
    bio: "نباتات داخلية فاخرة وأوانٍ فخارية مصنوعة يدوياً بحب. شحن سريع لكافة مناطق المملكة والخليج.",
    url: "anlinks.dev/nabtastore",
    links: [
      {
        icon: "shopping_cart",
        title: "تصفح أحدث تشكيلة نباتات الظل 2025",
        color: "text-primary",
      },
      {
        icon: "local_offer",
        title: "كود خصم حصري لمتابعي البايو: RAWABET15",
        color: "text-secondary",
      },
      {
        icon: "support_agent",
        title: "محادثة خدمة العملاء المباشرة عبر واتساب",
        color: "text-tertiary",
      },
    ],
  },
  {
    id: "podcast",
    category: "podcast",
    categoryName: "بودكاست وإعلام رقمي",
    creatorName: "بودكاست زاوية أخرى",
    handle: "zawayapod",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgPlBXkXf6weLj6T7HFZuTb8brTKmEbFRpZ7Urh56JYbGOJizjp6qKXBIgXnIphtTdkolEITHiU7wKO46Hn2Mv0T3BPGXmCebVYTN9k1IJXs6av5MEnr3m-5Iu0hojMMqrvUp_4Fjel5DgUFdp8T0wlkPxW8EGOHN8HR8flXjLhUkwytHFMpFNizyJAF5kF9eXPlZ8lVgGkeHCOJD6_o2GURD3Ufg5cmfBTeh8raVu",
    bio: "حوارات عميقة ومثيرة مع خبراء التقنية والاقتصاد الجديد. استمع لجميع الحلقات على منصتك المفضلة.",
    url: "anlinks.dev/zawayapod",
    links: [
      {
        icon: "podcasts",
        title: "استمع إلى الحلقة الأخيرة على Apple Podcasts",
        color: "text-primary",
      },
      {
        icon: "graphic_eq",
        title: "مكتبة الحلقات الصوتية على Spotify",
        color: "text-secondary",
      },
      {
        icon: "mail",
        title: "اشتراك النشرة البريدية الأسبوعية لتحليل الحلقة",
        color: "text-tertiary",
      },
    ],
  },
  {
    id: "writer",
    category: "writer",
    categoryName: "كاتب واستشاري مستقل",
    creatorName: "د. طارق المنصور",
    handle: "almansoor",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree",
    bio: "كاتب ومستشار استراتيجيات النمو المؤسسي. أشارك مقالات متخصصة وأدلة تنفيذية لرواد الأعمال.",
    url: "anlinks.dev/almansoor",
    links: [
      {
        icon: "menu_book",
        title: "تحميل كتاب: استراتيجية المحيط الرقمي (PDF)",
        color: "text-primary",
      },
      {
        icon: "article",
        title: "قراءة أحدث مقال في نشرة لينكد إن الأسبوعية",
        color: "text-secondary",
      },
      {
        icon: "event_available",
        title: "طلب استشارة تخطيط استراتيجي للشركات",
        color: "text-tertiary",
      },
    ],
  },
];
