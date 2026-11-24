"use client";

import React from "react";

interface DnsInstructionsBoxProps {
  verificationToken?: string | null;
}

export function DnsInstructionsBox({ verificationToken }: DnsInstructionsBoxProps) {
  return (
    <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 space-y-3">
      <h4 className="text-xs font-bold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-primary">dns</span>
        إعداد سجلات DNS في مزود نطاقك (Cloudflare, GoDaddy, Namecheap...):
      </h4>

      <div className="space-y-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="text-primary font-bold mr-2">سجل CNAME:</span>
            <span className="text-on-surface-variant">الاسم: </span>
            <span className="text-on-surface font-bold">@ أو النطاق الفرعي</span>
          </div>
          <div>
            <span className="text-on-surface-variant">القيمة: </span>
            <span className="text-primary font-bold">cname.anlinks.dev</span>
          </div>
        </div>

        {verificationToken && (
          <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-primary font-bold mr-2">سجل TXT:</span>
              <span className="text-on-surface-variant">الاسم: </span>
              <span className="text-on-surface font-bold">@</span>
            </div>
            <div>
              <span className="text-on-surface-variant">القيمة: </span>
              <span className="text-on-surface select-all break-all">
                anlinks-verification={verificationToken}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
