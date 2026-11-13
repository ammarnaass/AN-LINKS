export interface ThemeDefinition {
  id: string;
  name: string;
  nameAr: string;
  isDark: boolean;
  colors: {
    surface: string;
    "surface-container-lowest": string;
    "surface-container-low": string;
    "surface-container": string;
    "surface-container-high": string;
    "surface-container-highest": string;
    "on-surface": string;
    "on-surface-variant": string;
    primary: string;
    "on-primary": string;
    "primary-container": string;
    "on-primary-container": string;
    secondary: string;
    "secondary-container": string;
    tertiary: string;
    "tertiary-container": string;
    outline: string;
    "outline-variant": string;
  };
}

export const STITCH_THEMES: Record<string, ThemeDefinition> = {
  layanDark: {
    id: "layanDark",
    name: "Layan Dark Arabic Bento",
    nameAr: "ليان بانتو الليلي",
    isDark: true,
    colors: {
      surface: "#0f131c",
      "surface-container-lowest": "#0a0e16",
      "surface-container-low": "#181c24",
      "surface-container": "#1c2028",
      "surface-container-high": "#262a33",
      "surface-container-highest": "#31353e",
      "on-surface": "#dfe2ee",
      "on-surface-variant": "#bbcabf",
      primary: "#4edea3",
      "on-primary": "#003824",
      "primary-container": "#10b981",
      "on-primary-container": "#00422b",
      secondary: "#d0bcff",
      "secondary-container": "#571bc1",
      tertiary: "#4cd7f6",
      "tertiary-container": "#00b2d0",
      outline: "#86948a",
      "outline-variant": "#3c4a42",
    },
  },
  rawabetLight: {
    id: "rawabetLight",
    name: "Rawabet Luxury Light",
    nameAr: "روابط لاكجري المشرق",
    isDark: false,
    colors: {
      surface: "#faf8ff",
      "surface-container-lowest": "#ffffff",
      "surface-container-low": "#f2f3ff",
      "surface-container": "#eaedff",
      "surface-container-high": "#e2e7ff",
      "surface-container-highest": "#dae2fd",
      "on-surface": "#131b2e",
      "on-surface-variant": "#3d4a42",
      primary: "#006948",
      "on-primary": "#ffffff",
      "primary-container": "#00855d",
      "on-primary-container": "#f5fff7",
      secondary: "#006c49",
      "secondary-container": "#6cf8bb",
      tertiary: "#00694c",
      "tertiary-container": "#1e8462",
      outline: "#6d7a72",
      "outline-variant": "#bccac0",
    },
  },
};

export function getThemeTokens(themeKey?: string): ThemeDefinition {
  if (themeKey && STITCH_THEMES[themeKey]) {
    return STITCH_THEMES[themeKey];
  }
  return STITCH_THEMES.layanDark;
}
