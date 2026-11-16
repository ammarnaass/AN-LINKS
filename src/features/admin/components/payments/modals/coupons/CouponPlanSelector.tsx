"use client";

import React from "react";

export interface PlanSlugItem {
  slug: string;
  nameAr: string;
}

export const DEFAULT_PLAN_SLUGS: PlanSlugItem[] = [
  { slug: "creator", nameAr: "صانع المحتوى" },
  { slug: "pro", nameAr: "المحترف" },
  { slug: "agency", nameAr: "الوكالات" },
];

export interface CouponPlanSelectorProps {
  availablePlanSlugs: PlanSlugItem[];
  selectedPlanSlugs: string[];
  onTogglePlanSlug: (slug: string) => void;
}

export function CouponPlanSelector({
  availablePlanSlugs, selectedPlanSlugs, onTogglePlanSlug,
}: CouponPlanSelectorProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <label className="block text-xs font-semibold text-on-surface">
        الباقات المشمولة بالخصم (اختياري، اتركه غير محدد لتطبيقه على كل الباقات)
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        {availablePlanSlugs.map((p) => {
          const isSelected = selectedPlanSlugs.includes(p.slug);
          return (
            <button
              key={p.slug} type="button" onClick={() => onTogglePlanSlug(p.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isSelected ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/30"
              }`}
            >
              {p.nameAr} ({p.slug})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CouponPlanSelector;
