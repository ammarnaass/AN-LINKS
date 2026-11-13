"use client";

import React from "react";

interface ButtonAndRadiusPickerProps {
  buttonStyle: string;
  borderRadius: string;
  onStyleChange: (style: string) => void;
  onRadiusChange: (radius: string) => void;
}

const BUTTON_OPTIONS = [
  { id: "filled", label: "ممتلئ (Filled)" },
  { id: "glass", label: "إطار زجاجي (Glass)" },
  { id: "soft", label: "ناعم (Soft Blur)" },
];

const RADIUS_OPTIONS = [
  { id: "rounded-md", label: "حاد (4px)", val: "rounded-md" },
  { id: "rounded-xl", label: "مستدير (12px)", val: "rounded-xl" },
  { id: "rounded-full", label: "بيضاوي (Pill)", val: "rounded-full" },
];

export function ButtonAndRadiusPicker({
  buttonStyle,
  borderRadius,
  onStyleChange,
  onRadiusChange,
}: ButtonAndRadiusPickerProps) {
  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">animation</span>
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">تخصيص الأزرار ونصف القطر</h3>
            <p className="text-xs text-on-surface-variant">نمط عرض الزر وانحناء الحواف</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface mb-2">نمط الأزرار</label>
        <div className="grid grid-cols-3 gap-2">
          {BUTTON_OPTIONS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onStyleChange(st.id)}
              className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                buttonStyle === st.id
                  ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface mb-2">نصف قطر الحواف (Corner Radius)</label>
        <div className="grid grid-cols-3 gap-2">
          {RADIUS_OPTIONS.map((rad) => (
            <button
              key={rad.id}
              type="button"
              onClick={() => onRadiusChange(rad.val)}
              className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                borderRadius === rad.val
                  ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {rad.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
