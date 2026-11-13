"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";

interface DashboardHeaderProps {
  displayName: string;
  avatarUrl?: string | null;
  username: string;
  isPageActive: boolean;
  onTogglePageActive: () => void;
}

export function DashboardHeader({
  displayName,
  avatarUrl,
  username,
  isPageActive,
  onTogglePageActive,
}: DashboardHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
          <span className="text-on-surface font-semibold">لوحة التحكم</span>
          <span className="material-symbols-outlined text-[14px] [transform:scaleX(-1)]">chevron_left</span>
          <span className="text-primary font-medium">مدير الروابط والمنصات</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>المزامنة التلقائية فورية</span>
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover shadow-lg shadow-black/60 ring-2 ring-primary/40"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-on-surface">أهلاً بك، {displayName}</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                  موثّق
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-on-surface-variant text-xs" dir="ltr">
                  bio.link/{username}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-primary hover:text-primary-fixed transition-colors text-xs pr-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-0 border-outline-variant/30">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-on-surface">حالة الصفحة</span>
              <span className={`text-[11px] font-medium ${isPageActive ? "text-primary" : "text-on-surface-variant"}`}>
                {isPageActive ? "نشطة ومتاحة للجمهور" : "مغلقة مؤقتاً"}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPageActive}
                onChange={onTogglePageActive}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
