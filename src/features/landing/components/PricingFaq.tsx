"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { PRICING_FAQS } from "../constants/pricing-plans";

export function PricingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="py-16 max-w-3xl mx-auto px-4">
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span>الأسئلة المتكررة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          كل ما تحتاج معرفته عن الاشتراك
        </h2>
      </div>

      <div className="space-y-3">
        {PRICING_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-surface-container/60 border border-white/5 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full py-4 px-6 text-right flex items-center justify-between gap-4 font-bold text-sm text-on-surface hover:text-primary transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

