import React from "react";
import { Sparkles } from "lucide-react";

interface PricingHeaderProps {
  isYearly: boolean;
  onToggleYearly: (yearly: boolean) => void;
}

export function PricingHeader({ isYearly, onToggleYearly }: PricingHeaderProps) {
  return (
    <div className="text-center space-y-5 max-w-3xl mx-auto pt-12 pb-10 px-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
        <Sparkles className="w-3.5 h-3.5" />
        <span>استثمر في هويتك الرقمية</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
        اختر الخطة المناسبة <span className="text-primary">لطموحك</span> وتوسع بلا حدود
      </h1>

      <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
        خطط مرنة وشفافة مصممة لتمكين صناع المحتوى ورواد الأعمال والشركات في العالم العربي.
      </p>

      {/* Annual / Monthly Toggle */}
      <div className="pt-4 flex items-center justify-center">
        <div className="p-1 rounded-2xl bg-surface-container-high border border-white/5 flex items-center gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => onToggleYearly(false)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              !isYearly
                ? "bg-surface text-on-surface shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            دفع شهري
          </button>

          <button
            type="button"
            onClick={() => onToggleYearly(true)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              isYearly
                ? "bg-primary text-on-primary shadow-[0_0_16px_rgba(78,222,163,0.35)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span>دفع سنوي</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              isYearly ? "bg-black/20 text-on-primary" : "bg-primary/20 text-primary"
            }`}>
              وفر 20%
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

