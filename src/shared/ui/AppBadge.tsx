import React from "react";

export interface AppBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "neutral" | "live" | "primary";
  size?: "sm" | "md";
  dot?: boolean;
}

const BADGE_VARIANTS: Record<NonNullable<AppBadgeProps["variant"]>, { bg: string; dot: string }> = {
  primary: {
    bg: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  success: {
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  warning: {
    bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  error: {
    bg: "bg-error/10 text-error border-error/20",
    dot: "bg-error",
  },
  neutral: {
    bg: "bg-surface-container-high text-on-surface-variant border-outline-variant/30",
    dot: "bg-outline",
  },
  live: {
    bg: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
  },
};

export function AppBadge({
  variant = "primary",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: AppBadgeProps) {
  const v = BADGE_VARIANTS[variant];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-cairo font-semibold rounded-full border shadow-xs transition-colors ${v.bg} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {variant === "live" && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${v.dot}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${v.dot}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}

