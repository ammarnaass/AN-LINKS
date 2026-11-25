"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Lock, ShieldAlert } from "lucide-react";
import { THEMES, BUTTON_STYLES, BUTTON_SHADOWS, BORDER_RADIUS_MAP } from "@/features/appearance";
import { LinkItem } from "../types/bio.types";
import { BioSectionHeader, BioYouTubeEmbed, BioSpotifyEmbed } from "./BioMediaEmbeds";
import { LinkGateModal } from "./LinkGateModal";

export type { LinkItem };

export interface LinkButtonProps {
  link: LinkItem;
  themeKey?: string;
  buttonStyle?: string | null;
  borderRadius?: string | null;
  accentColor?: string | null;
  buttonShadow?: string | null;
  buttonClass?: string;
  isPreview?: boolean;
  highlightBadge?: string | null;
}

function LinkInner({
  link,
  highlightBadge,
}: {
  link: LinkItem;
  highlightBadge?: string | null;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-container/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex items-center gap-3.5 min-w-0 z-10">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-container/80 text-on-primary-container flex items-center justify-center shadow-md group-hover:scale-110 transition-transform overflow-hidden">
          {link.thumbnailUrl ? (
            <img src={link.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Globe className="w-5 h-5" />
          )}
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
            {link.hasPin && (
              <span title="محمي برمز PIN" className="text-amber-400 shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </span>
            )}
            {link.isSensitive && (
              <span title="محتوى حساس +18" className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[9px] font-bold shrink-0 flex items-center gap-0.5">
                <ShieldAlert className="w-2.5 h-2.5" />
                <span>+18</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-on-surface-variant truncate opacity-80" dir="ltr">
            {link.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
      <div className="relative z-10 w-8 h-8 rounded-full bg-surface-container/80 flex items-center justify-center text-primary group-hover:-translate-x-1 transition-transform shrink-0">
        <ArrowLeft className="w-4 h-4" />
      </div>
    </>
  );
}

function resolveLinkStyles(
  buttonStyle?: string | null,
  borderRadius?: string | null,
  themeKey?: string,
  buttonShadow?: string | null,
  buttonClass?: string
) {
  const effectiveButtonStyle = buttonStyle || "filled";
  const effectiveBorderRadius = borderRadius || "rounded-xl";
  const resolvedRadius = BORDER_RADIUS_MAP[effectiveBorderRadius] || effectiveBorderRadius;
  const theme = THEMES[themeKey || "layanDark"] || THEMES.layanDark;
  const styleModifier = BUTTON_STYLES[effectiveButtonStyle] || BUTTON_STYLES.filled;
  const shadowModifier = BUTTON_SHADOWS[buttonShadow || "none"] || BUTTON_SHADOWS.none;
  const resolvedButtonClass = (buttonClass || `${theme.buttonClass} ${styleModifier} ${shadowModifier}`).trim();
  return { effectiveButtonStyle, resolvedRadius, resolvedButtonClass };
}

export function LinkButton({
  link,
  themeKey = "layanDark",
  buttonStyle,
  borderRadius,
  accentColor,
  buttonShadow,
  buttonClass,
  isPreview = false,
  highlightBadge,
}: LinkButtonProps) {
  const [isGateOpen, setIsGateOpen] = useState(false);

  if (link.type === "HEADER") {
    return <BioSectionHeader title={link.title} />;
  }
  if (link.type === "YOUTUBE") {
    return <BioYouTubeEmbed title={link.title} url={link.url} />;
  }
  if (link.type === "SPOTIFY") {
    return <BioSpotifyEmbed title={link.title} url={link.url} />;
  }

  const { effectiveButtonStyle, resolvedRadius, resolvedButtonClass } =
    resolveLinkStyles(buttonStyle, borderRadius, themeKey, buttonShadow, buttonClass);
  const customStyle: React.CSSProperties = {
    ...(accentColor && effectiveButtonStyle === "filled" ? { borderColor: accentColor } : {}),
    ...(link.customBgColor ? { backgroundColor: link.customBgColor } : {}),
    ...(link.customTextColor ? { color: link.customTextColor } : {}),
    ...(link.customBorderColor ? { borderColor: link.customBorderColor, borderWidth: "2px" } : {}),
  };

  const shadowClass = link.customShadow === "glow"
    ? "shadow-[0_0_20px_rgba(78,222,163,0.35)]"
    : link.customShadow === "strong"
    ? "shadow-xl"
    : link.customShadow === "soft"
    ? "shadow-md"
    : link.customShadow === "none"
    ? "shadow-none"
    : "";

  const content = (
    <div
      className={`group relative w-full p-4 flex items-center justify-between transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden border border-outline-variant/25 ${resolvedRadius} ${resolvedButtonClass} ${shadowClass}`}
      style={customStyle}
    >
      <LinkInner link={link} highlightBadge={highlightBadge} />
    </div>
  );

  if (isPreview) return <div className="w-full cursor-pointer">{content}</div>;

  if (link.hasPin || link.isSensitive) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsGateOpen(true)}
          className={`block w-full text-right focus:outline-none focus:ring-2 focus:ring-primary ${resolvedRadius}`}
        >
          {content}
        </button>
        <LinkGateModal
          isOpen={isGateOpen}
          onClose={() => setIsGateOpen(false)}
          linkId={link.id}
          linkTitle={link.title}
          hasPin={Boolean(link.hasPin)}
          isSensitive={Boolean(link.isSensitive)}
        />
      </>
    );
  }

  return (
    <Link
      href={`/go/${link.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full focus:outline-none focus:ring-2 focus:ring-primary ${resolvedRadius}`}
    >
      {content}
    </Link>
  );
}
