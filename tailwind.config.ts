import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f131c",
        "surface-container-lowest": "#0a0e16",
        "surface-container-low": "#181c24",
        "surface-container": "#1c2028",
        "surface-container-high": "#262a33",
        "surface-container-highest": "#31353e",
        "surface-bright": "#353942",
        "surface-dim": "#0f131c",
        "on-surface": "#dfe2ee",
        "on-surface-variant": "#bbcabf",
        "inverse-surface": "#dfe2ee",
        "inverse-on-surface": "#2c3039",
        outline: "#86948a",
        "outline-variant": "#3c4a42",
        primary: "#4edea3",
        "on-primary": "#003824",
        "primary-container": "#10b981",
        "on-primary-container": "#00422b",
        secondary: "#d0bcff",
        "secondary-container": "#571bc1",
        "on-secondary-container": "#c4abff",
        tertiary: "#4cd7f6",
        "tertiary-container": "#00b2d0",
        error: "#ffb4ab",
        "error-container": "#93000a",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        plex: ["'IBM Plex Sans Arabic'", "var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
