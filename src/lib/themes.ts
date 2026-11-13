export interface ThemeConfig {
  id: string;
  name: string;
  nameAr: string;
  backgroundClass: string;
  cardClass: string;
  textPrimary: string;
  textSecondary: string;
  buttonClass: string;
  socialIconClass: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  default: {
    id: "default",
    name: "Minimal Clean",
    nameAr: "بسيط وواضح",
    backgroundClass: "bg-gradient-to-b from-gray-50 to-gray-100",
    cardClass: "bg-white border border-gray-200 shadow-sm",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    buttonClass: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow",
    socialIconClass: "text-gray-700 hover:text-blue-600 bg-white border border-gray-200",
  },
  midnight: {
    id: "midnight",
    name: "Dark Midnight",
    nameAr: "منتصف الليل",
    backgroundClass: "bg-slate-950",
    cardClass: "bg-slate-900/80 border border-slate-800",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
    buttonClass: "bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 shadow-sm hover:border-slate-500",
    socialIconClass: "text-slate-300 hover:text-white bg-slate-900 border border-slate-800",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Garden",
    nameAr: "حديقة الزمرد",
    backgroundClass: "bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950",
    cardClass: "bg-emerald-950/60 border border-emerald-800/40 backdrop-blur-sm",
    textPrimary: "text-emerald-50",
    textSecondary: "text-emerald-300/80",
    buttonClass: "bg-emerald-800/60 hover:bg-emerald-700/60 text-white border border-emerald-700/50 backdrop-blur-sm",
    socialIconClass: "text-emerald-200 hover:text-white bg-emerald-900/50 border border-emerald-800/40",
  },
  sunset: {
    id: "sunset",
    name: "Warm Sunset",
    nameAr: "غروب دافئ",
    backgroundClass: "bg-gradient-to-br from-orange-500 via-rose-600 to-purple-800",
    cardClass: "bg-white/10 border border-white/20 backdrop-blur-md",
    textPrimary: "text-white",
    textSecondary: "text-white/80",
    buttonClass: "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md shadow-lg shadow-black/5",
    socialIconClass: "text-white hover:text-orange-200 bg-white/20 border border-white/30",
  },
};

export const BUTTON_STYLES: Record<string, string> = {
  filled: "border-transparent",
  outline: "bg-transparent border-2",
  soft: "border-transparent bg-opacity-70",
  shadow: "shadow-md hover:shadow-lg border-transparent",
};

export const BORDER_RADIUS_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

export const FONTS: Record<string, { name: string; nameAr: string; className: string }> = {
  Cairo: {
    name: "Cairo",
    nameAr: "خط كايرو (Cairo)",
    className: "font-cairo",
  },
  Tajawal: {
    name: "Tajawal",
    nameAr: "خط تجوال (Tajawal)",
    className: "font-sans",
  },
  IBMPlex: {
    name: "IBM Plex Sans Arabic",
    nameAr: "آي بي إم بليكس (IBM Plex)",
    className: "font-mono",
  },
};
