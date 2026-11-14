import React from "react";
import { Check } from "lucide-react";

export interface ThemePreviewSwatchProps {
  themeKey: string;
  nameAr: string;
  primaryColor: string;
  surfaceColor: string;
  accentColor: string;
  isActive: boolean;
  onSelect: (themeKey: string) => void;
}

export function ThemePreviewSwatch({
  themeKey,
  nameAr,
  primaryColor,
  surfaceColor,
  accentColor,
  isActive,
  onSelect,
}: ThemePreviewSwatchProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(themeKey)}
      className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-right group ${
        isActive
          ? "border-primary bg-surface-container shadow-[0_0_20px_rgba(78,222,163,0.2)] ring-2 ring-primary/30"
          : "border-outline-variant/30 bg-surface-container-low hover:border-outline-variant hover:bg-surface-container"
      }`}
      dir="rtl"
    >
      {/* Visual Color Pill preview */}
      <div
        className="w-full h-16 rounded-xl border border-white/10 flex items-center justify-center p-2 mb-2.5 relative overflow-hidden shadow-inner"
        style={{ backgroundColor: surfaceColor }}
      >
        <div
          className="w-3/4 h-5 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-white transition-transform group-hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: accentColor }} />
          <span>مثال</span>
        </div>

        {isActive && (
          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        )}
      </div>

      <span className="font-cairo text-xs font-bold text-on-surface truncate w-full text-center">
        {nameAr}
      </span>
    </button>
  );
}

