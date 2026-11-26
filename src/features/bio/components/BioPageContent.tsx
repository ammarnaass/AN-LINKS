"use client";

import React, { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { SocialIconsRow } from "./SocialIconsRow";
import { BioLinksDeck } from "./BioLinksDeck";
import { BioFooter } from "./BioFooter";
import { ReportModal } from "./ReportModal";
import { QrShareModal } from "./QrShareModal";
import { TrackingPixels } from "./TrackingPixels";
import { BioNewsletterCard } from "./BioNewsletterCard";
import { BioDigitalStoreCard } from "./BioDigitalStoreCard";
import { useTranslation } from "@/shared/i18n";
import { resolveThemeStyles, ResolvedThemeStyles } from "@/features/appearance";
import { ProfileData, SocialItem, LinkItem, DigitalProductItem } from "../types/bio.types";

export type { ProfileData };

export interface BioPageContentProps {
  profile: ProfileData;
  username: string;
  links?: LinkItem[];
  socials?: SocialItem[];
  products?: DigitalProductItem[];
  isPreview?: boolean;
}

function BioAmbientGlows() {
  return (
    <>
      <div className="absolute -top-32 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-tertiary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-96 h-96 rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />
    </>
  );
}

interface BioMainFrameProps {
  profile: ProfileData;
  username: string;
  links: LinkItem[];
  socials: SocialItem[];
  products: DigitalProductItem[];
  styles: ResolvedThemeStyles;
  socialPosition: string;
  isPreview: boolean;
  onOpenQr: () => void;
  onOpenReport: () => void;
}

function BioMainFrame({
  profile,
  username,
  links,
  socials,
  products,
  styles,
  socialPosition,
  isPreview,
  onOpenQr,
  onOpenReport,
}: BioMainFrameProps) {
  const [isNfcVisit, setIsNfcVisit] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("source") === "nfc") {
        setIsNfcVisit(true);
      }
    }
  }, []);

  return (
    <div
      className={`relative w-full max-w-[460px] ${styles.cardClass} rounded-2xl p-5 sm:p-7 flex flex-col items-center z-10 my-4 transition-all duration-300 ${styles.fontClass}`}
    >
      {isNfcVisit && (
        <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-3 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>تم الوصول عبر تمرير بطاقة NFC الذكية ⚡</span>
        </div>
      )}
      <ProfileCard
        displayName={profile.displayName}
        username={username}
        bio={profile.bio}
        location={profile.location}
        avatarUrl={profile.avatarUrl}
        themeKey={profile.themeKey || undefined}
        accentColor={profile.accentColor}
        avatarFrameShape={profile.avatarFrameShape}
        avatarBorderWidth={profile.avatarBorderWidth}
        avatarBorderColor={profile.avatarBorderColor}
        badgeEnabled={profile.badgeEnabled}
        badgeShape={profile.badgeShape}
        badgeSize={profile.badgeSize}
        badgeColor={profile.badgeColor}
        badgeIcon={profile.badgeIcon}
        socials={socials}
        linksCount={links.length}
        isPreview={isPreview}
        socialPosition={socialPosition}
        textPrimaryClass={styles.textPrimaryClass} textSecondaryClass={styles.textSecondaryClass}
        socialIconClass={styles.socialIconClass} onOpenQr={onOpenQr} onOpenShare={onOpenQr}
      />

      <BioLinksDeck links={links} profile={profile} buttonClass={styles.buttonClass} isPreview={isPreview} />

      <BioDigitalStoreCard
        username={username}
        products={products}
        accentColor={profile.accentColor}
        isPreview={isPreview}
      />

      {profile.newsletterEnabled !== false && (
        <BioNewsletterCard
          username={username}
          displayName={profile.displayName}
          accentColor={profile.accentColor || undefined}
          buttonClass={styles.buttonClass}
          isPreview={isPreview}
          title={profile.newsletterTitle}
          subtitle={profile.newsletterSubtitle}
          buttonText={profile.newsletterButtonText}
        />
      )}

      {socialPosition === "bottom" && (
        <SocialIconsRow
          socials={socials}
          isPreview={isPreview}
          socialIconClass={styles.socialIconClass}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-6 w-full"
        />
      )}

      <BioFooter isPreview={isPreview} onOpenReport={onOpenReport} />
    </div>
  );
}

function usePageBeacon(isPreview: boolean, username: string) {
  useEffect(() => {
    if (!isPreview && typeof window !== "undefined" && username) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`/api/views/${encodeURIComponent(username)}`);
      } else {
        fetch(`/api/views/${encodeURIComponent(username)}`, { method: "POST" }).catch(() => {});
      }
    }
  }, [isPreview, username]);
}

export function BioPageContent({
  profile,
  username,
  links = [],
  socials = [],
  products = [],
  isPreview = false,
}: BioPageContentProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { direction } = useTranslation();
  const styles = resolveThemeStyles(profile);
  const socialPosition = profile.socialPosition || "top";

  usePageBeacon(isPreview, username);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden transition-colors duration-300 ${styles.colorModeClass} ${styles.backgroundClass}`}
      style={styles.backgroundStyle}
      dir={direction}
    >
      <TrackingPixels profile={profile} isPreview={isPreview} />
      {styles.overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={styles.overlayStyle} />
      )}
      <BioAmbientGlows />
      <BioMainFrame
        profile={profile}
        username={username}
        links={links}
        socials={socials}
        products={products}
        styles={styles}
        socialPosition={socialPosition}
        isPreview={isPreview}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />
      <QrShareModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} username={username} displayName={profile.displayName} />
      {!isPreview && <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} username={username} />}
    </div>
  );
}
