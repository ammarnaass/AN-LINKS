import React from "react";
import type { ProfileData } from "@/features/bio";
import { THEMES, FONTS, BUTTON_STYLES, BUTTON_SHADOWS } from "../constants/themes";
import { sanitizeCustomBackground } from "./sanitizer";

export interface ResolvedThemeStyles {
  backgroundClass: string;
  backgroundStyle?: React.CSSProperties;
  cardClass: string;
  buttonClass: string;
  buttonStyleProps?: React.CSSProperties;
  textPrimaryClass: string;
  textSecondaryClass: string;
  socialIconClass: string;
  fontClass: string;
  surfaceColor: string;
}

function resolveBackground(
  themeBackgroundClass: string,
  backgroundType?: string | null,
  customBackground?: string | null
): { backgroundClass: string; backgroundStyle?: React.CSSProperties } {
  if (backgroundType === "SOLID" && customBackground) {
    const sanitized = sanitizeCustomBackground(customBackground);
    if (sanitized && /^#([0-9a-fA-F]{3,8})$/.test(sanitized)) {
      return {
        backgroundClass: "",
        backgroundStyle: { backgroundColor: sanitized },
      };
    }
  }

  if (backgroundType === "GRADIENT" && customBackground) {
    const sanitized = sanitizeCustomBackground(customBackground);
    if (sanitized && /^(linear-gradient|radial-gradient)\([^;{}]+\)$/i.test(sanitized)) {
      return {
        backgroundClass: "",
        backgroundStyle: { background: sanitized },
      };
    }
  }

  return {
    backgroundClass: themeBackgroundClass,
    backgroundStyle: undefined,
  };
}

function resolveButtonClass(
  themeButtonClass: string,
  buttonStyle?: string | null,
  buttonShadow?: string | null
): string {
  const styleModifier = BUTTON_STYLES[buttonStyle || "filled"] || BUTTON_STYLES.filled;
  const shadowModifier = BUTTON_SHADOWS[buttonShadow || "none"] || BUTTON_SHADOWS.none;
  return `${themeButtonClass} ${styleModifier} ${shadowModifier}`.trim();
}

export function resolveThemeStyles(
  profile?: Partial<ProfileData> | null
): ResolvedThemeStyles {
  const themeKey = profile?.themeKey || "layanDark";
  const theme = THEMES[themeKey] || THEMES.layanDark;

  const { backgroundClass, backgroundStyle } = resolveBackground(
    theme.backgroundClass,
    profile?.backgroundType,
    profile?.customBackground
  );

  const fontKey = profile?.font || "Cairo";
  const fontClass = FONTS[fontKey]?.className || "font-cairo";
  const buttonClass = resolveButtonClass(
    theme.buttonClass,
    profile?.buttonStyle,
    profile?.buttonShadow
  );

  return {
    backgroundClass,
    backgroundStyle,
    cardClass: theme.cardClass,
    buttonClass,
    buttonStyleProps: undefined,
    textPrimaryClass: theme.textPrimary,
    textSecondaryClass: theme.textSecondary,
    socialIconClass: theme.socialIconClass,
    fontClass,
    surfaceColor: theme.surfaceColor,
  };
}
