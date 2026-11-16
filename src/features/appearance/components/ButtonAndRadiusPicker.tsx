"use client";

import React from "react";

interface ButtonAndRadiusPickerProps {
  buttonStyle: string;
  borderRadius: string;
  buttonShadow: string;
  onStyleChange: (style: string) => void;
  onRadiusChange: (radius: string) => void;
  onShadowChange: (shadow: string) => void;
}

const BUTTON_STYLE_OPTIONS = [
  { id: "filled", label: "ممتلئ (Filled)" },
  { id: "glass", label: "إطار زجاجي (Glass)" },
  { id: "soft", label: "ناعم (Soft)" },
  { id: "outline", label: "مفرغ (Outline)" },
];

const RADIUS_OPTIONS = [
  { id: "rounded-none", label: "حاد (0px)" },
  { id: "rounded-md", label: "خفيف (6px)" },
  { id: "rounded-xl", label: "مستدير (12px)" },
  { id: "rounded-full", label: "بيضاوي (Full)" },
];

const SHADOW_OPTIONS = [
  { id: "none", label: "بدون ظل (None)" },
  { id: "soft", label: "ظل ناعم (Soft)" },
  { id: "strong", label: "ظل قوي (Strong)" },
  { id: "glow", label: "توهج نيون (Glow)" },
];

const normalizeRadius = (r: string): string => {
  if (r === "none") return "rounded-none";
  if (r === "sm") return "rounded-md";
  if (r === "md" || r === "lg") return "rounded-xl";
  if (r === "full") return "rounded-full";
  return r;
};

export function ButtonAndRadiusPicker({
  buttonStyle,
  borderRadius,
  buttonShadow,
  onStyleChange,
  onRadiusChange,
  onShadowChange,
}: ButtonAndRadiusPickerProps) {
  const currentRadius = normalizeRadius(borderRadius);

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">animation</span>
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">تخصيص الأزرار والظلال</h3>
            <p className="text-xs text-on-surface-variant">نمط عرض الزر وانحناء الحواف وعمق الظل</p>
          </div>
        </div>
      </div>

      {/* Button Style */}
      <div>
        <label className="block text-xs font-semibold text-on-surface mb-2">نمط الأزرار (Button Style)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BUTTON_STYLE_OPTIONS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onStyleChange(st.id)}
              className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                buttonStyle === st.id
                  ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary shadow-sm"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Corner Radius */}
      <div>
        <label className="block text-xs font-semibold text-on-surface mb-2">نصف قطر الحواف (Corner Radius)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RADIUS_OPTIONS.map((rad) => (
            <button
              key={rad.id}
              type="button"
              onClick={() => onRadiusChange(rad.id)}
              className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                currentRadius === rad.id
                  ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary shadow-sm"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {rad.label}
            </button>
          ))}
        </div>
      </div>

      {/* Button Shadow */}
      <div>
        <label className="block text-xs font-semibold text-on-surface mb-2">ظل الأزرار (Button Shadow)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SHADOW_OPTIONS.map((sh) => (
            <button
              key={sh.id}
              type="button"
              onClick={() => onShadowChange(sh.id)}
              className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                (buttonShadow || "none") === sh.id
                  ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary shadow-sm"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {sh.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
