import React from "react";
import Link from "next/link";
import { Check, ArrowLeft, Star } from "lucide-react";
import { PricingPlan, calculatePrice } from "../types/pricing.types";

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
}

export function PricingCard({ plan, isYearly }: PricingCardProps) {
  const price = calculatePrice(plan, isYearly);
  const isFree = plan.priceMonthly === 0;

  return (
    <div
      className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
        plan.isPopular
          ? "bg-surface-container-high/90 border-2 border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/30"
          : "bg-surface-container/60 border border-white/5 hover:border-white/15 shadow-xl"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-md flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>الأكثر طلباً</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <span className="text-xs font-medium text-primary block mb-1">{plan.tag}</span>
          <h3 className="text-xl font-bold text-on-surface">{plan.name}</h3>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed min-h-[40px]">
            {plan.description}
          </p>
        </div>

        {/* Price Display */}
        <div className="pt-2 pb-4 border-b border-outline-variant/15 flex items-baseline gap-2">
          {isFree ? (
            <span className="text-3xl sm:text-4xl font-black text-on-surface">مجاناً</span>
          ) : (
            <>
              <span className="text-3xl sm:text-4xl font-black text-on-surface">${price}</span>
              <span className="text-xs text-on-surface-variant">/ شهرياً</span>
              {isYearly && (
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-md font-bold">
                  تُدفع سنوياً
                </span>
              )}
            </>
          )}
        </div>

        {/* Features Checklist */}
        <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
          {plan.features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="leading-snug text-on-surface">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="pt-8">
        <Link
          href={plan.ctaLink}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            plan.isPopular
              ? "bg-primary text-on-primary hover:bg-primary-container shadow-[0_0_20px_rgba(78,222,163,0.3)]"
              : "bg-surface-container-highest hover:bg-surface-container-high text-on-surface border border-white/5"
          }`}
        >
          <span>{plan.ctaText}</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
