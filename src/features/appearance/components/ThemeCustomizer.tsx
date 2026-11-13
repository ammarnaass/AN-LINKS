"use client";

import React from "react";
import { THEMES, ThemeConfig } from "../constants/themes";
import { ProfileData } from "../types/appearance.types";
import { ProfileEditorCard } from "./ProfileEditorCard";
import { ThemePresetsGrid } from "./ThemePresetsGrid";
import { ButtonAndRadiusPicker } from "./ButtonAndRadiusPicker";
import { FontPicker } from "./FontPicker";

interface ThemeCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}

export function ThemeCustomizer({ profile, onProfileChange }: ThemeCustomizerProps) {
  const handleChange = (field: keyof ProfileData, value: string) => {
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

      <ButtonAndRadiusPicker
        buttonStyle={profile.buttonStyle || "filled"}
        borderRadius={profile.borderRadius || "rounded-xl"}
        onStyleChange={(st) => handleChange("buttonStyle", st)}
        onRadiusChange={(rad) => handleChange("borderRadius", rad)}
      />

      <FontPicker
        selectedFont={profile.font || "Cairo"}
        onFontChange={(f) => handleChange("font", f)}
      />
    </div>
  );
}

