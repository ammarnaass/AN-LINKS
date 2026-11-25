export const BUTTON_STYLES: Record<string, string> = {
  filled: "border-transparent",
  glass: "bg-surface-container-lowest/75 backdrop-blur-md border border-outline-variant/30 shadow-sm",
  soft: "border-transparent bg-opacity-70",
  outline: "bg-transparent border-2",
  shadow: "shadow-md hover:shadow-lg border-transparent",
};

export const CARD_STYLES: Record<string, string> = {
  glass: "bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 shadow-2xl",
  solid: "bg-surface-container-low border border-outline-variant/30 shadow-xl",
  glow: "bg-surface-container-lowest/85 backdrop-blur-lg border border-primary/50 shadow-[0_0_25px_rgba(78,222,163,0.25)]",
  outline: "bg-transparent backdrop-blur-sm border-2 border-outline-variant/60 shadow-none",
};

export const BUTTON_SHADOWS: Record<string, string> = {
  none: "shadow-none",
  soft: "shadow-md hover:shadow-lg",
  strong: "shadow-xl hover:shadow-2xl",
  glow: "shadow-[0_0_20px_rgba(78,222,163,0.35)]",
};

export const BORDER_RADIUS_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
  "rounded-none": "rounded-none",
  "rounded-md": "rounded-md",
  "rounded-xl": "rounded-xl",
  "rounded-full": "rounded-full",
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
    className: "font-tajawal",
  },
  IBMPlex: {
    name: "IBM Plex Sans Arabic",
    nameAr: "آي بي إم بليكس (IBM Plex Sans Arabic)",
    className: "font-plex",
  },
  "IBM Plex Sans Arabic": {
    name: "IBM Plex Sans Arabic",
    nameAr: "آي بي إم بليكس (IBM Plex Sans Arabic)",
    className: "font-plex",
  },
  Almarai: {
    name: "Almarai",
    nameAr: "خط المراعي (Almarai)",
    className: "font-almarai",
  },
  ReadexPro: {
    name: "Readex Pro",
    nameAr: "خط ريدكس برو (Readex Pro)",
    className: "font-readex",
  },
  "Readex Pro": {
    name: "Readex Pro",
    nameAr: "خط ريدكس برو (Readex Pro)",
    className: "font-readex",
  },
};
