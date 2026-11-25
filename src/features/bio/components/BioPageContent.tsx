"use client";

import React, { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { SocialIconsRow } from "./SocialIconsRow";
import { LinkButton } from "./LinkButton";
import { ReportModal } from "./ReportModal";
import { QrShareModal } from "./QrShareModal";
import { TrackingPixels } from "./TrackingPixels";
import { BioNewsletterCard } from "./BioNewsletterCard";
import { BioDigitalStoreCard } from "./BioDigitalStoreCard";
import { LanguageSwitcher } from "@/shared/ui";
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

function BioLinksDeck({
  links,
  profile,
  buttonClass,
  isPreview,
}: {
  links: LinkItem[];
  profile: ProfileData;
  buttonClass: string;
  isPreview: boolean;
}) {
  const { t } = useTranslation();

  return (
    <nav aria-label={`روابط ${profile.displayName}`} className="w-full flex flex-col gap-3.5 my-4">
      {links.length > 0 ? (
        links.map((link) => (
          <LinkButton
            key={link.id}
            link={link}
            themeKey={profile.themeKey || undefined}
            buttonStyle={profile.buttonStyle}
            borderRadius={profile.borderRadius}
            accentColor={profile.accentColor}
            buttonShadow={profile.buttonShadow}
            buttonClass={buttonClass}
            isPreview={isPreview}
          />
        ))
      ) : (
        <div className="text-center py-6 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40">
          <p className="text-xs text-on-surface-variant font-medium">
            {t("bio.noLinksYet")}
          </p>
        </div>
      )}
    </nav>
  );
}

function BioFooter({
  isPreview,
  onOpenReport,
}: {
  isPreview: boolean;
  onOpenReport: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="pt-6 w-full flex flex-col items-center gap-3 border-t border-white/5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors">
          <span>{t("bio.designedWith")}</span>
          <span className="font-bold text-on-surface">AN LINKS</span>
        </div>
        <LanguageSwitcher variant="minimal" />
      </div>

      {!isPreview && (
        <button
          onClick={onOpenReport}
          className="text-[10px] text-outline hover:text-red-400 transition"
        >
          {t("bio.reportContent")}
        </button>
      )}
    </div>
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
  return (
    <div
      className={`relative w-full max-w-[460px] ${styles.cardClass} rounded-2xl p-5 sm:p-7 flex flex-col items-center z-10 my-4 transition-all duration-300 ${styles.fontClass}`}
    >
      <ProfileCard
        displayName={profile.displayName}
        username={username}
        bio={profile.bio}
        location={profile.location}
        avatarUrl={profile.avatarUrl}
        themeKey={profile.themeKey || undefined}
        socials={socials}
        linksCount={links.length}
        isPreview={isPreview}
        socialPosition={socialPosition}
        textPrimaryClass={styles.textPrimaryClass}
        textSecondaryClass={styles.textSecondaryClass}
        socialIconClass={styles.socialIconClass}
        onOpenQr={onOpenQr}
        onOpenShare={onOpenQr}
      />

      <BioLinksDeck links={links} profile={profile} buttonClass={styles.buttonClass} isPreview={isPreview} />

      <BioDigitalStoreCard
        username={username}
        products={products}
        accentColor={profile.accentColor}
        isPreview={isPreview}
      />

      <BioNewsletterCard
        username={username}
        displayName={profile.displayName}
        accentColor={profile.accentColor || undefined}
        buttonClass={styles.buttonClass}
        isPreview={isPreview}
      />

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
  const styles = resolveThemeStyles(profile);
  const socialPosition = profile.socialPosition || "top";

  usePageBeacon(isPreview, username);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden transition-colors duration-300 ${styles.backgroundClass}`}
      style={styles.backgroundStyle}
      dir="rtl"
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
