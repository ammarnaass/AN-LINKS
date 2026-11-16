"use client";

import React from "react";
import { FONTS } from "../constants/themes";

interface FontPickerProps {
  selectedFont: string;
  onFontChange: (fontKey: string) => void;
}

const ORDERED_FONTS = ["Cairo", "Tajawal", "IBMPlex", "Almarai", "ReadexPro"] as const;

export function FontPicker({ selectedFont, onFontChange }: FontPickerProps) {
  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">text_fields</span>
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">الخطوط العربية والطباعة</h3>
            <p className="text-xs text-on-surface-variant">اختر خط العرض المناسب لهويتك (5 خطوط مدمجة)</p>
          </div>
        </div>
        <span className="text-xs text-primary font-semibold">
          {ORDERED_FONTS.length} خطوط عربية
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ORDERED_FONTS.map((fontKey) => {
          const font = FONTS[fontKey];
          if (!font) return null;
          const isSelected = (selectedFont || "Cairo") === fontKey;

          return (
            <button
              key={fontKey}
              type="button"
              onClick={() => onFontChange(fontKey)}
              className={`p-4 rounded-xl border text-right transition flex flex-col justify-between gap-3 ${
                isSelected
                  ? "bg-surface-container-high border-primary ring-2 ring-primary/30 shadow-md"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-on-surface">{font.name}</span>
                <span className="text-xs opacity-75">{font.nameAr.split(" (")[0]}</span>
              </div>

              {/* Sample sentence applying the actual CSS font class */}
              <div
                className={`w-full py-2 px-3 rounded-lg bg-surface-container-lowest/80 border border-white/5 text-center text-sm font-semibold text-on-surface ${font.className}`}
              >
                روابطك الذكية في مكان واحد
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
