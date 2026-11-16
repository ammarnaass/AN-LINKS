"use client";

import React, { useState } from "react";
import { Check, Palette, Sparkles, Sliders } from "lucide-react";

export interface BackgroundPickerProps {
  backgroundType: "THEME" | "SOLID" | "GRADIENT";
  customBackground?: string | null;
  activeThemeName?: string;
  onBackgroundChange: (type: "THEME" | "SOLID" | "GRADIENT", value?: string | null) => void;
}

const SOLID_PRESETS = [
  { hex: "#0f131c", label: "ليان داكن" },
  { hex: "#0b0f17", label: "رمادي داكن" },
  { hex: "#020617", label: "أسود ليلي" },
  { hex: "#1e1b4b", label: "نيلي داكن" },
  { hex: "#003824", label: "زمرد داكن" },
  { hex: "#faf7f2", label: "أوف وايت" },
  { hex: "#f8fafc", label: "أبيض نقي" },
  { hex: "#fdfbf7", label: "رمال نجد" },
];

const GRADIENT_PRESETS = [
  { css: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", label: "أزرق ليلي" },
  { css: "linear-gradient(135deg, #003824 0%, #0f131c 100%)", label: "زمرد عميق" },
  { css: "linear-gradient(135deg, #251545 0%, #0f0c1b 100%)", label: "بنفسج نيون" },
  { css: "linear-gradient(135deg, #1c0d0d 0%, #451212 100%)", label: "غروب داكن" },
  { css: "linear-gradient(135deg, #0c1f38 0%, #000000 100%)", label: "محيط حالك" },
  { css: "linear-gradient(135deg, #faf7f2 0%, #ede5d6 100%)", label: "روابط دافئ" },
];

export function BackgroundPicker({
  backgroundType = "THEME",
  customBackground,
  activeThemeName = "السمة الافتراضية",
  onBackgroundChange,
}: BackgroundPickerProps) {
  const [customHex, setCustomHex] = useState(
    customBackground && customBackground.startsWith("#") ? customBackground : "#0f131c"
  );

  const handleTabSelect = (type: "THEME" | "SOLID" | "GRADIENT") => {
    if (type === "THEME") {
      onBackgroundChange("THEME", null);
    } else if (type === "SOLID") {
      const fallbackColor = customBackground && customBackground.startsWith("#") ? customBackground : customHex;
      onBackgroundChange("SOLID", fallbackColor);
    } else {
      const fallbackGrad = customBackground && customBackground.includes("gradient")
        ? customBackground
        : GRADIENT_PRESETS[0].css;
      onBackgroundChange("GRADIENT", fallbackGrad);
    }
  };

  const handleCustomHexChange = (hex: string) => {
    setCustomHex(hex);
    onBackgroundChange("SOLID", hex);
  };

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">خلفية الصفحة (Background)</h3>
            <p className="text-xs text-on-surface-variant">اختر خلفية السمة التلقائية أو لون مسمط أو تدرج لوني فخم</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container rounded-xl border border-outline-variant/20">
        <button
          type="button"
          onClick={() => handleTabSelect("THEME")}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            backgroundType === "THEME"
              ? "bg-surface-container-high text-primary shadow-sm ring-1 ring-primary/30"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>خلفية السمة</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSelect("SOLID")}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            backgroundType === "SOLID"
              ? "bg-surface-container-high text-primary shadow-sm ring-1 ring-primary/30"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>لون مسمط</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSelect("GRADIENT")}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            backgroundType === "GRADIENT"
              ? "bg-surface-container-high text-primary shadow-sm ring-1 ring-primary/30"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>تدرج لوني</span>
        </button>
      </div>

      {/* THEME TAB CONTENT */}
      {backgroundType === "THEME" && (
        <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <p className="text-xs text-on-surface">
              تعتمد الخلفية تلقائياً على السمة المختارة: <span className="font-bold text-primary">{activeThemeName}</span>
            </p>
          </div>
        </div>
      )}

      {/* SOLID COLOR TAB CONTENT */}
      {backgroundType === "SOLID" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-2">ألوان مقترحة (8 خيارات أنيقة)</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {SOLID_PRESETS.map((color) => {
                const isSelected = customBackground?.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleCustomHexChange(color.hex)}
                    title={color.label}
                    className={`h-11 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? "ring-2 ring-primary border-primary scale-105 shadow-md"
                        : "border-white/10 hover:border-outline-variant"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-primary drop-shadow stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">أو اختر لوناً مخصصاً (Hex Color)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customHex}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                className="w-11 h-11 rounded-xl bg-surface-container-lowest border border-outline-variant/40 cursor-pointer p-1"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                dir="ltr"
                placeholder="#0f131c"
                className="flex-1 h-11 px-3 bg-surface-container-lowest text-on-surface rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary text-center font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* GRADIENT TAB CONTENT */}
      {backgroundType === "GRADIENT" && (
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-2">تدرجات عصرية جاهزة (6 خيارات آمنة)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GRADIENT_PRESETS.map((grad) => {
              const isSelected = customBackground === grad.css;
              return (
                <button
                  key={grad.label}
                  type="button"
                  onClick={() => onBackgroundChange("GRADIENT", grad.css)}
                  className={`h-20 rounded-xl border p-2 flex flex-col justify-between items-start text-right transition-all overflow-hidden relative ${
                    isSelected
                      ? "ring-2 ring-primary border-primary shadow-lg"
                      : "border-white/15 hover:border-outline-variant"
                  }`}
                  style={{ background: grad.css }}
                >
                  <span className="text-[11px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {grad.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
