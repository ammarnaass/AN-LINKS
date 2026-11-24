"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface AvatarUploadCardProps {
  displayName: string;
  username: string;
  avatarUrl: string | null;
}

export function AvatarUploadCard({
  displayName,
  username,
  avatarUrl,
}: AvatarUploadCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const copyPublicUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xl border border-outline-variant/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            الهوية الشخصية
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs flex items-center gap-1 font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>حساب موثق</span>
          </span>
        </div>

        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="relative group cursor-pointer">
            <img
              src={avatarUrl || defaultAvatar}
              alt={displayName || "المستخدم"}
              className="w-28 h-28 rounded-full object-cover shadow-2xl ring-2 ring-primary/40 group-hover:scale-105 transition"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">{displayName || "صانع محتوى"}</h2>
            <p className="text-xs text-on-surface-variant font-mono" dir="ltr">
              @{username || "username"}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface-container space-y-1 border border-outline-variant/20">
          <span className="text-[11px] text-on-surface-variant">رابط صفحة البايو المباشرة</span>
          <div
            className="flex items-center justify-between gap-2 bg-surface-container-lowest px-3 py-2 rounded-lg font-mono text-xs text-primary"
            dir="ltr"
          >
            <span className="truncate">bio.link/{username || "..."}</span>
            <button
              type="button"
              onClick={copyPublicUrl}
              className="p-1 hover:text-on-surface transition"
              title="نسخ الرابط"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
