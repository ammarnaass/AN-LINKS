import React from "react";
import { AppBadge } from "./AppBadge";

export interface BentoTileProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  glowColor?: "primary" | "secondary" | "tertiary";
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const COL_SPAN_CLASSES: Record<NonNullable<BentoTileProps["colSpan"]>, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

const GLOW_CLASSES: Record<NonNullable<BentoTileProps["glowColor"]>, string> = {
  primary: "group-hover:border-primary/50 group-hover:shadow-[0_0_35px_rgba(78,222,163,0.18)]",
  secondary: "group-hover:border-secondary/50 group-hover:shadow-[0_0_35px_rgba(208,188,255,0.18)]",
  tertiary: "group-hover:border-tertiary/50 group-hover:shadow-[0_0_35px_rgba(76,215,246,0.18)]",
};

export function BentoTile({
  colSpan = 1,
  rowSpan = 1,
  glowColor = "primary",
  icon,
  title,
  description,
  badge,
  className = "",
  children,
  ...props
}: BentoTileProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-on-surface transition-all duration-300 ${
        COL_SPAN_CLASSES[colSpan]
      } ${rowSpan === 2 ? "row-span-2" : ""} ${GLOW_CLASSES[glowColor]} ${className}`}
      dir="rtl"
      {...props}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center border border-outline-variant/30 group-hover:scale-105 transition-transform">
              {icon}
            </div>
          )}
          {badge && <AppBadge variant="primary" size="sm">{badge}</AppBadge>}
        </div>

        <h3 className="font-cairo font-bold text-lg text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-cairo text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>

      {children && <div className="mt-5 pt-4 border-t border-outline-variant/20">{children}</div>}
    </div>
  );
}

