"use client";

import React from "react";
import { TimeSeriesPoint } from "@/lib/analytics-service";

interface AnalyticsChartProps {
  viewsSeries: TimeSeriesPoint[];
  clicksSeries: TimeSeriesPoint[];
}

export function AnalyticsChart({ viewsSeries, clicksSeries }: AnalyticsChartProps) {
  const maxView = Math.max(...viewsSeries.map((d) => d.count), 1);
  const maxClick = Math.max(...clicksSeries.map((d) => d.count), 1);
  const maxValue = Math.max(maxView, maxClick, 10);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base">حركة الزيارات والنقرات اليومية</h3>
          <p className="text-xs text-gray-500 mt-0.5">مقارنة بين عدد مشاهدات الصفحة ونقرات الروابط</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-700">المشاهدات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-700">النقرات</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full h-56 pt-4">
        <div className="w-full h-full flex items-end gap-2 sm:gap-4 border-b border-gray-200 pb-2">
          {viewsSeries.map((point, idx) => {
            const clickPoint = clicksSeries[idx];
            const viewHeight = Math.max(Math.round((point.count / maxValue) * 100), 4);
            const clickHeight = Math.max(
              Math.round(((clickPoint?.count || 0) / maxValue) * 100),
              4
            );

            // Short date label: DD/MM
            const parts = point.date.split("-");
            const dateLabel = parts.length === 3 ? `${parts[2]}/${parts[1]}` : point.date;

            return (
              <div
                key={point.date}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center pointer-events-none">
                  <div className="bg-gray-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                    <div>{point.date}</div>
                    <div className="text-blue-300">مشاهدات: {point.count}</div>
                    <div className="text-emerald-300">نقرات: {clickPoint?.count || 0}</div>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                </div>

                {/* Bars Pair */}
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* View Bar */}
                  <div
                    style={{ height: `${viewHeight}%` }}
                    className="w-1/2 max-w-[16px] bg-blue-500 rounded-t-sm transition-all duration-300 group-hover:bg-blue-600"
                  />
                  {/* Click Bar */}
                  <div
                    style={{ height: `${clickHeight}%` }}
                    className="w-1/2 max-w-[16px] bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-600"
                  />
                </div>

                {/* X Axis Date */}
                <span className="text-[10px] text-gray-400 mt-2 font-mono" dir="ltr">
                  {dateLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

