import React from "react";
import { ShieldAlert, ShoppingBag, BarChart3, Palette, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldAlert,
    title: "فاحص الروابط الذكي (Link Sentinel)",
    description:
      "فحص دوري مستمر لروابطك وتنبيهك فوراً في حال تعطل أي رابط، حتى لا تخسر أي زيارة أو عميل محتمل من البايو.",
    badge: "حماية ذكية",
    color: "text-amber-400 bg-amber-400/10",
  },
  {
    icon: ShoppingBag,
    title: "بيع المنتجات الرقمية والاشتراكات",
    description:
      "حوّل صفحة البايو إلى متجر مصغر متكامل لبيع الكتب الإلكترونية، القوالب، أو حجز الاستشارات بضغطة زر.",
    badge: "مبيعات فورية",
    color: "text-primary bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "تحليلات حقيقية خالية من الزيف",
    description:
      "استبعاد تلقائي لعناكب وبوتات منصات التواصل، لترى فقط النقرات والزيارات الفعلية مع تتبع معدل التحويل.",
    badge: "دقة 100%",
    color: "text-tertiary bg-tertiary/10",
  },
  {
    icon: Palette,
    title: "تصميم بانتو عربي متقدم (Bento Luxury)",
    description:
      "قوالب داكنة وفاتحة مستوحاة من أحدث اتجاهات التصميم العالمية مع دعم أصيل للخطوط والاتجاه العربي RTL.",
    badge: "هوية استثنائية",
    color: "text-secondary bg-secondary/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-surface-container-lowest border-y border-outline-variant/20 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المزايا المتقدمة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            كل ما تحتاجه لبناء حضور رقمي احترافي متكامل
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            تم ابتكار المنصة لتتجاوز قيود روابط البايو التقليدية وتمنحك أدوات تسويق حقيقية تضاعف مبيعاتك وتفاعلك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-white/5">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

