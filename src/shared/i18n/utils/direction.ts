import { Locale, Direction } from "../types/i18n.types";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "../constants/locales";

export function isRtl(locale: Locale): boolean {
  return SUPPORTED_LOCALES[locale]?.dir === "rtl";
}

export function getDirection(locale: Locale): Direction {
  return SUPPORTED_LOCALES[locale]?.dir || "rtl";
}

export function getFontClass(locale: Locale): string {
  return SUPPORTED_LOCALES[locale]?.fontClass || "font-cairo";
}

export function normalizeLocale(val?: string | null): Locale {
  if (!val) return DEFAULT_LOCALE;
  const clean = val.toLowerCase().trim().slice(0, 2);
  if (clean === "en") return "en";
  if (clean === "fr") return "fr";
  return "ar";
}
