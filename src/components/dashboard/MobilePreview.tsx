"use client";

import React from "react";
import { BioPageContent, ProfileData } from "../public/BioPageContent";
import { LinkData } from "./LinkEditor";
import { SocialItem } from "../public/ProfileCard";
import { ExternalLink, Smartphone } from "lucide-react";

interface MobilePreviewProps {
  profile: ProfileData;
  username: string;
  links: LinkData[];
  socials: SocialItem[];
}

export function MobilePreview({ profile, username, links, socials }: MobilePreviewProps) {
  const publicUrl = `/${username}`;

  return (
    <div className="flex flex-col items-center sticky top-20">
      {/* Header bar */}
      <div className="w-full max-w-[340px] mb-3 flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-on-surface-variant">
          <Smartphone className="w-4 h-4 text-primary" />
          <span>المعاينة المباشرة</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:text-primary-fixed font-semibold transition"
        >
          <span>زيارة الصفحة</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Obsidian Phone Chassis */}
      <div className="relative w-[340px] h-[680px] bg-surface-container-lowest rounded-[46px] p-3 shadow-2xl shadow-black/80 border-[5px] border-surface-container-highest ring-1 ring-white/10">
        {/* Dynamic Island Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest mr-3" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
        </div>

        {/* Screen Viewport */}
        <div className="w-full h-full bg-surface rounded-[36px] overflow-y-auto overflow-x-hidden relative scrollbar-none select-none">
          <BioPageContent
            profile={profile}
            username={username}
            links={links}
            socials={socials}
            isPreview={true}
          />
        </div>

        {/* Home Indicator bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-20 pointer-events-none" />
      </div>
    </div>
  );
}
