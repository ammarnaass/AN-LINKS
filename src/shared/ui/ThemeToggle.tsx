"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeMode, resolveThemeClasses } from "./design-system";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme_mode") as ThemeMode | null;
    if (saved === "dark" || saved === "light") {
      setMode(saved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolveThemeClasses(saved));
    }
  }, []);

  const toggleMode = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("theme_mode", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolveThemeClasses(next));
  };

  if (!mounted) {
    return (
      <button
        aria-label="تبديل وضع العرض"
        className={`w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant ${className}`}
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleMode}
      type="button"
      aria-label="تبديل وضع العرض"
      className={`w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all active:scale-95 cursor-pointer ${className}`}
    >
      {mode === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      )}
    </button>
  );
}
