export type Locale = "ar" | "en" | "fr";

export type Direction = "rtl" | "ltr";

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  dir: Direction;
  flag: string;
  fontClass: string;
}

export type Namespace =
  | "common"
  | "auth"
  | "dashboard"
  | "links"
  | "appearance"
  | "settings"
  | "bio";

export type TranslationKey = string;

export type TranslationParams = Record<string, string | number>;

export interface I18nContextValue {
  locale: Locale;
  direction: Direction;
  locales: LocaleConfig[];
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: TranslationParams) => string;
}
