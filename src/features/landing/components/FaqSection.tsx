"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { LANDING_FAQS } from "../constants/testimonials-data";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-surface text-on-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            كل ما تحتاج معرفته عن منصة روابط
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            إجابات واضحة ومباشرة لأبرز الاستفسارات قبل أن تبدأ رحلتك معنا.
          </p>
        </div>

        <div className="space-y-4">
          {LANDING_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface-container-high/50 border border-white/5 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-5 px-6 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-primary transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

