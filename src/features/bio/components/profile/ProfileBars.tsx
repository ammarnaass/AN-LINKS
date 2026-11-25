"use client";

import React from "react";
import { QrCode, Share2 } from "lucide-react";

export interface ProfileActionBarProps {
  onOpenQr?: () => void;
  onOpenShare?: () => void;
}

export function ProfileActionBar({ onOpenQr, onOpenShare }: ProfileActionBarProps) {
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

      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 border border-outline-variant/25 shadow-xs">
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

export interface ProfileStatsBarProps {
  linksCount?: number;
  socialsCount: number;
}

export function ProfileStatsBar({ linksCount, socialsCount }: ProfileStatsBarProps) {
  if (linksCount === undefined && socialsCount === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 w-full bg-surface-container/60 rounded-xl p-2.5 mb-6 border border-outline-variant/25 text-center shadow-xs">
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
