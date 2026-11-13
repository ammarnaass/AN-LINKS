"use client";

import React from "react";
import { RefreshCw, Download } from "lucide-react";

interface AnalyticsHeaderProps {
  range: 7 | 30;
  onRangeChange: (r: 7 | 30) => void;
  onExportCsv: () => void;
}

export function AnalyticsHeader({ range, onRangeChange, onExportCsv }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-xs uppercase tracking-wider text-primary font-bold">
            لوحة المراقبة الحية • تيار البيانات الفوري
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] border border-outline-variant/40 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-primary animate-spin" />
            <span>تحديث تلقائي</span>
          </span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">الإحصاءات والتحليلات المتقدمة</h1>
        <p className="text-xs text-on-surface-variant">
          تحليل شامل لسلوك الزوار، أداء الروابط، ومصادر الزيارات لتعظيم التحويلات والتفاعل.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <button
            type="button"
            onClick={() => onRangeChange(7)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              range === 7 ? "bg-surface-container-high text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            آخر 7 أيام
          </button>
          <button
            type="button"
            onClick={() => onRangeChange(30)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              range === 30 ? "bg-surface-container-high text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            آخر 30 يوماً
          </button>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold border border-outline-variant/30 transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>تصدير CSV</span>
        </button>
      </div>
    </div>
  );
}
