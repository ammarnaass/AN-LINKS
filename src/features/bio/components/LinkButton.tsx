import React from "react";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { THEMES, BUTTON_STYLES } from "@/features/appearance";
import { LinkItem } from "../types/bio.types";

export type { LinkItem };

interface LinkButtonProps {
  link: LinkItem;
  themeKey?: string;
  buttonStyle?: string | null;
  borderRadius?: string | null;
  accentColor?: string | null;
  isPreview?: boolean;
  highlightBadge?: string | null;
}

export function LinkButton({
  link,
  themeKey = "default",
  buttonStyle,
  borderRadius,
  accentColor,
  isPreview = false,
  highlightBadge,
}: LinkButtonProps) {
  const effectiveButtonStyle = buttonStyle || "filled";
  const effectiveBorderRadius = borderRadius || "rounded-xl";
  const theme = THEMES[themeKey] || THEMES.default;
  const styleModifier = BUTTON_STYLES[effectiveButtonStyle] || "";
  const href = isPreview ? "#" : `/go/${link.id}`;

  const customStyle: React.CSSProperties = {};
  if (accentColor && effectiveButtonStyle === "filled") {
    customStyle.borderColor = accentColor;
  }

  const content = (
    <div
      className={`group relative w-full p-4 flex items-center justify-between transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden shadow-lg border border-white/5 ${theme.buttonClass} ${borderRadius} ${styleModifier}`}
      style={customStyle}
    >
      {/* Shimmer Glow Underlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-container/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Title & Icon */}
      <div className="relative flex items-center gap-3.5 min-w-0 z-10">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-container/80 text-on-primary-container flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <Globe className="w-5 h-5" />
        </div>
        <div className="flex flex-col text-right truncate">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors truncate">
              {link.title}
            </span>
            {highlightBadge && (
              <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-bold border border-primary/20 shrink-0">
                {highlightBadge}
              </span>
            )}
          </div>
          <span className="text-[11px] text-on-surface-variant truncate opacity-80" dir="ltr">
            {link.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>

      {/* Forward Arrow Indicator */}
      <div className="relative z-10 w-8 h-8 rounded-full bg-surface-container/80 flex items-center justify-center text-primary group-hover:-translate-x-1 transition-transform shrink-0">
        <ArrowLeft className="w-4 h-4" />
      </div>
    </div>
  );

  if (isPreview) {
    return <div className="w-full cursor-pointer">{content}</div>;
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
    >
      {content}
    </Link>
  );
}
