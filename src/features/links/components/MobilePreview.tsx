"use client";

import React from "react";
import { ProfileData } from "@/components/public/BioPageContent";
import { LinkData, SocialItem } from "../types/links.types";
import { ExternalLink, Smartphone } from "lucide-react";
import { PhoneMockup } from "@/shared/ui/phone/PhoneMockup";

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

      <PhoneMockup
        showFloatingCards={false}
        username={username}
        displayName={profile.displayName}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl}
        themeKey={profile.themeKey}
        accentColor={profile.accentColor}
        buttonStyle={(profile.buttonStyle as any) || "filled"}
        borderRadius={(profile.borderRadius as any) || "rounded-xl"}
        font={profile.font || "Cairo"}
        links={links.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          isActive: l.isActive,
          position: l.position,
        }))}
        socials={socials.map((s, idx) => ({
          network: s.network,
          url: s.url,
          position: idx,
        }))}
      />
    </div>
  );
}
