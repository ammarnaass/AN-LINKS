import React from "react";
import { Star, Quote } from "lucide-react";
import { LANDING_TESTIMONIALS } from "../constants/testimonials-data";

export function TestimonialsSection() {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-surface text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
            <Quote className="w-3.5 h-3.5 text-primary" />
            <span>آراء وتجارب المبدعين</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            ماذا يقول صناع المحتوى ورواد الأعمال عنا؟
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            تجارب حقيقية ساعدت صناع المحتوى على توثيق حضورهم ورفع معدل المبيعات بدون تشتت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {LANDING_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed italic">
                  {t.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{t.name}</h4>
                  <p className="text-xs text-on-surface-variant">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

