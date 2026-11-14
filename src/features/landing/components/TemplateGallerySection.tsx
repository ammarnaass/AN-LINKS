"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import { LANDING_TEMPLATES, LandingTemplate } from "../constants/templates-data";

export function TemplateGallerySection() {
  const [activeCategory, setActiveCategory] = useState<LandingTemplate["category"]>("visual");

  const currentTemplate =
    LANDING_TEMPLATES.find((t) => t.category === activeCategory) || LANDING_TEMPLATES[0];

  return (
    <section id="templates" className="py-20 sm:py-28 bg-surface-container-lowest border-b border-outline-variant/20 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>معرض النماذج الجاهزة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            لكل مبدع بصمته الخاصة.. تصفّح النماذج
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            اضغط على الفئة لتشاهد كيف تتحول صفحة الروابط على الفور بما يناسب طبيعة نشاطك وجمهورك.
          </p>

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {LANDING_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setActiveCategory(tmpl.category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === tmpl.category
                    ? "bg-primary text-on-primary shadow-[0_0_16px_rgba(78,222,163,0.35)]"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-white/5"
                }`}
              >
                {tmpl.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Template Preview Display */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-surface-container-low/90 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src={currentTemplate.avatarUrl}
                alt={currentTemplate.creatorName}
                className="w-20 h-20 rounded-full object-cover shadow-xl ring-2 ring-primary/40"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center shadow">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-extrabold text-on-surface">{currentTemplate.creatorName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                  {currentTemplate.role}
                </span>
              </div>
              <p className="text-xs text-primary font-mono mt-0.5" dir="ltr">@{currentTemplate.handle}</p>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
              {currentTemplate.bio}
            </p>

            <div className="w-full space-y-2.5 pt-2 text-right">
              {currentTemplate.links.map((link, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/5 flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {link.title}
                      </span>
                      {link.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant">{link.subtitle}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-on-surface-variant flex items-center gap-1.5">
              <span>القالب المعتمد:</span>
              <strong className="text-primary">{currentTemplate.themeName}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

