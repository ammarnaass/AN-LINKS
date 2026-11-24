"use client";

import React, { useState } from "react";
import { ExternalLink, Link2, Globe, Sparkles } from "lucide-react";
import {
  extractYouTubeEmbedUrl,
  extractSpotifyEmbedUrl,
} from "@/features/links/utils/media-embed";

export interface PhoneInteractiveLinkProps {
  link: {
    id: string;
    title: string;
    url: string;
    type?: string;
    thumbnailUrl?: string | null;
    customBgColor?: string | null;
    customTextColor?: string | null;
    customBorderColor?: string | null;
    customShadow?: string | null;
  };
  buttonClass?: string;
  baseStyleProps?: React.CSSProperties;
}

export function PhoneInteractiveLink({
  link,
  buttonClass = "",
  baseStyleProps = {},
}: PhoneInteractiveLinkProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  if (link.type === "HEADER") {
    return (
      <div className="w-full my-2 flex items-center justify-center gap-2">
        <div className="h-[1px] flex-1 bg-white/10" />
        <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container-high/70 text-on-surface border border-white/10 shadow-xs truncate max-w-[200px]">
          {link.title}
        </span>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>
    );
  }

  if (link.type === "YOUTUBE") {
    const embedUrl = extractYouTubeEmbedUrl(link.url);
    if (embedUrl) {
      return (
        <div className="w-full my-1.5 overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-md">
          {link.title && (
            <div className="px-2.5 py-1 text-[10px] font-semibold text-on-surface border-b border-white/10 flex items-center justify-between bg-surface-container/30">
              <span className="truncate">{link.title}</span>
              <span className="text-[9px] text-red-400 font-mono">YouTube</span>
            </div>
          )}
          <div className="relative w-full aspect-video">
            <iframe
              src={embedUrl}
              title={link.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      );
    }
  }

  if (link.type === "SPOTIFY") {
    const embedUrl = extractSpotifyEmbedUrl(link.url);
    if (embedUrl) {
      return (
        <div className="w-full my-1.5 overflow-hidden rounded-xl border border-white/10 shadow-md bg-black/40">
          <iframe
            src={embedUrl}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full rounded-xl"
          />
        </div>
      );
    }
  }

  const customStyle: React.CSSProperties = {
    ...baseStyleProps,
    ...(link.customBgColor ? { backgroundColor: link.customBgColor } : {}),
    ...(link.customTextColor ? { color: link.customTextColor } : {}),
    ...(link.customBorderColor ? { borderColor: link.customBorderColor, borderWidth: "2px" } : {}),
  };

  const shadowClass =
    link.customShadow === "glow"
      ? "shadow-[0_0_15px_rgba(78,222,163,0.35)]"
      : link.customShadow === "strong"
      ? "shadow-lg shadow-black/50"
      : link.customShadow === "soft"
      ? "shadow-sm shadow-black/20"
      : "";

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrompt(true);
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPrompt(false);
    if (typeof window !== "undefined") {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        data-testid="interactive-link-btn"
        onClick={handleLinkClick}
        style={customStyle}
        className={`interactive-link-btn w-full p-2.5 ${buttonClass} ${shadowClass} flex items-center justify-between transition-all duration-200 active:scale-[0.98] active:brightness-95 cursor-pointer text-xs font-semibold group`}
      >
        <div className="flex items-center gap-2.5 truncate pr-1">
          {link.thumbnailUrl ? (
            <img
              src={link.thumbnailUrl}
              alt=""
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-surface-container/60 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 opacity-80" />
            </div>
          )}
          <span className="truncate">{link.title}</span>
        </div>

        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>

      {/* Simulated In-App Touch Dialog */}
      {showPrompt && (
        <div
          className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between gap-2 border border-primary/40 animate-fadeIn"
          dir="rtl"
        >
          <div className="flex flex-col truncate flex-1 text-right">
            <span className="text-[10px] text-primary font-bold">اختبار فتح الرابط</span>
            <span className="text-[10px] text-white/70 truncate font-mono" dir="ltr">
              {link.url}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenExternal}
              className="px-2 py-1 bg-primary text-on-primary rounded-lg text-[10px] font-bold shadow-xs hover:opacity-90 cursor-pointer"
            >
              فتح
            </button>
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="px-2 py-1 bg-white/10 text-white/80 rounded-lg text-[10px] hover:bg-white/20 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
