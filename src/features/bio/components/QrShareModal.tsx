"use client";

import React, { useState } from "react";
import { X, Check, Copy, Share2 } from "lucide-react";
import { TwitterXIcon, WhatsappIcon, TelegramIcon } from "@/shared/ui";

interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  displayName: string;
}

export function QrShareModal({
  isOpen,
  onClose,
  username,
  displayName,
}: QrShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://anlinks.to/${username}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(pageUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`تصفح روابط ${displayName} عبر منصة AN LINKS:\n${pageUrl}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" dir="rtl">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm bg-surface-container-high border border-outline-variant/40 rounded-2xl shadow-2xl p-6 text-on-surface z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-on-surface">
              رمز QR والمشاركة
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-xl shadow-inner mx-auto max-w-[220px]">
          <img
            src={qrImageUrl}
            alt={`رمز QR لصفحة @${username}`}
            className="w-40 h-40 object-contain"
          />
          <span className="text-[11px] font-mono font-semibold text-gray-500 mt-2 dir-ltr" dir="ltr">
            @{username}
          </span>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
          <input
            type="text"
            readOnly
            value={pageUrl}
            className="flex-1 bg-transparent px-3 text-xs font-mono text-on-surface-variant focus:outline-none truncate dir-ltr text-left"
            dir="ltr"
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary-container transition active:scale-95 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
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

        <div className="space-y-2">
          <span className="text-xs text-on-surface-variant font-medium block text-right">
            مشاركة سريعة عبر:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-container hover:bg-surface-bright text-xs font-medium text-emerald-400 transition"
            >
              <WhatsappIcon className="w-4 h-4" />
              <span>واتساب</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-container hover:bg-surface-bright text-xs font-medium text-on-surface transition"
            >
              <TwitterXIcon className="w-3.5 h-3.5" />
              <span>إكس</span>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(displayName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-container hover:bg-surface-bright text-xs font-medium text-sky-400 transition"
            >
              <TelegramIcon className="w-4 h-4" />
              <span>تلغرام</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
