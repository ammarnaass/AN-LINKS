"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LANDING_TEMPLATES, LandingTemplate } from "../constants/templates-data";

function GalleryHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-12">
      <span className="text-xs uppercase tracking-widest text-primary font-bold">
        تجربة حية تفاعلية
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
        لكل مبدع بصمته الخاصة.. تصفّح النماذج الجاهزة
      </h2>
      <p className="text-sm text-on-surface-variant max-w-xl">
        اضغط على الفئة لتشاهد كيف تتحول صفحة الروابط على الفور بما يناسب طبيعة نشاطك وجمهورك المستهدف.
      </p>
    </div>
  );
}

function CategoryTabs({
  activeCat,
  onSelect,
}: {
  activeCat: string;
  onSelect: (cat: LandingTemplate["category"]) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 bg-surface-container rounded-xl">
      {LANDING_TEMPLATES.map((tmpl) => {
        const isActive = activeCat === tmpl.category;
        return (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelect(tmpl.category)}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tmpl.categoryName}
          </button>
        );
      })}
    </div>
  );
}

function ShowcaseCard({ template }: { template: LandingTemplate }) {
  return (
    <div className="w-full max-w-3xl bg-surface-container-high rounded-xl p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] border border-white/5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-surface-container-highest">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg shrink-0">
            <img className="w-full h-full object-cover" alt={template.creatorName} src={template.avatarUrl} />
          </div>
          <div className="flex flex-col text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-xl font-bold text-on-surface">{template.creatorName}</h4>
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">{template.bio}</p>
            <span className="font-mono text-primary text-xs font-semibold mt-2" dir="ltr">
              {template.url}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {template.links.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer border border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${link.color || "text-primary"} text-[22px]`}>
                  {link.icon}
                </span>
                <span className="text-sm font-semibold text-on-surface">{link.title}</span>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">arrow_back</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-on-surface-variant">أكثر من 120 قالباً مهيأ لكافة المنصات والمجالات</span>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-highest text-on-surface hover:text-primary hover:bg-surface-bright text-xs font-bold transition-colors"
          >
            <span>تصفح كافة القوالب الحية</span>
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TemplateGallerySection() {
  const [activeCategory, setActiveCategory] = useState<LandingTemplate["category"]>("creator");
  const currentTemplate =
    LANDING_TEMPLATES.find((t) => t.category === activeCategory) || LANDING_TEMPLATES[0];

  return (
    <section id="live-demos" className="w-full py-24 px-6 lg:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <GalleryHeader />
        <CategoryTabs activeCat={activeCategory} onSelect={setActiveCategory} />
        <div className="mt-8 w-full flex justify-center">
          <ShowcaseCard template={currentTemplate} />
        </div>
      </div>
    </section>
  );
}
