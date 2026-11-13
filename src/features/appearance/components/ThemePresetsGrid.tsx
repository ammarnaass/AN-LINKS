"use client";

import React from "react";
import { Check } from "lucide-react";
import { THEMES, ThemeConfig } from "../constants/themes";

interface ThemePresetsGridProps {
  selectedThemeKey: string;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export function ThemePresetsGrid({ selectedThemeKey, onSelectTheme }: ThemePresetsGridProps) {
  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">style</span>
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">القوالب الجاهزة</h3>
            <p className="text-xs text-on-surface-variant">اختر النمط الجمالي بضغطة واحدة</p>
          </div>
        </div>
        <span className="text-xs text-tertiary font-semibold">{Object.keys(THEMES).length} قوالب متاحة</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(THEMES).map((theme) => {
          const isSelected = selectedThemeKey === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className={`relative p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-surface-container-high border-primary ring-2 ring-primary/40 shadow-lg scale-[1.01]"
                  : "bg-surface-container border-outline-variant/30 hover:border-outline-variant/60"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3" />
                  <span>المفعل</span>
                </div>
              )}

              <div className={`h-20 rounded-lg p-2.5 mb-2 relative overflow-hidden flex flex-col justify-between ${theme.backgroundClass} border border-white/10`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: `${theme.accentColor}33`, color: theme.accentColor }}>
                  ●
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: `${theme.accentColor}66` }} />
                  <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-on-surface text-sm">{theme.nameAr}</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{theme.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

