import React from "react";
import { THEMES } from "@/features/appearance";
import { QrCode, Share2, CheckCircle2, MapPin } from "lucide-react";
import { SocialItem } from "../types/bio.types";
import { SocialIconsRow, SocialIconsRowProps } from "./SocialIconsRow";

export type { SocialItem };
export { SocialIconsRow };
export type { SocialIconsRowProps };

export interface ProfileCardProps {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  themeKey?: string;
  socials?: SocialItem[];
  linksCount?: number;
  isPreview?: boolean;
  socialPosition?: string | null;
  textPrimaryClass?: string;
  textSecondaryClass?: string;
  socialIconClass?: string;
  onOpenQr?: () => void;
  onOpenShare?: () => void;
}

function ProfileActionBar({
  onOpenQr,
  onOpenShare,
}: {
  onOpenQr?: () => void;
  onOpenShare?: () => void;
}) {
  return (
    <div className="w-full flex items-center justify-between mb-6 px-1">
      <button
        type="button"
        onClick={onOpenQr}
        className="w-9 h-9 rounded-full bg-surface-container-high/80 text-on-surface flex items-center justify-center hover:bg-surface-bright hover:text-primary transition-all shadow-sm active:scale-95 group cursor-pointer"
        title="عرض رمز QR"
        aria-label="عرض رمز QR"
      >
        <QrCode className="w-4 h-4 group-hover:rotate-6 transition-transform" />
      </button>

      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 border border-white/5 shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-[11px] font-semibold text-primary tracking-wide">
          متاح للتعاون
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenShare}
        className="w-9 h-9 rounded-full bg-surface-container-high/80 text-on-surface flex items-center justify-center hover:bg-surface-bright hover:text-primary transition-all shadow-sm active:scale-95 group cursor-pointer"
        title="مشاركة الصفحة"
        aria-label="مشاركة الصفحة"
      >
        <Share2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}

function ProfileAvatar({
  avatarUrl,
  displayName,
  initialLetter,
}: {
  avatarUrl?: string | null;
  displayName: string;
  initialLetter: string;
}) {
  return (
    <div className="relative mb-4 group">
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500" />
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-white/10 shadow-2xl flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-3xl sm:text-4xl select-none">
            {initialLetter}
          </div>
        )}
      </div>
      <span className="absolute bottom-1 start-1.5 w-5 h-5 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md">
        <span className="w-3.5 h-3.5 bg-primary rounded-full animate-pulse" />
      </span>
    </div>
  );
}

function ProfileDetails({
  displayName,
  username,
  bio,
  primaryText,
  secondaryText,
}: {
  displayName: string;
  username: string;
  bio?: string | null;
  primaryText: string;
  secondaryText: string;
}) {
  return (
    <>
      <div className="flex items-center justify-center gap-1.5 mb-1 max-w-sm px-4">
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${primaryText}`}>
          {displayName}
        </h1>
        <CheckCircle2 className="w-5 h-5 text-tertiary fill-tertiary/20 shrink-0" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full dir-ltr" dir="ltr">
          @{username}
        </span>
        <span className="text-xs text-outline flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-400" />
          <span>المملكة العربية السعودية</span>
        </span>
      </div>

      {bio && (
        <p className={`text-xs sm:text-sm max-w-[380px] leading-relaxed mb-5 ${secondaryText}`}>
          {bio}
        </p>
      )}
    </>
  );
}

function ProfileStatsBar({
  linksCount,
  socialsCount,
}: {
  linksCount?: number;
  socialsCount: number;
}) {
  if (linksCount === undefined && socialsCount === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 w-full bg-surface-container/60 rounded-xl p-2.5 mb-6 border border-white/5 text-center shadow-xs">
      {linksCount !== undefined && (
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-primary">{linksCount.toLocaleString("ar-SA")}</span>
          <span className="text-[10px] text-on-surface-variant">رابط نشط</span>
        </div>
      )}
      {socialsCount > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-tertiary">{socialsCount.toLocaleString("ar-SA")}</span>
          <span className="text-[10px] text-on-surface-variant">منصة تواصل</span>
        </div>
      )}
    </div>
  );
}

function resolveProfileTheme(
  themeKey?: string,
  textPrimaryClass?: string,
  textSecondaryClass?: string,
  socialIconClass?: string
) {
  const theme = THEMES[themeKey || "layanDark"] || THEMES.layanDark;
  return {
    primaryText: textPrimaryClass || theme.textPrimary,
    secondaryText: textSecondaryClass || theme.textSecondary,
    iconClass: socialIconClass || theme.socialIconClass,
  };
}

export function ProfileCard({
  displayName,
  username,
  bio,
  avatarUrl,
  themeKey = "layanDark",
  socials = [],
  linksCount,
  isPreview = false,
  socialPosition = "top",
  textPrimaryClass,
  textSecondaryClass,
  socialIconClass,
  onOpenQr,
  onOpenShare,
}: ProfileCardProps) {
  const { primaryText, secondaryText, iconClass } =
    resolveProfileTheme(themeKey, textPrimaryClass, textSecondaryClass, socialIconClass);
  const initialLetter = (displayName?.trim()?.charAt(0) || username?.trim()?.charAt(0) || "ر").toUpperCase();

  return (
    <div className="flex flex-col items-center text-center w-full">
      <ProfileActionBar onOpenQr={onOpenQr} onOpenShare={onOpenShare} />
      <ProfileAvatar avatarUrl={avatarUrl} displayName={displayName} initialLetter={initialLetter} />
      <ProfileDetails displayName={displayName} username={username} bio={bio} primaryText={primaryText} secondaryText={secondaryText} />
      <ProfileStatsBar linksCount={linksCount} socialsCount={socials.length} />
      {socialPosition !== "bottom" && (
        <SocialIconsRow socials={socials} isPreview={isPreview} socialIconClass={iconClass} />
      )}
    </div>
  );
}
