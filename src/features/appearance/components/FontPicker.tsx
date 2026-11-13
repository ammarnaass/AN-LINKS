"use client";

import React from "react";
import { FONTS } from "../constants/themes";

interface FontPickerProps {
  selectedFont: string;
  onFontChange: (fontKey: string) => void;
}

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
            <p className="text-xs text-on-surface-variant">اختر خط العرض المناسب لهويتك</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {Object.entries(FONTS).map(([fontKey, font]) => (
          <button
            key={fontKey}
            type="button"
            onClick={() => onFontChange(fontKey)}
            className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
              selectedFont === fontKey
                ? "bg-surface-container-high border-primary ring-1 ring-primary text-primary"
                : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="font-bold text-sm text-on-surface">{font.name}</span>
            <span className="text-xs opacity-75 mt-1">{font.nameAr}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

