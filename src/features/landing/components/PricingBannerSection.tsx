import React from "react";
import Link from "next/link";
import { Check, ArrowLeft, Sparkles } from "lucide-react";

export function PricingBannerSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-surface-container-lowest border-y border-outline-variant/20 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خطط واضحة بدون مفاجآت</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            استثمر في حضورك الرقمي دون أي تكاليف خفية
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            ابدأ مجاناً مدى الحياة، وقم بالترقية عندما تحتاج أدوات ذكية ومتقدمة لتسريع نموك وأرباحك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier Preview */}
          <div className="p-8 rounded-3xl bg-surface-container/60 border border-white/5 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">الخطة المجانية</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-on-surface">مجاناً</span>
                <span className="text-xs text-on-surface-variant">مدى الحياة</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                مثالية للبدايات وصناع المحتوى الناشئين لتنظيم حضورهم الرقمي.
              </p>
              <ul className="space-y-2.5 text-xs text-on-surface pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> روابط وشبكات غير محدودة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> قوالب بينتو الأساسية</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> إحصاءات الزيارات لآخر 7 أيام</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-bold text-xs text-center border border-white/5 transition"
            >
              ابدأ مجاناً الآن
            </Link>
          </div>

          {/* Pro Tier Preview */}
          <div className="p-8 rounded-3xl bg-surface-container-high/90 border-2 border-primary/50 flex flex-col justify-between space-y-6 shadow-2xl relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
              الأكثر طلباً
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">باقة المحترف Pro</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-on-surface">$19</span>
                <span className="text-xs text-on-surface-variant">/ شهرياً (تدفع سنوياً)</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                لصناع المحتوى المحترفين الباحثين عن أعلى معدل تحويل وحماية للروابط.
              </p>
              <ul className="space-y-2.5 text-xs text-on-surface pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> فاحص الروابط الذكي (Link Sentinel)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> بيع المنتجات الرقمية والاستشارات</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> ربط دومين مخصص وإزالة شعار المنصة</li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs text-center shadow-[0_0_20px_rgba(78,222,163,0.3)] transition flex items-center justify-center gap-2"
            >
              <span>استكشف كافة تفاصيل الخطط</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
