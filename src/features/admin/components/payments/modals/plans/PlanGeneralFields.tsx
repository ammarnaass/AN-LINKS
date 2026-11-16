"use client";

import React from "react";
import { AppInput } from "@/shared/ui";

export interface PlanGeneralData {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  badgeAr: string;
  sortOrder: number;
  isActive: boolean;
}

export const INITIAL_PLAN_GENERAL: PlanGeneralData = {
  slug: "", nameAr: "", nameEn: "", descriptionAr: "", badgeAr: "", sortOrder: 0, isActive: true,
};

export interface PlanGeneralFieldsProps {
  data: PlanGeneralData;
  onChange: <K extends keyof PlanGeneralData>(key: K, value: PlanGeneralData[K]) => void;
  isEditing: boolean;
}

export function PlanGeneralFields({ data, onChange, isEditing }: PlanGeneralFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AppInput
          label="المعرف الفريد (Slug)" placeholder="pro, creator, agency..."
          value={data.slug} onChange={(e) => onChange("slug", e.target.value)} disabled={isEditing}
        />
        <AppInput
          label="الاسم بالعربية" placeholder="باقة المحترفين"
          value={data.nameAr} onChange={(e) => onChange("nameAr", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AppInput
          label="الاسم بالإنجليزية" placeholder="Pro Plan"
          value={data.nameEn} onChange={(e) => onChange("nameEn", e.target.value)}
        />
        <AppInput
          label="شارة مميزة (Badge)" placeholder="الأكثر طلباً، خصم 20%..."
          value={data.badgeAr} onChange={(e) => onChange("badgeAr", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface mb-1">وصف مختصر للباقة</label>
        <textarea
          rows={2} placeholder="مناسبة لصناع المحتوى وأصحاب المشاريع الناشئة..."
          value={data.descriptionAr} onChange={(e) => onChange("descriptionAr", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        <AppInput label="ترتيب الظهور (Sort Order)" type="number" value={data.sortOrder} onChange={(e) => onChange("sortOrder", Number(e.target.value))} />
        <div className="flex items-center gap-3 pt-4">
          <label className="text-xs font-bold text-on-surface">حالة الباقة:</label>
          <button
            type="button" onClick={() => onChange("isActive", !data.isActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              data.isActive ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
            }`}
          >
            {data.isActive ? "نشطة ومتاحة" : "معطلة أو مسودة"}
          </button>
        </div>
      </div>
    </>
  );
}

export default PlanGeneralFields;
