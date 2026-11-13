"use client";

import React from "react";
import { TrafficSourceItem } from "../types/analytics.types";

interface TrafficSourcesTableProps {
  sources: TrafficSourceItem[];
}

export function TrafficSourcesTable({ sources }: TrafficSourcesTableProps) {
  return (
    <div className="rounded-2xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-on-surface text-base">مصادر الزيارات الأساسية</h3>
        <span className="text-xs text-primary font-semibold">المتصدر: إنستغرام</span>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${source.color}`} />
                {source.name}
              </span>
              <span className={`font-bold ${source.text}`}>{source.percentage}%</span>
            </div>
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
              <div className={`${source.color} h-full rounded-full`} style={{ width: `${source.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

