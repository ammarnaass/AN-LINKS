"use client";

import React from "react";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";

export function TestimonialsSection() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).testimonials;

  return (
    <section id="testimonials" className="w-full py-24 px-6 lg:px-12 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            {content.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
            {content.title}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 bg-surface-container-low rounded-xl shadow-sm border border-white/5"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]">
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm text-on-surface leading-relaxed">{t.quote}</p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-surface-container-high">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" alt={t.name} src={t.avatarUrl} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">{t.name}</span>
                  <span className="text-xs text-on-surface-variant">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
