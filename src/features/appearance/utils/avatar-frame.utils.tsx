import React from "react";
import {
  CheckCircle2,
  BadgeCheck,
  ShieldCheck,
  Crown,
  Award,
  Trophy,
  Star,
  Sparkles,
  Flame,
  Zap,
  Rocket,
  Diamond,
  Heart,
  Gem,
  Check,
} from "lucide-react";
import {
  AVATAR_FRAME_SHAPES,
  AVATAR_BORDER_WIDTHS,
  BADGE_SHAPES,
  BADGE_SIZES,
} from "../constants/avatar-badge.constants";
import { AvatarFrameShape, AvatarBorderWidth, BadgeShape, BadgeSize } from "../types/appearance.types";

export function getAvatarFrameStyles(
  shape: AvatarFrameShape | string = "circle",
  borderWidth: AvatarBorderWidth | string = "2",
  borderColor?: string | null,
  fallbackAccent: string = "#4edea3"
) {
  const shapeConfig = AVATAR_FRAME_SHAPES.find((s) => s.value === shape) || AVATAR_FRAME_SHAPES[0];
  const widthConfig = AVATAR_BORDER_WIDTHS.find((w) => w.value === borderWidth) || AVATAR_BORDER_WIDTHS[1];
  const resolvedColor = borderColor || fallbackAccent;

  const containerStyle: React.CSSProperties = {};
  let containerClass = "relative overflow-hidden transition-all duration-300 ";

  if (shapeConfig.clipPath) {
    containerStyle.clipPath = shapeConfig.clipPath;
  } else if (shapeConfig.borderRadius) {
    containerClass += shapeConfig.borderRadius;
  }

  if (shape === "none" || widthConfig.px === 0) {
    containerStyle.borderWidth = 0;
  } else {
    containerStyle.borderWidth = `${widthConfig.px}px`;
    containerStyle.borderStyle = "solid";
    containerStyle.borderColor = resolvedColor;
    containerStyle.boxShadow = `0 8px 24px -4px ${resolvedColor}35`;
  }

  return {
    containerClass,
    containerStyle,
    resolvedColor,
    borderPx: widthConfig.px,
  };
}

export function getBadgeStyles(
  shape: BadgeShape | string = "circle",
  size: BadgeSize | string = "md",
  color?: string | null,
  fallbackAccent: string = "#10b981"
) {
  const shapeConfig = BADGE_SHAPES.find((s) => s.value === shape) || BADGE_SHAPES[0];
  const sizeConfig = BADGE_SIZES.find((s) => s.value === size) || BADGE_SIZES[1];
  const resolvedColor = color || fallbackAccent;

  const style: React.CSSProperties = {
    backgroundColor: resolvedColor,
    width: `${sizeConfig.containerPx}px`,
    height: `${sizeConfig.containerPx}px`,
    boxShadow: `0 2px 10px ${resolvedColor}60`,
  };

  if (shapeConfig.clipPath) {
    style.clipPath = shapeConfig.clipPath;
  }

  const containerClass = `inline-flex items-center justify-center shrink-0 transition-transform ${
    shapeConfig.borderRadius || ""
  }`;

  return {
    style,
    containerClass,
    iconPx: sizeConfig.iconPx,
    resolvedColor,
  };
}

export function renderBadgeIconComponent(iconName: string = "CheckCircle2", iconPx: number = 14) {
  const props = {
    style: { width: `${iconPx}px`, height: `${iconPx}px` },
    className: "text-white fill-white/20 shrink-0",
  };

  switch (iconName) {
    case "BadgeCheck":
      return <BadgeCheck {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "Crown":
      return <Crown {...props} />;
    case "Award":
      return <Award {...props} />;
    case "Trophy":
      return <Trophy {...props} />;
    case "Star":
      return <Star {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Flame":
      return <Flame {...props} />;
    case "Zap":
      return <Zap {...props} />;
    case "Rocket":
      return <Rocket {...props} />;
    case "Diamond":
      return <Diamond {...props} />;
    case "Heart":
      return <Heart {...props} />;
    case "Gem":
      return <Gem {...props} />;
    case "Check":
      return <Check {...props} />;
    case "CheckCircle2":
    default:
      return <CheckCircle2 {...props} />;
  }
}
