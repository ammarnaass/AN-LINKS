import React from "react";
import Link from "next/link";
import { UserCheck, Sparkles, Share2, ArrowLeft, Check } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserCheck,
    title: "احجز اسمك الفريد",
    description: "سجّل بريدك الإلكتروني واحجز معرّفك الشخصي مجاناً في أقل من 30 ثانية.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "خصّص مظهر البانتو",
    description: "رتّب قنواتك ومنتجاتك الرقمية واختر قالباً يعكس هوية علامتك باحترافية.",
  },
  {
    step: "03",
    icon: Share2,
    title: "انشر رابطك وضاعف مبيعاتك",
    description: "انسخ رابط صفحتك الموحد وضعه في البايو على إنستغرام، تيك توك، وغيرها.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-surface text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
            <span>ثلاث خطوات فقط</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            ابدأ رحلتك الرقمية في دقائق
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            لا تعقيدات، لا بطاقة ائتمان، ولا حاجة لأي خبرة تقنية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-outline/30 font-mono">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface">
                    {step.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner (Stitch Bento Giant CTA) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-primary/20 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
              جاهز لتوحيد حضورك الرقمي وزيادة مبيعاتك؟
            </h3>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              انضم لأكثر من 50,000 صانع محتوى وشركة يعتمدون على المنصة لإدارة روابطهم باحترافية.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold text-sm shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all active:scale-95"
              >
                <span>أنشئ صفحتك الآن مجاناً</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-primary" /> مجاني 100%
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-primary" /> إعداد في دقيقتين
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-primary" /> بدون بطاقة ائتمان
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

