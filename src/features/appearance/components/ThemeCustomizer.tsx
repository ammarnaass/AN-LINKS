"use client";

import React from "react";
import { THEMES, ThemeConfig } from "../constants/themes";
import { ProfileData } from "../types/appearance.types";
import { ProfileEditorCard } from "./ProfileEditorCard";
import { ThemePresetsGrid } from "./ThemePresetsGrid";
import { BackgroundPicker } from "./BackgroundPicker";
import { ButtonAndRadiusPicker } from "./ButtonAndRadiusPicker";
import { FontPicker } from "./FontPicker";
import { CardStylePicker } from "./CardStylePicker";
import { CardStyle } from "../types/appearance.types";

interface ThemeCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}

export function ThemeCustomizer({ profile, onProfileChange }: ThemeCustomizerProps) {
  const handleChange = (field: keyof ProfileData, value: string | boolean) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  const handleSelectTheme = (theme: ThemeConfig) => {
    onProfileChange({
      ...profile,
      themeKey: theme.id,
      accentColor: theme.accentColor,
    });
  };

  const handleBackgroundChange = (
    type: "THEME" | "SOLID" | "GRADIENT" | "IMAGE",
    value?: string | null
  ) => {
    onProfileChange({
      ...profile,
      backgroundType: type,
      customBackground: value ?? null,
    });
  };

  const currentTheme =
    profile.themeKey && THEMES[profile.themeKey]
      ? THEMES[profile.themeKey]
      : THEMES.layanDark;

  return (
    <div className="space-y-6">
      <ProfileEditorCard
        profile={profile}
        currentTheme={currentTheme}
        onChange={handleChange}
      />

      <ThemePresetsGrid
        selectedThemeKey={profile.themeKey || "layanDark"}
        onSelectTheme={handleSelectTheme}
      />

      <BackgroundPicker
        backgroundType={(profile.backgroundType as "THEME" | "SOLID" | "GRADIENT" | "IMAGE") || "THEME"}
        customBackground={profile.customBackground}
        bgOverlayOpacity={profile.bgOverlayOpacity}
        activeThemeName={currentTheme.nameAr}
        onBackgroundChange={handleBackgroundChange}
        onOverlayOpacityChange={(op) => onProfileChange({ ...profile, bgOverlayOpacity: op })}
      />

      <CardStylePicker
        cardStyle={(profile.cardStyle as CardStyle) || "glass"}
        onCardStyleChange={(st) => handleChange("cardStyle", st)}
      />

      <ButtonAndRadiusPicker
        buttonStyle={profile.buttonStyle || "filled"}
        borderRadius={profile.borderRadius || "rounded-xl"}
        buttonShadow={profile.buttonShadow || "none"}
        onStyleChange={(st) => handleChange("buttonStyle", st)}
        onRadiusChange={(rad) => handleChange("borderRadius", rad)}
        onShadowChange={(sh) => handleChange("buttonShadow", sh)}
      />

      <FontPicker
        selectedFont={profile.font || "Cairo"}
        onFontChange={(f) => handleChange("font", f)}
      />

      {/* Social Position Picker */}
      <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </span>
            <div>
              <h3 className="font-bold text-on-surface text-base">موضع شبكات التواصل الاجتماعي</h3>
              <p className="text-xs text-on-surface-variant">حدد ما إذا كانت الأيقونات تظهر أعلى الروابط أو أسفلها</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChange("socialPosition", "top")}
            className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
              (profile.socialPosition || "top") === "top"
                ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary shadow-sm"
                : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="font-bold text-xs">أعلى الروابط (Top)</span>
            <span className="text-[11px] opacity-75">تحت النبذة التعريفية مباشرة</span>
          </button>

          <button
            type="button"
            onClick={() => handleChange("socialPosition", "bottom")}
            className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
              profile.socialPosition === "bottom"
                ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary shadow-sm"
                : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="font-bold text-xs">أسفل الروابط (Bottom)</span>
            <span className="text-[11px] opacity-75">في نهاية الصفحة أسفل جميع الروابط</span>
          </button>
        </div>
      </section>
    </div>
  );
}
