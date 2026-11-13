import React from "react";
import { THEMES } from "@/features/appearance";
import { SOCIAL_ICON_MAP, GenericLinkIcon } from "@/shared/ui";
import { QrCode, Share2, CheckCircle2, MapPin } from "lucide-react";
import { SocialItem } from "../types/bio.types";

export type { SocialItem };

interface ProfileCardProps {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  themeKey?: string;
  socials?: SocialItem[];
  isPreview?: boolean;
  onOpenQr?: () => void;
  onOpenShare?: () => void;
}

export function ProfileCard({
  displayName,
  username,
  bio,
  avatarUrl,
  themeKey = "default",
  socials = [],
  isPreview = false,
  onOpenQr,
  onOpenShare,
}: ProfileCardProps) {
  const theme = THEMES[themeKey] || THEMES.default;

  return (
    <div className="flex flex-col items-center text-center w-full">
      {/* Top Action Bar */}
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

        {/* Live Creator Status Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 border border-white/5 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
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

      {/* Avatar */}
      <div className="relative mb-4 group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500"></div>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-white/10 shadow-2xl flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-3xl sm:text-4xl font-bold text-gray-400 uppercase select-none">
              {displayName.charAt(0) || username.charAt(0) || "U"}
            </span>
          )}
        </div>
        <span className="absolute bottom-1 start-1.5 w-5 h-5 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md">
          <span className="w-3.5 h-3.5 bg-primary rounded-full animate-pulse"></span>
        </span>
      </div>

      {/* Name & Badge */}
      <div className="flex items-center justify-center gap-1.5 mb-1 max-w-sm px-4">
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme.textPrimary}`}>
          {displayName}
        </h1>
        <CheckCircle2 className="w-5 h-5 text-tertiary fill-tertiary/20 shrink-0" />
      </div>

      {/* Handle & Location Pill */}
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
        <p className={`text-xs sm:text-sm max-w-[380px] leading-relaxed mb-5 ${theme.textSecondary}`}>
          {bio}
        </p>
      )}

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-3 w-full bg-surface-container/60 rounded-xl p-2.5 mb-6 border border-white/5 divide-x divide-white/5 text-center shadow-xs">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-primary">250K+</span>
          <span className="text-[10px] text-on-surface-variant">متابع رقمي</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-tertiary">14+</span>
          <span className="text-[10px] text-on-surface-variant">مشروع ذكي</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-secondary">25K</span>
          <span className="text-[10px] text-on-surface-variant">مشترك النشرة</span>
        </div>
      </div>

      {/* Social Channels Row */}
      {socials.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          {socials.map((social) => {
            const IconComponent =
              SOCIAL_ICON_MAP[social.network.toLowerCase()] || GenericLinkIcon;

            const content = (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 shadow-sm ${theme.socialIconClass}`}
                title={social.network}
              >
                <IconComponent className="w-4 h-4" />
              </div>
            );

            if (isPreview) {
              return <div key={social.id}>{content}</div>;
            }

            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                {content}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

