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
    <div className="flex flex-col items-center sticky top-8">
      {/* Header bar */}
      <div className="w-full max-w-[320px] mb-3 flex items-center justify-between px-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-gray-400" />
          <span>المعاينة المباشرة</span>
        </div>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span>زيارة الصفحة</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Phone chassis */}
      <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-black/5">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900/80 mr-3" />
          <div className="w-2 h-2 rounded-full bg-blue-900/40" />
        </div>

        {/* Screen Content Window */}
        <div className="w-full h-full bg-white rounded-[34px] overflow-y-auto overflow-x-hidden relative scrollbar-none select-none">
          <BioPageContent
            profile={profile}
            username={username}
            links={links}
            socials={socials}
            isPreview={true}
          />
        </div>

        {/* Home Indicator bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-20" />
      </div>
    </div>
  );
}

