"use client";

import React from "react";
import { LinkButton } from "./LinkButton";
import { useTranslation } from "@/shared/i18n";
import { LinkItem, ProfileData } from "../types/bio.types";

interface BioLinksDeckProps {
  links: LinkItem[];
  profile: ProfileData;
  buttonClass: string;
  isPreview: boolean;
}

export function BioLinksDeck({
  links,
  profile,
  buttonClass,
  isPreview,
}: BioLinksDeckProps) {
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
