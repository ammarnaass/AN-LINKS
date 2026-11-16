import React from "react";
import { getSocialIcon } from "@/shared/ui";
import { SocialItem } from "../types/bio.types";

export interface SocialIconsRowProps {
  socials?: SocialItem[];
  isPreview?: boolean;
  socialIconClass?: string;
  className?: string;
}

export function SocialIconsRow({
  socials = [],
  isPreview = false,
  socialIconClass = "",
  className = "flex flex-wrap items-center justify-center gap-2.5 mb-6",
}: SocialIconsRowProps) {
  if (!socials || socials.length === 0) return null;

  return (
    <div className={className}>
      {socials.map((social) => {
        const IconComponent = getSocialIcon(social.network);

        const content = (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 shadow-sm ${socialIconClass}`}
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
            aria-label={`زيارة ${social.network}`}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
