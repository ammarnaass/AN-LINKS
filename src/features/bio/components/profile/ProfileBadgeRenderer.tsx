"use client";

import React from "react";
import { getBadgeStyles, renderBadgeIconComponent } from "@/features/appearance/utils/avatar-frame.utils";
import { BadgeShape, BadgeSize } from "@/features/appearance/types/appearance.types";

export interface ProfileBadgeRendererProps {
  enabled?: boolean | null;
  shape?: BadgeShape | string | null;
  size?: BadgeSize | string | null;
  color?: string | null;
  icon?: string | null;
  fallbackAccent?: string;
  className?: string;
}

export function ProfileBadgeRenderer({
  enabled = true,
  shape = "circle",
  size = "md",
  color,
  icon = "CheckCircle2",
  fallbackAccent = "#10b981",
  className = "",
}: ProfileBadgeRendererProps) {
  if (enabled === false) return null;

  const { style, containerClass, iconPx } = getBadgeStyles(
    shape || "circle",
    size || "md",
    color,
    fallbackAccent
  );

  return (
    <span
      className={`${containerClass} ${className}`}
      style={style}
      title="شارة التوثيق والتميز"
      aria-label="شارة التوثيق والتميز"
    >
      {renderBadgeIconComponent(icon || "CheckCircle2", iconPx)}
    </span>
  );
}
