# EGM Implementation Plan: Dual-Mode Architecture (Layan Dark Arabic Bento & Rawabet Luxury Light)

> **EGM Implementation Readiness Standard Compliance:**
> This plan adheres strictly to the Elephant-Goldfish Model (EGM) Implementation Readiness Standard. All CSS variables, token channels, theme switching mechanics, and verification test cases are explicitly defined with zero design or architectural choices left to the implementer.

**Goal:** Implement full, seamless dual-mode theming across all 15 routes of AN LINKS, enabling instant zero-CLS toggling between **Layan Dark Arabic Bento** (`#0f131c` / `#0a0e16`) and **Rawabet Luxury Light** (`#faf8ff` / `#ffffff`) using alpha-compatible CSS variables and client hydration persistence without theme flashing.

---

## 1. Target Scope & File Boundaries

| Relative File Path | Action | Line Range Target | Max Lines Target | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `src/app/globals.css` | Modify | L1-L70 | < 80 lines | Complete `:root` and `.dark` RGB variables, dynamic color-scheme, and tokenized body |
| `tailwind.config.ts` | Modify | L1-L60 | < 70 lines | Map Tailwind colors to `rgb(var(--token) / <alpha-value>)` |
| `src/shared/ui/design-system.ts` | Modify | L95-L127 | < 140 lines | Synchronize `THEME_TOKENS` and `resolveThemeClasses` with Stitch specs |
| `src/shared/ui/ThemeToggle.tsx` | Modify | L1-L55 | < 60 lines | Complete drop-in client theme toggle component with localStorage persistence |
| `src/app/layout.tsx` | Modify | L1-L45 | < 50 lines | Add `suppressHydrationWarning` and anti-flicker inline script in `<head>` |
| `tests/unit/theme-mode.test.ts` | Modify | Full file | < 70 lines | Comprehensive Vitest suite for dual-mode token resolution and RGB channels |

---

## 2. Phase 1: Complete `src/app/globals.css`

Drop-in replacement for `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-cairo: 'Cairo', sans-serif;
    color-scheme: light;

    /* Rawabet Luxury Light Tokens */
    --surface: 250 248 255;                   /* #faf8ff */
    --surface-dim: 210 217 244;               /* #d2d9f4 */
    --surface-bright: 250 248 255;            /* #faf8ff */
    --surface-container-lowest: 255 255 255;  /* #ffffff */
    --surface-container-low: 242 243 255;     /* #f2f3ff */
    --surface-container: 234 237 255;         /* #eaedff */
    --surface-container-high: 226 231 255;    /* #e2e7ff */
    --surface-container-highest: 218 226 253; /* #dae2fd */
    --on-surface: 19 27 46;                   /* #131b2e */
    --on-surface-variant: 61 74 66;           /* #3d4a42 */
    --inverse-surface: 40 48 68;              /* #283044 */
    --inverse-on-surface: 238 240 255;        /* #eef0ff */
    --inverse-primary: 104 219 169;           /* #68dba9 */
    --outline: 109 122 114;                   /* #6d7a72 */
    --outline-variant: 188 202 192;           /* #bccac0 */
    --primary: 0 105 72;                      /* #006948 */
    --on-primary: 255 255 255;                /* #ffffff */
    --primary-container: 0 133 93;            /* #00855d */
    --on-primary-container: 245 255 247;      /* #f5fff7 */
    --secondary: 0 108 73;                    /* #006c49 */
    --secondary-container: 108 248 187;       /* #6cf8bb */
    --on-secondary: 255 255 255;              /* #ffffff */
    --on-secondary-container: 0 113 77;       /* #00714d */
    --tertiary: 0 105 76;                     /* #00694c */
    --tertiary-container: 30 132 98;          /* #1e8462 */
    --on-tertiary: 255 255 255;               /* #ffffff */
    --on-tertiary-container: 245 255 247;     /* #f5fff7 */
    --error: 186 26 26;                       /* #ba1a1a */
    --error-container: 255 218 214;           /* #ffdad6 */
    --background: 250 248 255;                /* #faf8ff */
    --on-background: 19 27 46;                /* #131b2e */
  }

  .dark {
    color-scheme: dark;

    /* Layan Dark Arabic Bento Tokens */
    --surface: 15 19 28;                      /* #0f131c */
    --surface-dim: 15 19 28;                  /* #0f131c */
    --surface-bright: 53 57 66;               /* #353942 */
    --surface-container-lowest: 10 14 22;     /* #0a0e16 */
    --surface-container-low: 24 28 36;        /* #181c24 */
    --surface-container: 28 32 40;            /* #1c2028 */
    --surface-container-high: 38 42 51;       /* #262a33 */
    --surface-container-highest: 49 53 62;    /* #31353e */
    --on-surface: 223 226 238;                /* #dfe2ee */
    --on-surface-variant: 187 202 191;        /* #bbcabf */
    --inverse-surface: 223 226 238;           /* #dfe2ee */
    --inverse-on-surface: 44 48 57;           /* #2c3039 */
    --inverse-primary: 0 108 73;              /* #006c49 */
    --outline: 134 148 138;                   /* #86948a */
    --outline-variant: 60 74 66;              /* #3c4a42 */
    --primary: 78 222 163;                    /* #4edea3 */
    --on-primary: 0 56 36;                    /* #003824 */
    --primary-container: 16 185 129;          /* #10b981 */
    --on-primary-container: 0 66 43;          /* #00422b */
    --secondary: 208 188 255;                 /* #d0bcff */
    --secondary-container: 87 27 193;         /* #571bc1 */
    --on-secondary: 60 0 145;                 /* #3c0091 */
    --on-secondary-container: 196 171 255;    /* #c4abff */
    --tertiary: 76 215 246;                   /* #4cd7f6 */
    --tertiary-container: 0 178 208;          /* #00b2d0 */
    --on-tertiary: 0 54 64;                   /* #003640 */
    --on-tertiary-container: 0 63 75;         /* #003f4b */
    --error: 255 180 171;                     /* #ffb4ab */
    --error-container: 147 0 10;              /* #93000a */
    --background: 15 19 28;                   /* #0f131c */
    --on-background: 223 226 238;             /* #dfe2ee */
  }

  html {
    font-family: 'IBM Plex Sans Arabic', 'Cairo', system-ui, -apple-system, sans-serif;
  }

  body {
    background-color: rgb(var(--surface-container-lowest));
    color: rgb(var(--on-surface));
    font-family: 'IBM Plex Sans Arabic', 'Cairo', system-ui, -apple-system, sans-serif;
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr !important;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  vertical-align: middle;
  user-select: none;
}

::-webkit-scrollbar {
  display: none;
}
```

---

## 3. Phase 2: Complete `tailwind.config.ts`

Drop-in replacement for `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const alphaColor = (varName: string) => `rgb(var(${varName}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: alphaColor("--surface"),
        "surface-dim": alphaColor("--surface-dim"),
        "surface-bright": alphaColor("--surface-bright"),
        "surface-container-lowest": alphaColor("--surface-container-lowest"),
        "surface-container-low": alphaColor("--surface-container-low"),
        "surface-container": alphaColor("--surface-container"),
        "surface-container-high": alphaColor("--surface-container-high"),
        "surface-container-highest": alphaColor("--surface-container-highest"),
        "on-surface": alphaColor("--on-surface"),
        "on-surface-variant": alphaColor("--on-surface-variant"),
        "inverse-surface": alphaColor("--inverse-surface"),
        "inverse-on-surface": alphaColor("--inverse-on-surface"),
        "inverse-primary": alphaColor("--inverse-primary"),
        background: alphaColor("--background"),
        "on-background": alphaColor("--on-background"),
        outline: alphaColor("--outline"),
        "outline-variant": alphaColor("--outline-variant"),
        primary: alphaColor("--primary"),
        "on-primary": alphaColor("--on-primary"),
        "primary-container": alphaColor("--primary-container"),
        "on-primary-container": alphaColor("--on-primary-container"),
        secondary: alphaColor("--secondary"),
        "secondary-container": alphaColor("--secondary-container"),
        "on-secondary": alphaColor("--on-secondary"),
        "on-secondary-container": alphaColor("--on-secondary-container"),
        tertiary: alphaColor("--tertiary"),
        "tertiary-container": alphaColor("--tertiary-container"),
        "on-tertiary": alphaColor("--on-tertiary"),
        "on-tertiary-container": alphaColor("--on-tertiary-container"),
        error: alphaColor("--error"),
        "error-container": alphaColor("--error-container"),
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        plex: ["'IBM Plex Sans Arabic'", "'IBM Plex Sans'", "var(--font-cairo)", "sans-serif"],
        sans: ["'IBM Plex Sans Arabic'", "'Cairo'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 4. Phase 3: Complete `src/app/layout.tsx`

Drop-in replacement for `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AN LINKS | أسرع منصة لروابط الـ Bio بالعربية",
  description: "اجمع كل روابطك وحساباتك في صفحة واحدة احترافية وسريعة مصممة خصيصاً للمحتوى العربي.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme_mode') || 'dark';
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="font-plex antialiased min-h-screen bg-surface-container-lowest text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
```

---

## 5. Phase 4: Complete `ThemeToggle.tsx` & `design-system.ts`

### 5.1 File: `src/shared/ui/ThemeToggle.tsx`
Drop-in replacement for `src/shared/ui/ThemeToggle.tsx`:

```tsx
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
```

### 5.2 File: `src/shared/ui/design-system.ts`
Update `THEME_TOKENS` and `resolveThemeClasses`:

```typescript
export interface ModeTokens {
  surface: string;
  surfaceContainer: string;
  onSurface: string;
  primary: string;
  primaryContainer: string;
  secondary: string;
  tertiary: string;
}

export const THEME_TOKENS: Record<"dark" | "light", ModeTokens> = {
  dark: {
    surface: "#0f131c",
    surfaceContainer: "#1c2028",
    onSurface: "#dfe2ee",
    primary: "#4edea3",
    primaryContainer: "#10b981",
    secondary: "#d0bcff",
    tertiary: "#4cd7f6",
  },
  light: {
    surface: "#faf8ff",
    surfaceContainer: "#eaedff",
    onSurface: "#131b2e",
    primary: "#006948",
    primaryContainer: "#00855d",
    secondary: "#006c49",
    tertiary: "#00694c",
  },
};

export type ThemeMode = "dark" | "light" | "system";

export function resolveThemeClasses(mode: ThemeMode): string {
  if (mode === "light") {
    return "light";
  }
  return "dark";
}
```

---

## 6. Phase 5: Executable Test Plan & Verification Gate

### 6.1 Test File: `tests/unit/theme-mode.test.ts`
Drop-in replacement for `tests/unit/theme-mode.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { THEME_TOKENS, resolveThemeClasses } from "@/shared/ui/design-system";

describe("Dual Mode Design Tokens & Resolution", () => {
  it("should match Layan Dark Arabic Bento tokens exactly", () => {
    expect(THEME_TOKENS.dark.surface).toBe("#0f131c");
    expect(THEME_TOKENS.dark.primary).toBe("#4edea3");
    expect(THEME_TOKENS.dark.surfaceContainer).toBe("#1c2028");
  });

  it("should match Rawabet Luxury Light tokens exactly", () => {
    expect(THEME_TOKENS.light.surface).toBe("#faf8ff");
    expect(THEME_TOKENS.light.primary).toBe("#006948");
    expect(THEME_TOKENS.light.surfaceContainer).toBe("#eaedff");
  });

  it("should resolve correct class names for document root", () => {
    expect(resolveThemeClasses("dark")).toBe("dark");
    expect(resolveThemeClasses("light")).toBe("light");
    expect(resolveThemeClasses("system")).toBe("dark");
  });
});
```

### 6.2 Verification Commands:
- Step 1 (Unit Test): `npx vitest run tests/unit/theme-mode.test.ts`
- Step 2 (Regression Suite): `npm test` (all 20 test files pass)
- Step 3 (Production Build): `npm run build` (0 type errors, all 15 routes generated)
- Step 4 (E2E Live Verification): `node tests/e2e-live-test.mjs` (all 11 checks pass)
