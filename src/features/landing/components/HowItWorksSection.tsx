"use client";

import React from "react";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";

const STEP_STYLES = [
  {
    numColor: "text-primary",
    hoverBg: "group-hover:bg-primary-container group-hover:text-on-primary-container",
    badgeIcon: "verified",
    badgeColor: "text-primary",
  },
  {
    numColor: "text-secondary",
    hoverBg: "group-hover:bg-secondary-container group-hover:text-secondary-fixed",
    badgeIcon: "drag_indicator",
    badgeColor: "text-secondary",
  },
  {
    numColor: "text-tertiary",
    hoverBg: "group-hover:bg-tertiary-container group-hover:text-on-tertiary",
    badgeIcon: "insights",
    badgeColor: "text-tertiary",
  },
];

export function HowItWorksSection() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).howItWorks;

  return (
    <section className="w-full py-24 px-6 lg:px-12 bg-surface-container-lowest relative">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {content.steps.map((step, idx) => {
            const style = STEP_STYLES[idx] || STEP_STYLES[0];
            return (
              <div
                key={step.num}
                className="flex flex-col p-8 bg-surface-container-low rounded-xl relative group hover:bg-surface-container transition-colors shadow-sm border border-white/5"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-surface-container-high ${style.numColor} flex items-center justify-center text-2xl font-bold mb-6 ${style.hoverBg} transition-all`}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-3">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                <div className={`mt-6 flex items-center gap-2 ${style.badgeColor} text-xs font-semibold`}>
                  <span className="material-symbols-outlined text-[18px]">{style.badgeIcon}</span>
                  <span>{step.badgeText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
