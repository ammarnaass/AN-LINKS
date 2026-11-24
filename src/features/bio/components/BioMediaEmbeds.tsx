"use client";

import React from "react";
import {
  extractYouTubeEmbedUrl,
  extractSpotifyEmbedUrl,
} from "@/features/links/utils/media-embed";

export function BioSectionHeader({ title }: { title: string }) {
  return (
    <div className="w-full my-3 flex items-center justify-center gap-3">
      <div className="h-[1px] flex-1 bg-white/10" />
      <span className="text-xs font-bold tracking-wider px-3.5 py-1 rounded-full bg-surface-container-high/70 text-on-surface border border-white/10 shadow-xs">
        {title}
      </span>
      <div className="h-[1px] flex-1 bg-white/10" />
    </div>
  );
}

export function BioYouTubeEmbed({ title, url }: { title: string; url: string }) {
  const embedUrl = extractYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="w-full my-1.5 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
      {title && (
        <div className="px-3.5 py-2 text-xs font-semibold text-on-surface border-b border-white/10 flex items-center justify-between bg-surface-container/30">
          <span className="truncate">{title}</span>
          <span className="text-[10px] text-red-400 font-mono">YouTube</span>
        </div>
      )}
      <div className="relative w-full aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function BioSpotifyEmbed({ title, url }: { title: string; url: string }) {
  const embedUrl = extractSpotifyEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="w-full my-1.5 overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-black/40">
      <iframe
        src={embedUrl}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full rounded-2xl"
      />
    </div>
  );
}
