export interface LandingTestimonial {
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  quote: string;
}

export const LANDING_TESTIMONIALS: LandingTestimonial[] = [
  {
    name: "عبدالعزيز القرني",
    role: "مؤسس بودكاست مدار • 120k متابع",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgPlBXkXf6weLj6T7HFZuTb8brTKmEbFRpZ7Urh56JYbGOJizjp6qKXBIgXnIphtTdkolEITHiU7wKO46Hn2Mv0T3BPGXmCebVYTN9k1IJXs6av5MEnr3m-5Iu0hojMMqrvUp_4Fjel5DgUFdp8T0wlkPxW8EGOHN8HR8flXjLhUkwytHFMpFNizyJAF5kF9eXPlZ8lVgGkeHCOJD6_o2GURD3Ufg5cmfBTeh8raVu",
    rating: 5,
    quote:
      "«ميزة التنبيه عند تعطل أي رابط أنقذتني في حملة إطلاق دورتي التدريبية الأخيرة. تم إشعارنا فوراً بخطأ في صفحة السلة وأصلحناه دون خسارة تسجيل واحد!»",
  },
  {
    name: "نورة الصالح",
    role: "مصممة هوية واستشارية علامات • 45k متابع",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0zFfyrIX7NyPWPQ0fschvaejWd25AtrZvCqe9M-U6BoV6QjfxD-foqxyUJn5nMjI2uDaYXjG2PgFgBpYc03SbzRNliDCVYrVtdt8SVAMgqNiIGqoHLiULvhCnnqz-M1V6yUgX7hftNaSDFsJouBFW0p2PEz3w_2iybhLIowSkAe76kfAUyM5HCb6KrdeIedvIWgaTkwYZXGFZASRSj_I4-k3NxsrRzm_tKsHIbFqX",
    rating: 5,
    quote:
      "«أفضل تجربة RTL على الإطلاق. الخطوط العربية مريحة للعين، وتصميم البانتو يعطي انطباعاً فائق الفخامة لعلامتي الشخصية أمام الشركاء والعملاء.»",
  },
  {
    name: "طارق الدوسري",
    role: "كاتب ومدرب تجارة رقمية • 88k متابع",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ve0qepnRYSX9CgXi15HbtLRQp_bmSrGqNcLu3Y7QX-XI81vQswMkizB_PtZmdLk_vl4_F9-sB0ym6JRB-Yl8b0fjos138P69385kZa8kiJHz1QZujfn9fiI51DuiByhIA3obbnzKKzDRRsKl1zvuIDb3wkuuwKhd82hrSvV_Oktz37n-mTY7U78lC5ntl4IWAeN8FdJ9Lw0CBWxi5q8k38IGBw-Pyhr_JT42iree",
    rating: 5,
    quote:
      "«بعت أكثر من 400 نسخة من كتابي الإلكتروني مباشرة عبر زر الدفع السريع داخل روابط دون الحاجة لبرمجة متجر كامل أو دفع عمولات معقدة.»",
  },
];

export interface LandingFaq {
  id: string;
  question: string;
  answer: string;
}

export const LANDING_FAQS: LandingFaq[] = [
  {
    id: "faq-1",
    question: "هل الخدمة مجانية فعلاً أم لفترة تجريبية محدودة؟",
    answer:
      "نعم، الخطة المجانية متاحة مدى الحياة بدون أي التزامات وبدون الحاجة لإدخال بطاقتك الائتمانية. يمكنك إضافة روابط غير محدودة ومتابعة الإحصائيات الأساسية ومشاركة صفحتك في أي وقت.",
  },
  {
    id: "faq-2",
    question: "هل يمكنني ربط دوميني الخاص بي (مثل: me.com)؟",
    answer:
      "بالتأكيد! في باقة المحترفين وباقة الشركات يمكنك ربط نطاقك الشخصي الخاص بضغطة زر مع شهادة أمان SSL مشفرة ومجانية تلقائياً، ليظهر موقعك بهويتك الرسمية الخالصة.",
  },
  {
    id: "faq-3",
    question: "كيف تعمل ميزة فحص الروابط المعطلة وتنبيهات واتساب؟",
    answer:
      "يقوم نظامنا الآلي بإجراء فحص صحة (Health-check) دوري لكافة الروابط الخارجية في صفحتك للتأكد من أنها تفتح وتعمل. إذا توقف رابط أو أصابه عطل 404، يرسل لك النظام تنبيهاً فورياً على رقم واتساب الخاص بك ويخفي الرابط مؤقتاً لتفادي إحباط الزوار.",
  },
  {
    id: "faq-4",
    question: "كيف أستلم أرباح مبيعات المنتجات والاستشارات الرقمية؟",
    answer:
      "نوفر تكاملاً سهلاً مع بوابات الدفع المعتمدة (مثل Stripe و Tap وبوابات الدفع المحلية مثل مدى و Apple Pay). يتم إيداع أموال مبيعاتك مباشرة في حسابك البنكي بدون تأخير أو وسطاء معقدين.",
  },
];
