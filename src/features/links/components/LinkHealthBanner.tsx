"use client";

import React from "react";
import { Plus } from "lucide-react";
import { LinkData } from "../types/links.types";

interface LinkHealthBannerProps {
  onToggleAdd: () => void;
  isAdding: boolean;
  links?: LinkData[];
  activeCount?: number;
  totalCount?: number;
  totalClicks?: number;
  pinnedCount?: number;
}

export function LinkHealthBanner({
  onToggleAdd,
  isAdding,
  links,
  activeCount,
  totalCount,
  totalClicks,
  pinnedCount,
}: LinkHealthBannerProps) {
  const total = links ? links.length : (totalCount ?? 0);
  const active = links ? links.filter((l) => l.isActive).length : (activeCount ?? total);
  const pinned = links ? links.filter((l) => l.isPinned).length : (pinnedCount ?? 0);
  const clicks = links
    ? links.reduce((acc, l) => acc + (l.clicksCount ?? l.clicks ?? 0), 0)
    : (totalClicks ?? 0);

  return (
    <div className="rounded-xl bg-surface-container-low p-4 shadow-lg border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">insights</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface text-sm">إحصائيات ونشاط الروابط</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{active}/{total} نشطة</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-1">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-on-surface font-mono">{clicks.toLocaleString("ar-SA")}</span>
              <span>إجمالي النقرات</span>
            </span>
            {pinned > 0 && (
              <>
                <span className="text-outline/40">•</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <span className="font-mono">{pinned.toLocaleString("ar-SA")}</span>
                  <span>مثبتة في الأعلى</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleAdd}
        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-primary transition-all shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>{isAdding ? "إلغاء الإضافة" : "إضافة رابط ذكي جديد"}</span>
      </button>
    </div>
  );
}
