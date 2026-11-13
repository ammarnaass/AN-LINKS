"use client";

import React from "react";
import { Plus } from "lucide-react";

interface LinkHealthBannerProps {
  onToggleAdd: () => void;
  isAdding: boolean;
}

export function LinkHealthBanner({ onToggleAdd, isAdding }: LinkHealthBannerProps) {
  return (
    <div className="rounded-xl bg-surface-container-low p-4 shadow-lg border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">verified_user</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface text-sm">مراقبة سلامة الروابط التلقائية</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>100% صالحة</span>
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            جميع الروابط تعمل بكفاءة عبر خوادم المراقبة الذكية
          </p>
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

