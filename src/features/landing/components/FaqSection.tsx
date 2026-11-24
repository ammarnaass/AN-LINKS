"use client";

import React, { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";

export function FaqSection() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).faq;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full py-24 px-6 lg:px-12 bg-surface-container-low">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            {content.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
            {content.title}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {content.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {content.items.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-white/5"
              >
                <button
                  className="w-full p-6 text-start flex items-center justify-between gap-4 text-base sm:text-lg text-on-surface font-semibold hover:text-primary transition-colors cursor-pointer"
                  onClick={() => toggle(faq.id)}
                  type="button"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-on-surface-variant text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
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
