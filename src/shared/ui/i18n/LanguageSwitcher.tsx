"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation, Locale, LOCALES_LIST } from "@/shared/i18n";

export interface LanguageSwitcherProps {
  variant?: "dropdown" | "minimal" | "pills";
  className?: string;
}

export function LanguageSwitcher({
  variant = "dropdown",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, locales } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  if (variant === "pills") {
    return (
      <div className={`flex items-center gap-2 p-1 bg-surface-container-high rounded-xl border border-outline-variant/30 ${className}`}>
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code as Locale)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              locale === l.code
                ? "bg-primary text-on-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`relative inline-block ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface text-[11px] font-semibold border border-white/10 transition backdrop-blur-md"
          title="تغيير اللغة / Change language"
        >
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>{currentLocale.flag}</span>
          <span>{currentLocale.code.toUpperCase()}</span>
        </button>

        {isOpen && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute bottom-full mb-1.5 start-0 w-36 py-1 bg-surface-container-high border border-outline-variant/40 rounded-xl shadow-xl z-50 text-xs"
          >
            {locales.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLocale(l.code as Locale);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-1.5 flex items-center justify-between text-start hover:bg-surface-container transition ${
                  locale === l.code ? "text-primary font-bold bg-primary/10" : "text-on-surface"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <span>{l.nativeName}</span>
                </span>
                {locale === l.code && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-semibold transition"
      >
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span>{currentLocale.flag}</span>
        <span>{currentLocale.nativeName}</span>
      </button>

      {isOpen && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-full mt-1.5 end-0 w-44 py-1.5 bg-surface-container border border-outline-variant/40 rounded-xl shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1"
        >
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code as Locale);
                setIsOpen(false);
              }}
              className={`w-full px-3.5 py-2 flex items-center justify-between text-start hover:bg-surface-container-high transition ${
                locale === l.code ? "text-primary font-bold bg-primary/10" : "text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{l.flag}</span>
                <span>{l.nativeName}</span>
              </div>
              {locale === l.code && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
