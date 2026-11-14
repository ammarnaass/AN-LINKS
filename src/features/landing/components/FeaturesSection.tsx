import React from "react";
import { Sparkles } from "lucide-react";

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

        {/* 4 Dedicated Bento Cards Matching Stitch _9 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: فحص الروابط الذاتي الذكي */}
          <div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">link_off</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">
                  حصري
                </span>
              </div>
              <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                فحص الروابط الذاتي الذكي
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                لا تفقد أي مبيعة أو زائر بسبب رابط منتهي أو فيديو محذوف. روبوت روابط يفحص جميع وجهاتك على مدار الساعة ويرسل لك تنبيهاً فورياً عبر واتساب عند تعطل أي رابط.
              </p>
            </div>
            {/* WhatsApp Alert Banner */}
            <div className="mt-8 bg-surface-container-high/90 rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">روبوت روابط (واتساب)</span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <span className="text-xs text-on-surface-variant">تنبيه فوري: رابط متجرك عاد للعمل بسرعة 48ms</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-outline shrink-0">الآن</span>
            </div>
          </div>

          {/* Card 2: محرر بصري يعشق العربية */}
          <div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/30 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">palette</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                محرر بصري يعشق العربية
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                اختر من بين أكثر من 30 خطاً عربياً أصيلاً، تأثيرات زجاجية ثلاثية الأبعاد، وتدرجات إضاءة نيون تعكس هوية علامتك باحترافية كاملة.
              </p>
            </div>
            {/* Typography Demo Chips */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["IBM Plex Sans", "خط الجزيرة", "الكوفي المودرن", "النسخ الرقمي"].map((font) => (
                <span
                  key={font}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:text-primary transition-colors cursor-pointer border border-white/5"
                >
                  {font}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: تحليلات دقيقة ولحظية */}
          <div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-container/20 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">query_stats</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                تحليلات دقيقة ولحظية
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                تعرف على مصادر حركة المرور، الدول، أنواع الأجهزة، وأوقات الذروة مع دعم لربط Meta Pixel و Google Analytics.
              </p>
            </div>
            {/* Mini Inline CTR Progress Bar */}
            <div className="mt-8 flex flex-col gap-2 bg-surface-container-high/60 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-on-surface-variant text-xs">
                <span>نسبة النقر للظهور (CTR)</span>
                <span className="text-tertiary font-bold font-mono">18.4%</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex">
                <div className="bg-primary h-full w-[65%] rounded-full" />
                <div className="bg-tertiary h-full w-[25%]" />
              </div>
              <div className="flex justify-between text-outline text-[10px] font-mono">
                <span>زوار مباشرين 65%</span>
                <span>تواصل اجتماعي 25%</span>
              </div>
            </div>
          </div>

          {/* Card 4: بيع المنتجات وجمع الدفعات */}
          <div className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">payments</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                بيع المنتجات وجمع الدفعات
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                قم ببيع ملفات PDF، الاستشارات الصوتية، وخدماتك مباشرة من البايو مع دعم وسائل الدفع المحلية (مدى، Apple Pay، والبطاقات).
              </p>
            </div>
            {/* Quick Checkout Feature Pill */}
            <div className="mt-8 flex items-center justify-between p-3.5 bg-surface-container-high/60 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">contactless</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">دفع فوري 1-Click</span>
                  <span className="text-[10px] text-on-surface-variant">مدى • Apple Pay • بطاقات ائتمانية</span>
                </div>
              </div>
              <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">SAR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
