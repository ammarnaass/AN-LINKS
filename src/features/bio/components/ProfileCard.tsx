import React from "react";
import { THEMES } from "@/features/appearance";
import { MapPin } from "lucide-react";
import { SocialItem } from "../types/bio.types";
import { SocialIconsRow, SocialIconsRowProps } from "./SocialIconsRow";
import { ProfileBadgeRenderer } from "./profile/ProfileBadgeRenderer";
import { ProfileActionBar, ProfileStatsBar } from "./profile/ProfileBars";
import { getAvatarFrameStyles } from "@/features/appearance/utils/avatar-frame.utils";

export type { SocialItem };
export { SocialIconsRow };
export type { SocialIconsRowProps };

export interface ProfileCardProps {
  displayName: string;
  username: string;
  bio?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  themeKey?: string;
  accentColor?: string | null;
  avatarFrameShape?: string | null;
  avatarBorderWidth?: string | null;
  avatarBorderColor?: string | null;
  badgeEnabled?: boolean | null;
  badgeShape?: string | null;
  badgeSize?: string | null;
  badgeColor?: string | null;
  badgeIcon?: string | null;
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

function ProfileAvatar({
  avatarUrl,
  displayName,
  initialLetter,
  avatarFrameShape,
  avatarBorderWidth,
  avatarBorderColor,
  accentColor,
}: {
  avatarUrl?: string | null;
  displayName: string;
  initialLetter: string;
  avatarFrameShape?: string | null;
  avatarBorderWidth?: string | null;
  avatarBorderColor?: string | null;
  accentColor?: string | null;
}) {
  const { containerClass, containerStyle } = getAvatarFrameStyles(
    avatarFrameShape || "circle",
    avatarBorderWidth || "2",
    avatarBorderColor,
    accentColor || "#4edea3"
  );

  return (
    <div className="relative mb-4 group">
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500" />
      <div
        className={`w-24 h-24 sm:w-28 sm:h-28 bg-surface-container-high shadow-2xl flex items-center justify-center ${containerClass}`}
        style={containerStyle}
      >
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
  location,
  primaryText,
  secondaryText,
  badgeEnabled,
  badgeShape,
  badgeSize,
  badgeColor,
  badgeIcon,
  accentColor,
}: {
  displayName: string;
  username: string;
  bio?: string | null;
  location?: string | null;
  primaryText: string;
  secondaryText: string;
  badgeEnabled?: boolean | null;
  badgeShape?: string | null;
  badgeSize?: string | null;
  badgeColor?: string | null;
  badgeIcon?: string | null;
  accentColor?: string | null;
}) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-1 max-w-sm px-4">
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${primaryText}`}>
          {displayName}
        </h1>
        <ProfileBadgeRenderer
          enabled={badgeEnabled}
          shape={badgeShape}
          size={badgeSize}
          color={badgeColor}
          icon={badgeIcon}
          fallbackAccent={accentColor || "#10b981"}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full dir-ltr" dir="ltr">
          @{username}
        </span>
        {location && (
          <span className="text-xs text-outline flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>{location}</span>
          </span>
        )}
      </div>

      {bio && (
        <p className={`text-xs sm:text-sm max-w-[380px] leading-relaxed mb-5 ${secondaryText}`}>
          {bio}
        </p>
      )}
    </>
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
  location,
  avatarUrl,
  themeKey = "layanDark",
  accentColor,
  avatarFrameShape,
  avatarBorderWidth,
  avatarBorderColor,
  badgeEnabled = true,
  badgeShape,
  badgeSize,
  badgeColor,
  badgeIcon,
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
      <ProfileAvatar
        avatarUrl={avatarUrl}
        displayName={displayName}
        initialLetter={initialLetter}
        avatarFrameShape={avatarFrameShape}
        avatarBorderWidth={avatarBorderWidth}
        avatarBorderColor={avatarBorderColor}
        accentColor={accentColor}
      />
      <ProfileDetails
        displayName={displayName}
        username={username}
        bio={bio}
        location={location}
        primaryText={primaryText}
        secondaryText={secondaryText}
        badgeEnabled={badgeEnabled}
        badgeShape={badgeShape}
        badgeSize={badgeSize}
        badgeColor={badgeColor}
        badgeIcon={badgeIcon}
        accentColor={accentColor}
      />
      <ProfileStatsBar linksCount={linksCount} socialsCount={socials.length} />
      {socialPosition !== "bottom" && (
        <SocialIconsRow socials={socials} isPreview={isPreview} socialIconClass={iconClass} />
      )}
    </div>
  );
}
