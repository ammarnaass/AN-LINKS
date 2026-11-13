"use client";

import React, { useEffect } from "react";
import { ProfileCard, SocialItem } from "./ProfileCard";
import { LinkButton, LinkItem } from "./LinkButton";
import { ReportModal } from "./ReportModal";
import { THEMES } from "@/lib/themes";

export interface ProfileData {
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  themeKey?: string;
  accentColor?: string;
  buttonStyle?: string;
  borderRadius?: string;
  font?: string;
}

interface BioPageContentProps {
  profile: ProfileData;
  username: string;
  links?: LinkItem[];
  socials?: SocialItem[];
  isPreview?: boolean;
}

export function BioPageContent({
  profile,
  username,
  links = [],
  socials = [],
  isPreview = false,
}: BioPageContentProps) {
  const themeKey = profile.themeKey || "default";
  const theme = THEMES[themeKey] || THEMES.default;

  // Track page view beacon on real public visits
  useEffect(() => {
    if (!isPreview && typeof window !== "undefined" && username) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`/api/views/${encodeURIComponent(username)}`);
      } else {
        fetch(`/api/views/${encodeURIComponent(username)}`, { method: "POST" }).catch(() => {});
      }
    }
  }, [isPreview, username]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-8 transition-colors duration-300 ${theme.backgroundClass}`}
      dir="rtl"
    >
      <div className="w-full max-w-md mx-auto space-y-8 my-auto">
        {/* Profile Card Header */}
        <ProfileCard
          displayName={profile.displayName}
          username={username}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          themeKey={themeKey}
          socials={socials}
          isPreview={isPreview}
        />

        {/* Links List */}
        {links.length > 0 ? (
          <div className="space-y-3.5 w-full">
            {links.map((link) => (
              <LinkButton
                key={link.id}
                link={link}
                themeKey={themeKey}
                buttonStyle={profile.buttonStyle}
                borderRadius={profile.borderRadius}
                accentColor={profile.accentColor}
                isPreview={isPreview}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center opacity-40 text-sm">
            لا توجد روابط مضافة حالياً
          </div>
        )}
      </div>

      {/* Platform Branding Badge & Report Action */}
      <footer className="mt-8 text-center flex flex-col items-center gap-2.5">
        <a
          href="/"
          target={isPreview ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-opacity opacity-75 hover:opacity-100"
        >
          <span>صُنع بواسطة</span>
          <span className="font-bold tracking-wide">AN LINKS</span>
        </a>

        {!isPreview && <ReportModal username={username} />}
      </footer>
    </div>
  );
}
