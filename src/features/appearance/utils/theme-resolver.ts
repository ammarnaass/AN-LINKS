import React from "react";
import type { ProfileData } from "@/features/bio";
import { THEMES, FONTS, BUTTON_STYLES, BUTTON_SHADOWS, CARD_STYLES } from "../constants/themes";
import { sanitizeCustomBackground } from "./sanitizer";

export interface ResolvedThemeStyles {
  isDark: boolean;
  colorModeClass: "bio-theme-dark" | "bio-theme-light";
  backgroundClass: string;
  backgroundStyle?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
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

  if (backgroundType === "IMAGE" && customBackground) {
    const sanitized = sanitizeCustomBackground(customBackground);
    if (sanitized) {
      return {
        backgroundClass: "bg-cover bg-center bg-no-repeat",
        backgroundStyle: { backgroundImage: `url(${sanitized})` },
      };
    }
  }

  return {
    backgroundClass: themeBackgroundClass,
    backgroundStyle: undefined,
  };
}

function resolveOverlayStyle(
  backgroundType?: string | null,
  bgOverlayOpacity?: number | null
): React.CSSProperties | undefined {
  if (backgroundType === "IMAGE") {
    const opacity = (bgOverlayOpacity !== undefined && bgOverlayOpacity !== null ? bgOverlayOpacity : 40) / 100;
    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    };
  }
  return undefined;
}

function resolveButtonClass(
  themeButtonClass: string,
  buttonStyle?: string | null,
  buttonShadow?: string | null,
  cardStyle?: string | null
): string {
  const styleModifier = BUTTON_STYLES[buttonStyle || "filled"] || BUTTON_STYLES.filled;
  const effectiveShadow = buttonShadow || "none";
  const shadowModifier = BUTTON_SHADOWS[effectiveShadow] || BUTTON_SHADOWS.none;
  const cardGlow = cardStyle === "glow" && effectiveShadow === "none" ? "hover:border-primary/60 hover:shadow-[0_0_15px_rgba(78,222,163,0.2)]" : "";
  return `${themeButtonClass} ${styleModifier} ${shadowModifier} ${cardGlow}`.trim();
}

function resolveCardClass(themeCardClass: string, cardStyle?: string | null): string {
  if (cardStyle && CARD_STYLES[cardStyle]) {
    return CARD_STYLES[cardStyle];
  }
  return themeCardClass || CARD_STYLES.glass;
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

  const overlayStyle = resolveOverlayStyle(
    profile?.backgroundType,
    profile?.bgOverlayOpacity
  );

  const fontKey = profile?.font || "Cairo";
  const fontClass = FONTS[fontKey]?.className || "font-cairo";
  const buttonClass = resolveButtonClass(
    theme.buttonClass,
    profile?.buttonStyle,
    profile?.buttonShadow,
    profile?.cardStyle
  );
  const cardClass = resolveCardClass(theme.cardClass, profile?.cardStyle);

  const isDark = theme.isDark;
  const colorModeClass = isDark ? "bio-theme-dark" : "bio-theme-light";

  return {
    isDark,
    colorModeClass,
    backgroundClass,
    backgroundStyle,
    overlayStyle,
    cardClass,
    buttonClass,
    buttonStyleProps: undefined,
    textPrimaryClass: theme.textPrimary,
    textSecondaryClass: theme.textSecondary,
    socialIconClass: theme.socialIconClass,
    fontClass,
    surfaceColor: theme.surfaceColor,
  };
}
