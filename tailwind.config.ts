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
