"use client";

import { useI18n } from "./I18nProvider";

export function useTranslation() {
  const { t, locale, direction, setLocale, locales } = useI18n();
  return {
    t,
    locale,
    direction,
    isRtl: direction === "rtl",
    setLocale,
    locales,
  };
}
