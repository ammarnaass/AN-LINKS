import { LandingTemplate } from "../templates-data";

export interface LocalizedTemplateGallery {
  tag: string;
  title: string;
  subtitle: string;
  note: string;
  cta: string;
  templates: LandingTemplate[];
}

export const templatesAr: LocalizedTemplateGallery = {
  tag: "تجربة حية تفاعلية",
  title: "لكل مبدع بصمته الخاصة.. تصفّح النماذج الجاهزة",
  subtitle: "اضغط على الفئة لتشاهد كيف تتحول صفحة الروابط على الفور بما يناسب طبيعة نشاطك وجمهورك المستهدف.",
  note: "أكثر من 120 قالباً مهيأ لكافة المنصات والمجالات",
  cta: "تصفح كافة القوالب الحية",
  templates: [
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
        { icon: "play_circle", title: "شاهد أحدث فيلم وثائقي: روح العمارة", color: "text-primary" },
        { icon: "download", title: "تحميل حزمة ألوان LUTs السينمائية مجاناً", color: "text-secondary" },
        { icon: "calendar_today", title: "حجز جلسة استشارية تصوير (30 دقيقة)", color: "text-tertiary" },
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
        { icon: "shopping_cart", title: "تصفح أحدث تشكيلة نباتات الظل 2026", color: "text-primary" },
        { icon: "local_offer", title: "كود خصم حصري لمتابعي البايو: ANLINKS15", color: "text-secondary" },
        { icon: "support_agent", title: "محادثة خدمة العملاء المباشرة عبر واتساب", color: "text-tertiary" },
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
        { icon: "podcasts", title: "استمع إلى الحلقة الأخيرة على Apple Podcasts", color: "text-primary" },
        { icon: "graphic_eq", title: "مكتبة الحلقات الصوتية على Spotify", color: "text-secondary" },
        { icon: "mail", title: "اشترك في النشرة البريدية الأسبوعية للبودكاست", color: "text-tertiary" },
      ],
    },
    {
      id: "writer",
      category: "writer",
      categoryName: "كاتب وباحث",
      creatorName: "د. سلمان المهنا",
      handle: "dr_salman",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree",
      bio: "باحث في الذكاء الاصطناعي ومستقبل العمل. أشارك مقالات أسبوعية وكتباً تلخّص التحولات التقنية العالمية.",
      url: "anlinks.dev/dr_salman",
      links: [
        { icon: "menu_book", title: "تحميل كتاب: دليلك العملي لتبني الذكاء الاصطناعي", color: "text-primary" },
        { icon: "edit_note", title: "قراءة مقال هذا الأسبوع على Substack", color: "text-secondary" },
        { icon: "co_present", title: "طلب استشارة استراتيجية للمؤسسات", color: "text-tertiary" },
      ],
    },
  ],
};

export const templatesEn: LocalizedTemplateGallery = {
  tag: "Interactive Live Demos",
  title: "Every Creator Has a Unique Identity.. Explore Templates",
  subtitle: "Switch between categories to see how your page instantly transforms to fit your industry and style.",
  note: "Over 120 templates tailored for all platforms and niches",
  cta: "Browse all live templates",
  templates: [
    {
      id: "creator",
      category: "creator",
      categoryName: "Visual & Content Creator",
      creatorName: "Sarah Miller",
      handle: "sarah_m",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBW5Y6crJZQO6qFIJexjW6RZIKABM2b0vI_3lsCXvjLKlPALIP9y0fuaXG7-RvySmwdsMR0GDwJhGx7bgumRDwt7cmOXjNswkjuxC9niY9lbP2E4oPr6yg3GbCvTO7q9PiCh3CbXgG9W1Vp5ahbE-YV7UhRR2GH88O2spkmCF8QtwHMMpzOZlWI6shUOaQKOK_F52EOqSeO9CYGcB56dH5qDobW3GTns3bcXb-yBWPm",
      bio: "Lifestyle and cinema filmmaker. Here you can find my latest documentary, presets, and filmmaking gear recommendations.",
      url: "anlinks.dev/sarah_m",
      links: [
        { icon: "play_circle", title: "Watch latest mini-documentary: Soul of Space", color: "text-primary" },
        { icon: "download", title: "Download Free Cinematic LUTs color pack", color: "text-secondary" },
        { icon: "calendar_today", title: "Book a 30-min creative consultation", color: "text-tertiary" },
      ],
    },
    {
      id: "store",
      category: "store",
      categoryName: "Store & Brand",
      creatorName: "Botanica & Clay",
      handle: "botanica",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAiHQG-5svtX-byGr_5cfpU0mSLy0pofVz155SvSQQH1UwfxOH314vLEALfTETuPcpFpVborvY04-gRQQ5j0UOWNybAKJm6nI4sMsXlKFvWuYNZAf3HzfMxMFFC--yeAENJu8o-r3sUcTxmvgr-VQz4gtN7NDci5-hRrqOjyquNEayOUDOWhju3b6VME6vbBRITTVzHkNhLqHCidvKyWx33-wgjG-43Bn8EAopprhsv",
      bio: "Handcrafted ceramics and indoor plants. Express delivery worldwide.",
      url: "anlinks.dev/botanica",
      links: [
        { icon: "shopping_cart", title: "Shop 2026 indoor greenery drop", color: "text-primary" },
        { icon: "local_offer", title: "Bio follower coupon: ANLINKS15", color: "text-secondary" },
        { icon: "support_agent", title: "Direct WhatsApp concierge service", color: "text-tertiary" },
      ],
    },
    {
      id: "podcast",
      category: "podcast",
      categoryName: "Podcast & Media",
      creatorName: "Next Horizon Show",
      handle: "nexthorizon",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgPlBXkXf6weLj6T7HFZuTb8brTKmEbFRpZ7Urh56JYbGOJizjp6qKXBIgXnIphtTdkolEITHiU7wKO46Hn2Mv0T3BPGXmCebVYTN9k1IJXs6av5MEnr3m-5Iu0hojMMqrvUp_4Fjel5DgUFdp8T0wlkPxW8EGOHN8HR8flXjLhUkwytHFMpFNizyJAF5kF9eXPlZ8lVgGkeHCOJD6_o2GURD3Ufg5cmfBTeh8raVu",
      bio: "Deep conversations with founders, engineers, and creators shaping the future economy.",
      url: "anlinks.dev/nexthorizon",
      links: [
        { icon: "podcasts", title: "Listen to the latest episode on Apple Podcasts", color: "text-primary" },
        { icon: "graphic_eq", title: "Stream our complete playlist on Spotify", color: "text-secondary" },
        { icon: "mail", title: "Subscribe to our Sunday backstage newsletter", color: "text-tertiary" },
      ],
    },
    {
      id: "writer",
      category: "writer",
      categoryName: "Writer & Researcher",
      creatorName: "Dr. Elena Vance",
      handle: "elena_vance",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree",
      bio: "AI researcher & author exploring the next frontier of digital work and autonomy.",
      url: "anlinks.dev/elena_vance",
      links: [
        { icon: "menu_book", title: "Download Handbook: Generative Work in Practice", color: "text-primary" },
        { icon: "edit_note", title: "Read latest weekly essay on Substack", color: "text-secondary" },
        { icon: "co_present", title: "Request corporate keynotes & advisory", color: "text-tertiary" },
      ],
    },
  ],
};

export const templatesFr: LocalizedTemplateGallery = {
  tag: "Démonstrations Interactives",
  title: "Chaque Créateur a son Empreinte.. Explorez nos Modèles",
  subtitle: "Cliquez sur une catégorie pour voir votre page se transformer instantanément selon vos besoins.",
  note: "Plus de 120 modèles optimisés pour toutes les plateformes",
  cta: "Explorer tous les modèles en direct",
  templates: [
    {
      id: "creator",
      category: "creator",
      categoryName: "Créateur & Vidéaste",
      creatorName: "Sarah Miller",
      handle: "sarah_m",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBW5Y6crJZQO6qFIJexjW6RZIKABM2b0vI_3lsCXvjLKlPALIP9y0fuaXG7-RvySmwdsMR0GDwJhGx7bgumRDwt7cmOXjNswkjuxC9niY9lbP2E4oPr6yg3GbCvTO7q9PiCh3CbXgG9W1Vp5ahbE-YV7UhRR2GH88O2spkmCF8QtwHMMpzOZlWI6shUOaQKOK_F52EOqSeO9CYGcB56dH5qDobW3GTns3bcXb-yBWPm",
      bio: "Créatrice de contenu lifestyle & réalisatrice vidéo. Découvrez mes films récents, mes presets et mon matériel favori.",
      url: "anlinks.dev/sarah_m",
      links: [
        { icon: "play_circle", title: "Voir le dernier documentaire : L'Âme de l'Espace", color: "text-primary" },
        { icon: "download", title: "Télécharger gratuitement le pack de LUTs cinéma", color: "text-secondary" },
        { icon: "calendar_today", title: "Réserver une session de conseil vidéo (30 min)", color: "text-tertiary" },
      ],
    },
    {
      id: "store",
      category: "store",
      categoryName: "Boutique & Marque",
      creatorName: "Botanica Céramique",
      handle: "botanica",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAiHQG-5svtX-byGr_5cfpU0mSLy0pofVz155SvSQQH1UwfxOH314vLEALfTETuPcpFpVborvY04-gRQQ5j0UOWNybAKJm6nI4sMsXlKFvWuYNZAf3HzfMxMFFC--yeAENJu8o-r3sUcTxmvgr-VQz4gtN7NDci5-hRrqOjyquNEayOUDOWhju3b6VME6vbBRITTVzHkNhLqHCidvKyWx33-wgjG-43Bn8EAopprhsv",
      bio: "Plantes d'intérieur élégantes et céramiques faites main. Livraison rapide et soignée.",
      url: "anlinks.dev/botanica",
      links: [
        { icon: "shopping_cart", title: "Découvrir la nouvelle collection de plantes 2026", color: "text-primary" },
        { icon: "local_offer", title: "Code promo exclusif bio : ANLINKS15", color: "text-secondary" },
        { icon: "support_agent", title: "Service client direct sur WhatsApp", color: "text-tertiary" },
      ],
    },
    {
      id: "podcast",
      category: "podcast",
      categoryName: "Podcast & Média",
      creatorName: "Podcast Nouvel Horizon",
      handle: "horizonpod",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgPlBXkXf6weLj6T7HFZuTb8brTKmEbFRpZ7Urh56JYbGOJizjp6qKXBIgXnIphtTdkolEITHiU7wKO46Hn2Mv0T3BPGXmCebVYTN9k1IJXs6av5MEnr3m-5Iu0hojMMqrvUp_4Fjel5DgUFdp8T0wlkPxW8EGOHN8HR8flXjLhUkwytHFMpFNizyJAF5kF9eXPlZ8lVgGkeHCOJD6_o2GURD3Ufg5cmfBTeh8raVu",
      bio: "Conversations enrichissantes avec des entrepreneurs et créateurs du numérique.",
      url: "anlinks.dev/horizonpod",
      links: [
        { icon: "podcasts", title: "Écouter le dernier épisode sur Apple Podcasts", color: "text-primary" },
        { icon: "graphic_eq", title: "Bibliothèque complète sur Spotify", color: "text-secondary" },
        { icon: "mail", title: "Rejoindre la newsletter hebdomadaire", color: "text-tertiary" },
      ],
    },
    {
      id: "writer",
      category: "writer",
      categoryName: "Auteur & Chercheur",
      creatorName: "Dr. Elena Vance",
      handle: "elena_vance",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree",
      bio: "Chercheuse en IA et avenir du travail. Essais hebdomadaires et analyses technologiques.",
      url: "anlinks.dev/elena_vance",
      links: [
        { icon: "menu_book", title: "Télécharger le manuel : Travail & IA en pratique", color: "text-primary" },
        { icon: "edit_note", title: "Lire l'essai de la semaine sur Substack", color: "text-secondary" },
        { icon: "co_present", title: "Demander une conférence ou conseil stratégique", color: "text-tertiary" },
      ],
    },
  ],
};
