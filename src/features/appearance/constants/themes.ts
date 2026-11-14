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
  accentColor: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  layanDark: {
    id: "layanDark",
    name: "Layan Dark Bento",
    nameAr: "ليان داكن (Layan Dark)",
    backgroundClass: "bg-[#0f131c]",
    cardClass: "bg-[#181c24]/90 border border-[#3c4a42]/40 backdrop-blur-xl shadow-2xl",
    textPrimary: "text-[#dfe2ee]",
    textSecondary: "text-[#bbcabf]",
    buttonClass: "bg-[#1c2028] hover:bg-[#262a33] text-[#dfe2ee] border border-[#3c4a42]/40 shadow-md",
    socialIconClass: "text-[#4edea3] hover:text-[#6ffbbe] bg-[#181c24] border border-[#3c4a42]/40",
    accentColor: "#4edea3",
  },
  rawabetLight: {
    id: "rawabetLight",
    name: "Rawabet Luxury Light",
    nameAr: "روابط فاخر (Rawabet Light)",
    backgroundClass: "bg-[#faf7f2]",
    cardClass: "bg-white/95 border border-[#e5dfd3] shadow-xl backdrop-blur-md",
    textPrimary: "text-[#1c1917]",
    textSecondary: "text-[#78716c]",
    buttonClass: "bg-[#f5f0e6] hover:bg-[#ede5d6] text-[#1c1917] border border-[#e5dfd3] shadow-sm",
    socialIconClass: "text-[#b45309] hover:text-[#92400e] bg-white border border-[#e5dfd3]",
    accentColor: "#b45309",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Dark",
    nameAr: "نيون الزمرد (Emerald Dark)",
    backgroundClass: "bg-gradient-to-bl from-[#0a0e16] via-[#0f131c] to-[#003824]/30",
    cardClass: "bg-[#181c24]/80 border border-[#10b981]/30 backdrop-blur-md",
    textPrimary: "text-[#dfe2ee]",
    textSecondary: "text-[#4edea3]",
    buttonClass: "bg-[#1c2028] hover:bg-[#262a33] text-white border border-[#10b981]/40 shadow-sm",
    socialIconClass: "text-[#4edea3] hover:text-white bg-[#10b981]/20 border border-[#10b981]/30",
    accentColor: "#10b981",
  },
  violet: {
    id: "violet",
    name: "Cyber Violet",
    nameAr: "شفق البنفسج (Cyber Violet)",
    backgroundClass: "bg-gradient-to-bl from-[#0a0e16] via-[#0f131c] to-[#571bc1]/20",
    cardClass: "bg-[#181c24]/80 border border-[#d0bcff]/30 backdrop-blur-md",
    textPrimary: "text-[#dfe2ee]",
    textSecondary: "text-[#d0bcff]",
    buttonClass: "bg-[#1c2028] hover:bg-[#262a33] text-white border border-[#d0bcff]/40 shadow-sm",
    socialIconClass: "text-[#d0bcff] hover:text-white bg-[#571bc1]/30 border border-[#d0bcff]/30",
    accentColor: "#d0bcff",
  },
  slate: {
    id: "slate",
    name: "Minimal Slate",
    nameAr: "سليت الحداثة (Minimal Slate)",
    backgroundClass: "bg-gradient-to-bl from-[#0a0e16] via-[#1c2028] to-[#262a33]",
    cardClass: "bg-[#181c24]/90 border border-white/10 backdrop-blur-md",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
    buttonClass: "bg-[#262a33] hover:bg-[#353942] text-white border border-white/10 shadow-sm",
    socialIconClass: "text-white hover:text-slate-200 bg-[#262a33] border border-white/10",
    accentColor: "#94a3b8",
  },
  gold: {
    id: "gold",
    name: "Obsidian Gold",
    nameAr: "ذهبي فاخر (Obsidian Gold)",
    backgroundClass: "bg-gradient-to-bl from-[#0a0e16] via-[#1c160c] to-[#eab308]/20",
    cardClass: "bg-[#1c160c]/90 border border-[#facc15]/30 backdrop-blur-md",
    textPrimary: "text-white",
    textSecondary: "text-[#fde047]",
    buttonClass: "bg-[#262016] hover:bg-[#332b1e] text-[#fef08a] border border-[#facc15]/40 shadow-sm",
    socialIconClass: "text-[#facc15] hover:text-white bg-[#eab308]/20 border border-[#facc15]/30",
    accentColor: "#facc15",
  },
  midnight: {
    id: "midnight",
    name: "Dark Midnight",
    nameAr: "منتصف الليل (Midnight)",
    backgroundClass: "bg-slate-950",
    cardClass: "bg-slate-900/80 border border-slate-800",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
    buttonClass: "bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 shadow-sm hover:border-slate-500",
    socialIconClass: "text-slate-300 hover:text-white bg-slate-900 border border-slate-800",
    accentColor: "#60a5fa",
  },
  sunset: {
    id: "sunset",
    name: "Warm Sunset",
    nameAr: "غروب دافئ (Sunset)",
    backgroundClass: "bg-gradient-to-br from-orange-500 via-rose-600 to-purple-800",
    cardClass: "bg-white/10 border border-white/20 backdrop-blur-md",
    textPrimary: "text-white",
    textSecondary: "text-white/80",
    buttonClass: "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md shadow-lg shadow-black/5",
    socialIconClass: "text-white hover:text-orange-200 bg-white/20 border border-white/30",
    accentColor: "#f97316",
  },
  default: {
    id: "default",
    name: "Minimal Clean",
    nameAr: "بسيط وواضح (Clean)",
    backgroundClass: "bg-gradient-to-b from-gray-50 to-gray-100",
    cardClass: "bg-white border border-gray-200 shadow-sm",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    buttonClass: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow",
    socialIconClass: "text-gray-700 hover:text-blue-600 bg-white border border-gray-200",
    accentColor: "#3b82f6",
  },
};

export const BUTTON_STYLES: Record<string, string> = {
  filled: "border-transparent",
  glass: "bg-surface-container-lowest/60 backdrop-blur-md border border-white/10 shadow-sm",
  soft: "border-transparent bg-opacity-70",
  outline: "bg-transparent border-2",
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
  IBMPlex: {
    name: "IBM Plex Sans Arabic",
    nameAr: "آي بي إم بليكس (IBM Plex Sans Arabic)",
    className: "font-plex",
  },
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
  Almarai: {
    name: "Almarai",
    nameAr: "خط المراعي (Almarai)",
    className: "font-sans",
  },
};

