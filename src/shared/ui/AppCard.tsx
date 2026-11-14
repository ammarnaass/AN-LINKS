import React from "react";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "glass";
  glowColor?: "primary" | "secondary" | "none";
}

const CARD_VARIANTS: Record<NonNullable<AppCardProps["variant"]>, string> = {
  default:
    "bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-2xl",
  elevated:
    "bg-surface-container border border-outline-variant/40 text-on-surface rounded-2xl shadow-xl",
  interactive:
    "bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-2xl transition-all duration-300 hover:border-primary/50 hover:bg-surface-container hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer group",
  glass:
    "bg-surface-container-lowest/80 backdrop-blur-xl border border-white/5 text-on-surface rounded-2xl shadow-2xl",
};

const GLOW_CLASSES: Record<NonNullable<AppCardProps["glowColor"]>, string> = {
  none: "",
  primary: "shadow-[0_0_30px_rgba(78,222,163,0.15)]",
  secondary: "shadow-[0_0_30px_rgba(208,188,255,0.15)]",
};

export function AppCard({
  variant = "default",
  glowColor = "none",
  className = "",
  children,
  ...props
}: AppCardProps) {
  return (
    <div
      className={`p-5 sm:p-6 font-cairo ${CARD_VARIANTS[variant]} ${GLOW_CLASSES[glowColor]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

