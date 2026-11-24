"use client";

import React from "react";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";

export function PartnersMarqueeSection() {
  const { locale } = useTranslation();
  const partners = getLandingContent(locale).partners;

  return (
    <section className="w-full py-12 bg-surface-container-low/50 px-6 lg:px-12 border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <p className="text-sm text-on-surface-variant font-semibold tracking-wider text-center mb-8">
          {partners.tag}
        </p>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
          {partners.items.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[28px] transition-colors">
                {partner.icon}
              </span>
              <span className="text-lg font-bold tracking-tight text-on-surface-variant group-hover:text-on-surface transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
