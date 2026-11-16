"use client";

import React from "react";
import { Check } from "lucide-react";
import { THEMES, ThemeConfig } from "../constants/themes";

interface ThemePresetsGridProps {
  selectedThemeKey: string;
  onSelectTheme: (theme: ThemeConfig) => void;
}

interface PresetItem {
  id: string;
  badge: string;
  badgeColor: string;
}

const PRESET_LIST: PresetItem[] = [
  { id: "layanDark", badge: "داكن", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "rawabetLight", badge: "فاخر", badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "emerald", badge: "نيون", badgeColor: "bg-green-500/10 text-green-400 border-green-500/20" },
  { id: "neonPurple", badge: "نيون", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: "oceanBlue", badge: "داكن", badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { id: "sunsetFire", badge: "داكن", badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { id: "desertSand", badge: "فاتح", badgeColor: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  { id: "slateMinimal", badge: "داكن", badgeColor: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  { id: "rosePastel", badge: "فاتح", badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { id: "cyberDark", badge: "نيون", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { id: "freshDawn", badge: "منعش", badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  { id: "pureWhite", badge: "فاتح", badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
];

const ALIAS_MAP: Record<string, string> = {
  midnight: "slateMinimal",
  sunset: "sunsetFire",
  violet: "neonPurple",
  slate: "slateMinimal",
  default: "pureWhite",
};

export function ThemePresetsGrid({ selectedThemeKey, onSelectTheme }: ThemePresetsGridProps) {
  const normalizedKey = ALIAS_MAP[selectedThemeKey] || selectedThemeKey;

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
          12 سمة جاهزة
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PRESET_LIST.map(({ id, badge, badgeColor }) => {
          const theme = THEMES[id];
          if (!theme) return null;
          const isActive = normalizedKey === id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-right group ${
                isActive
                  ? "border-primary bg-surface-container shadow-[0_0_20px_rgba(78,222,163,0.2)] ring-2 ring-primary/30"
                  : "border-outline-variant/30 bg-surface-container-low hover:border-outline-variant hover:bg-surface-container"
              }`}
              dir="rtl"
            >
              {/* Visual Color Pill preview using theme.surfaceColor directly */}
              <div
                className="w-full h-16 rounded-xl border border-white/10 flex items-center justify-center p-2 mb-2 relative overflow-hidden shadow-inner"
                style={{ backgroundColor: theme.surfaceColor }}
              >
                <div
                  className="w-3/4 h-5 rounded-lg shadow-sm flex items-center justify-center text-[10px] font-bold text-white transition-transform group-hover:scale-105"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <span>مثال</span>
                </div>

                {/* Active check indicator */}
                {isActive && (
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Theme Name & Badge */}
              <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                <span className="font-cairo text-xs font-bold text-on-surface truncate flex-1 text-right">
                  {theme.nameAr.split(" (")[0]}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium whitespace-nowrap ${badgeColor}`}>
                  {badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
