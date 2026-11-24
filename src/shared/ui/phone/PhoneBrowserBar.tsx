"use client";

import React, { useState } from "react";
import { Lock, RotateCw, Copy, Check, ExternalLink } from "lucide-react";

export interface PhoneBrowserBarProps {
  username?: string;
  onReload?: () => void;
  className?: string;
}

export function PhoneBrowserBar({
  username = "creator",
  onReload,
  className = "",
}: PhoneBrowserBarProps) {
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const displayUrl = `anlinks.dev/${username}`;
  const fullUrl = `https://${displayUrl}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);
    if (onReload) onReload();
  };

  return (
    <div
      className={`w-full px-3 py-1.5 bg-surface-container-high/90 backdrop-blur-md border-t border-outline-variant/20 flex items-center justify-between gap-2 text-xs select-none z-30 shrink-0 ${className}`}
      dir="ltr"
    >
      {/* Mobile Address Bar Pill */}
      <div className="flex-1 h-7 bg-surface-container-lowest/90 border border-outline-variant/30 rounded-lg flex items-center justify-between px-2.5 shadow-inner">
        <div className="flex items-center gap-1.5 truncate">
          <Lock className="w-3 h-3 text-primary shrink-0" />
          <span className="font-mono text-[11px] font-medium text-on-surface truncate">
            {displayUrl}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReloadClick}
          aria-label="إعادة تحميل الصفحة"
          title="إعادة تحميل المعاينة"
          className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <RotateCw
            className={`w-3 h-3 ${isRotating ? "animate-spin text-primary" : ""}`}
          />
        </button>
      </div>

      {/* Copy / Share Action */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="نسخ الرابط"
        title={copied ? "تم النسخ!" : "نسخ رابط الصفحة"}
        className="w-7 h-7 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-on-surface hover:text-primary transition-all cursor-pointer shrink-0"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-on-surface-variant" />
        )}
      </button>

      {/* External Open Tab */}
      <a
        href={`/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="فتح في تبويب مستقل"
        title="فتح في تبويب مستقل"
        className="w-7 h-7 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-on-surface hover:text-primary transition-all cursor-pointer shrink-0"
      >
        <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant" />
      </a>
    </div>
  );
}
