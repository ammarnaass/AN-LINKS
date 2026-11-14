"use client";

import React from "react";
import { THEMES, ThemeConfig } from "../constants/themes";
import { ThemePreviewSwatch } from "@/shared/ui";

interface ThemePresetsGridProps {
  selectedThemeKey: string;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export function ThemePresetsGrid({ selectedThemeKey, onSelectTheme }: ThemePresetsGridProps) {
  const getSurfaceColor = (id: string): string => {
    switch (id) {
      case "rawabetLight":
        return "#faf7f2";
      case "default":
        return "#f3f4f6";
      case "midnight":
        return "#020617";
      case "sunset":
        return "#4c0519";
      case "gold":
        return "#1c160c";
      default:
        return "#181c24";
    }
  };

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">style</span>
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">القوالب والسمات الجاهزة</h3>
            <p className="text-xs text-on-surface-variant">اختر النمط الجمالي المتوافق بضغطة واحدة</p>
          </div>
        </div>
        <span className="text-xs text-tertiary font-semibold">
          {Object.keys(THEMES).length} سمات متاحة
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.values(THEMES).map((theme) => (
          <ThemePreviewSwatch
            key={theme.id}
            themeKey={theme.id}
            nameAr={theme.nameAr}
            primaryColor={theme.accentColor}
            surfaceColor={getSurfaceColor(theme.id)}
            accentColor={theme.accentColor}
            isActive={selectedThemeKey === theme.id}
            onSelect={() => onSelectTheme(theme)}
          />
        ))}
      </div>
    </section>
  );
}
