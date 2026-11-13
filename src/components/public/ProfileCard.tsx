import React from "react";
import Image from "next/image";
import { THEMES } from "@/lib/themes";
import {
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Facebook,
  Send,
  MessageCircle,
  Share2,
} from "lucide-react";

export interface SocialItem {
  id: string;
  network: string;
  url: string;
}

interface ProfileCardProps {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  themeKey?: string;
  socials?: SocialItem[];
  isPreview?: boolean;
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  x: Twitter,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  telegram: Send,
  whatsapp: MessageCircle,
};

export function ProfileCard({
  displayName,
  username,
  bio,
  avatarUrl,
  themeKey = "default",
  socials = [],
  isPreview = false,
}: ProfileCardProps) {
  const theme = THEMES[themeKey] || THEMES.default;

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Avatar */}
      <div className="relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white/20 shadow-lg bg-gray-200 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl sm:text-4xl font-bold text-gray-500 uppercase select-none">
              {displayName.charAt(0) || username.charAt(0) || "U"}
            </span>
          )}
        </div>
      </div>

      {/* Name & Bio */}
      <div className="space-y-1.5 max-w-sm px-4">
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme.textPrimary}`}>
          {displayName}
        </h1>
        <p className="text-xs font-mono opacity-70 tracking-wide dir-ltr" dir="ltr">
          @{username}
        </p>
        {bio && (
          <p className={`text-sm mt-2 leading-relaxed ${theme.textSecondary}`}>
            {bio}
          </p>
        )}
      </div>

      {/* Social Icons */}
      {socials.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {socials.map((social) => {
            const IconComponent =
              SOCIAL_ICONS[social.network.toLowerCase()] || MessageCircle;

            const content = (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm ${theme.socialIconClass}`}
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
