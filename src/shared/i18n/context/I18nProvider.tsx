"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Locale, Direction, I18nContextValue, TranslationParams } from "../types/i18n.types";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALES_LIST } from "../constants/locales";
import { getDirection, getFontClass } from "../utils/direction";
import { getDictionary } from "../dictionaries";

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children?: React.ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale = DEFAULT_LOCALE }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync document direction and lang attribute
  useEffect(() => {
    const dir = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;

    // Apply font family class
    const fontClass = getFontClass(locale);
    document.documentElement.classList.remove("font-cairo", "font-sans");
    document.documentElement.classList.add(fontClass);
  }, [locale]);

  const setLocale = async (newLocale: Locale) => {
    if (!SUPPORTED_LOCALES[newLocale]) return;
    setLocaleState(newLocale);

    // Save in cookie (1 year expiry)
    document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    try {
      await fetch("/api/i18n/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
    } catch {
      // Non-blocking
    }
  };

  const t = useMemo(() => {
    const dict = getDictionary(locale);
    const fallbackDict = getDictionary(DEFAULT_LOCALE);

    return (key: string, params?: TranslationParams): string => {
      const parts = key.split(".");
      let val: any = dict;
      let fallbackVal: any = fallbackDict;

      for (const part of parts) {
        val = val?.[part];
        fallbackVal = fallbackVal?.[part];
      }

      let text = typeof val === "string" ? val : typeof fallbackVal === "string" ? fallbackVal : key;

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }

      return text;
    };
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      direction: getDirection(locale),
      locales: LOCALES_LIST,
      setLocale,
      t,
    }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Graceful fallback outside provider
    const dict = getDictionary(DEFAULT_LOCALE);
    return {
      locale: DEFAULT_LOCALE,
      direction: "rtl",
      locales: LOCALES_LIST,
      setLocale: async () => {},
      t: (key: string) => {
        const parts = key.split(".");
        let val: any = dict;
        for (const p of parts) val = val?.[p];
        return typeof val === "string" ? val : key;
      },
    };
  }
  return ctx;
}
