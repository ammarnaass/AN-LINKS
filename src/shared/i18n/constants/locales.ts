import { Locale, LocaleConfig } from "../types/i18n.types";

export const DEFAULT_LOCALE: Locale = "ar";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const SUPPORTED_LOCALES: Record<Locale, LocaleConfig> = {
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    flag: "🇸🇦",
    fontClass: "font-cairo",
  },
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    flag: "🇺🇸",
    fontClass: "font-sans",
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    dir: "ltr",
    flag: "🇫🇷",
    fontClass: "font-sans",
  },
};

export const LOCALES_LIST: LocaleConfig[] = Object.values(SUPPORTED_LOCALES);
