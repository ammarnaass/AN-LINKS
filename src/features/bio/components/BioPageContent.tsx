"use client";

import React, { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { LinkButton } from "./LinkButton";
import { ReportModal } from "./ReportModal";
import { QrShareModal } from "./QrShareModal";
import { THEMES } from "@/features/appearance";
import { ProfileData, SocialItem, LinkItem } from "../types/bio.types";

export type { ProfileData };

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
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

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
      className={`min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden transition-colors duration-300 ${theme.backgroundClass}`}
      dir="rtl"
    >
      {/* Atmospheric Ambient Glows */}
      <div className="absolute -top-32 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-tertiary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-96 h-96 rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />

      {/* Main Glass Bento Viewport Frame */}
      <div className="relative w-full max-w-[460px] bg-surface-container-lowest/90 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-5 sm:p-7 flex flex-col items-center z-10 my-4">
        {/* Profile Card Header */}
        <ProfileCard
          displayName={profile.displayName}
          username={username}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          themeKey={themeKey}
          socials={socials}
          isPreview={isPreview}
          onOpenQr={() => setIsQrOpen(true)}
          onOpenShare={() => setIsQrOpen(true)}
        />

        {/* Links Deck */}
        <nav aria-label={`روابط ${profile.displayName}`} className="w-full flex flex-col gap-3.5 my-4">
          {links.length > 0 ? (
            links.map((link) => (
              <LinkButton
                key={link.id}
                link={link}
                themeKey={themeKey}
                buttonStyle={profile.buttonStyle}
                borderRadius={profile.borderRadius}
                accentColor={profile.accentColor}
                isPreview={isPreview}
              />
            ))
          ) : (
            <div className="text-center py-6 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40">
              <p className="text-xs text-on-surface-variant font-medium">
                لا توجد روابط منشورة حالياً
              </p>
            </div>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="pt-6 w-full flex flex-col items-center gap-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors">
            <span>⚡ صُمم بواسطة</span>
            <span className="font-bold text-on-surface">AN LINKS</span>
          </div>

          {!isPreview && (
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-[10px] text-outline hover:text-red-400 transition"
            >
              إبلاغ عن محتوى غير لائق
            </button>
          )}
        </div>
      </div>

      {/* QR & Share Modal */}
      <QrShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        username={username}
        displayName={profile.displayName}
      />

      {/* Abuse Report Modal */}
      {!isPreview && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          username={username}
        />
      )}
    </div>
  );
}

