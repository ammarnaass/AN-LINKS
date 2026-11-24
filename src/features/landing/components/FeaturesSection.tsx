"use client";

import React from "react";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";

function FeaturesHeader() {
  const { locale } = useTranslation();
  const f = getLandingContent(locale).features;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          {f.tag}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
          {f.title}
        </h2>
      </div>
      <p className="text-sm text-on-surface-variant max-w-md">
        {f.subtitle}
      </p>
    </div>
  );
}

function BrokenLinkCard() {
  const { locale } = useTranslation();
  const s = getLandingContent(locale).features.sentinel;

  return (
    <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="flex flex-col gap-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">link_off</span>
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-on-surface">{s.title}</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">{s.badge}</span>
        </div>
        <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
          {s.desc}
        </p>
      </div>

      <div className="mt-8 z-10 bg-surface-container-high/90 rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">chat</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">{s.alertTitle}</span>
            <span className="text-xs text-on-surface-variant">{s.alertDesc}</span>
          </div>
        </div>
        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold">
          {s.alertStatus}
        </span>
      </div>
    </div>
  );
}

function ArabicTypographyCard() {
  const { locale } = useTranslation();
  const typo = getLandingContent(locale).features.typography;

  return (
    <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary-container/15 rounded-full blur-[70px] pointer-events-none" />
      <div className="flex flex-col gap-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">palette</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">{typo.title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {typo.desc}
        </p>
      </div>
      <div className="mt-8 z-10 flex flex-wrap gap-2.5">
        {typo.fonts.map((f, i) => (
          <span
            key={f}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              i === typo.fonts.length - 1 ? "bg-secondary-container/40 text-secondary" : "bg-surface-container-high text-on-surface hover:text-primary"
            }`}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnalyticsCard() {
  const { locale } = useTranslation();
  const a = getLandingContent(locale).features.analytics;

  return (
    <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">query_stats</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">{a.title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {a.desc}
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-2 bg-surface-container-high/60 p-4 rounded-xl border border-white/5">
        <div className="flex justify-between items-center text-on-surface-variant text-xs">
          <span>{a.ctrLabel}</span>
          <span className="text-tertiary font-bold font-mono">18.4%</span>
        </div>
        <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary h-full w-[65%] rounded-full" />
          <div className="bg-tertiary h-full w-[25%]" />
        </div>
        <div className="flex justify-between text-outline text-[11px] font-mono mt-1">
          <span>{a.sources.ig}</span>
          <span>{a.sources.tt}</span>
          <span>{a.sources.other}</span>
        </div>
      </div>
    </div>
  );
}

function InstantCommerceCard() {
  const { locale } = useTranslation();
  const c = getLandingContent(locale).features.commerce;

  return (
    <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">payments</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">{c.title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {c.desc}
        </p>
      </div>
      <div className="mt-8 flex items-center gap-3 p-3 bg-surface-container-high/60 rounded-xl border border-white/5">
        <span className="material-symbols-outlined text-primary text-[24px]">contactless</span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-on-surface">{c.oneClick}</span>
          <span className="text-[11px] text-on-surface-variant">{c.oneClickDesc}</span>
        </div>
      </div>
    </div>
  );
}

function DynamicQrCard() {
  const { locale } = useTranslation();
  const qr = getLandingContent(locale).features.qr;

  return (
    <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">{qr.title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {qr.desc}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between p-3 bg-surface-container-high/60 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-surface-container-lowest p-1.5 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[36px]">qr_code</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">SVG / PNG / PDF</span>
            <span className="text-[11px] text-on-surface-variant">300 DPI Vector</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary text-[20px]">download</span>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 px-6 lg:px-12 bg-surface-container-lowest relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <FeaturesHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          <BrokenLinkCard />
          <ArabicTypographyCard />
          <AnalyticsCard />
          <InstantCommerceCard />
          <DynamicQrCard />
        </div>
      </div>
    </section>
  );
}
