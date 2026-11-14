import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

export function GiantCtaSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-8 bg-surface-container-lowest text-on-surface">
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[36px] bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border border-primary/30 p-8 sm:p-16 text-center space-y-8 shadow-2xl">
        {/* Glow halos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>انضم لأكثر من 50,000 مبدع</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
            جاهز لتوحيد حضورك الرقمي في <span className="text-primary">رابط واحد استثنائي؟</span>
          </h2>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            ابدأ الآن مجاناً، اختر قالبك المفضل، وانطلق في بناء علامتك الشخصية ومضاعفة وصولك ومبيعاتك في دقائق.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95"
            >
              <span>أنشئ صفحتك الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" /> بدون بطاقة ائتمانية
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" /> إعداد سهل في 60 ثانية
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" /> دعم فني عربي على مدار الساعة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
