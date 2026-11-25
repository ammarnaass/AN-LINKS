"use client";

import React from "react";
import { LanguageSwitcher } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

interface BioFooterProps {
  isPreview: boolean;
  onOpenReport: () => void;
}

export function BioFooter({ isPreview, onOpenReport }: BioFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="pt-6 w-full flex flex-col items-center gap-3 border-t border-outline-variant/25">
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
