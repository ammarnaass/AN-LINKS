"use client";

import React from "react";
import { TopLinkPerformance } from "../types/analytics.types";

interface TopLinksTableProps {
  topLinks: TopLinkPerformance[];
}

export function TopLinksTable({ topLinks }: TopLinksTableProps) {
  return (
    <div className="rounded-2xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-on-surface text-base">تفاصيل أداء الروابط الفردية</h3>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {topLinks.length} روابط نشطة
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {topLinks.map((link) => (
          <div
            key={link.id}
            className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 hover:bg-surface-container-high transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {link.rank}
                </span>
                <div className={`w-10 h-10 rounded-xl ${link.iconColor} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface text-sm truncate">{link.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant truncate" dir="ltr">
                    {link.url}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-on-surface font-mono text-sm">
                    {link.clicks.toLocaleString("ar-SA")} نقرة
                  </span>
                  <span className="text-xs text-primary font-bold">CTR {link.ctr}</span>
                </div>
                <div className="w-20 bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                  <div className={`${link.barColor} h-full rounded-full`} style={{ width: link.barWidth }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
              <div className="flex items-center gap-3">
                <span>الارتداد: <strong className="text-on-surface">{link.bounceRate}</strong></span>
                <span>متوسط البقاء: <strong className="text-primary">{link.avgStay}</strong></span>
              </div>
              <span className={`${link.tagColor} font-semibold flex items-center gap-0.5`}>
                {link.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

