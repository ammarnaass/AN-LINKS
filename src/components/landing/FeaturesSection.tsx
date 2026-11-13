import React from "react";
import { Zap, Palette, BarChart3, Globe2 } from "lucide-react";

const FEATURES = [
  {
    icon: Globe2,
    title: "واجهة وتجربة عربية أصيلة (RTL-First)",
    description:
      "مصممة بالكامل من اليمين إلى اليسار بأجمل الخطوط العربية، متناسقة ومريحة لعين القارئ العربي على جميع المنصات.",
    badge: "عربي أصيل",
  },
  {
    icon: Zap,
    title: "سرعة خارقة على الجوّال (LCP < 1.5s)",
    description:
      "تعتمد على التصيير من الخادم (SSR) بدون أي اعتمادات برمجية ثقيلة، لتفتح صفحتك لحظياً فور نقرة المتابع من البايو.",
    badge: "أداء فائق",
  },
  {
    icon: BarChart3,
    title: "إحصاءات حقيقية بدون تزييف",
    description:
      "نستبعد تلقائياً زيارات العناكب والبوتات والتحميل المسبق لمنصات التواصل، لترى فقط الزوار والنقرات الحقيقية.",
    badge: "دقة 100%",
  },
  {
    icon: Palette,
    title: "تخصيص كامل ومعاينة لحظية",
    description:
      "قوالب عصرية جاهزة، ألوان متدرجة، أيقونات شبكات التواصل الرسمية، ومعاينة حيّة مباشرة بدون أي تأخير.",
    badge: "مرونة كاملة",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50/70 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider">
            المزايا التنافسية
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            كل ما تحتاجه لتوجيه متابعيك وتحويلهم لعملاء
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            صممنا AN LINKS خصيصاً ليحل مشاكل المنصات الحالية: البطء، ضعف دعم العربية، والتعقيدات غير الضرورية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {feature.badge}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
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

