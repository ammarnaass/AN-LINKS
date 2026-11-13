"use client";

import React, { useState } from "react";
import { TimeSeriesPoint } from "@/lib/analytics-service";

interface AnalyticsChartProps {
  viewsSeries: TimeSeriesPoint[];
  clicksSeries: TimeSeriesPoint[];
}

export function AnalyticsChart({ viewsSeries, clicksSeries }: AnalyticsChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(3); // default highlight middle

  const maxView = Math.max(...viewsSeries.map((d) => d.count), 1);
  const maxClick = Math.max(...clicksSeries.map((d) => d.count), 1);
  const maxValue = Math.max(maxView, maxClick, 10);

  // Generate SVG path points
  const width = 700;
  const height = 240;
  const paddingBottom = 30;
  const chartHeight = height - paddingBottom;

  const pointsCount = viewsSeries.length;
  const step = pointsCount > 1 ? width / (pointsCount - 1) : width;

  // View points
  const viewCoords = viewsSeries.map((point, idx) => {
    const x = Math.round(idx * step);
    const y = Math.round(chartHeight - (point.count / maxValue) * (chartHeight - 30) + 10);
    return { x, y, point };
  });

  // Click points
  const clickCoords = clicksSeries.map((point, idx) => {
    const x = Math.round(idx * step);
    const y = Math.round(chartHeight - (point.count / maxValue) * (chartHeight - 30) + 10);
    return { x, y, point };
  });

  // Build SVG smooth path strings
  const buildSmoothPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return "";
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cx1 = (prev.x + curr.x) / 2;
      const cy1 = prev.y;
      const cx2 = (prev.x + curr.x) / 2;
      const cy2 = curr.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const viewsLinePath = buildSmoothPath(viewCoords);
  const viewsAreaPath = `${viewsLinePath} L ${viewCoords[viewCoords.length - 1]?.x || width} ${chartHeight} L ${viewCoords[0]?.x || 0} ${chartHeight} Z`;

  const clicksLinePath = buildSmoothPath(clickCoords);
  const clicksAreaPath = `${clicksLinePath} L ${clickCoords[clickCoords.length - 1]?.x || width} ${chartHeight} L ${clickCoords[0]?.x || 0} ${chartHeight} Z`;

  const activeIdx = hoverIndex !== null && hoverIndex < pointsCount ? hoverIndex : Math.floor(pointsCount / 2);
  const activeView = viewCoords[activeIdx];
  const activeClick = clickCoords[activeIdx];

  return (
    <div className="w-full rounded-2xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-on-surface text-lg">معدل المشاهدات مقابل النقرات اليومية</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
              تحديث مباشر
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">تتبع نبض زوار صفحتك على مدار الفترة المحددة</p>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(78,222,163,0.6)]" />
            <span className="text-on-surface">الزيارات</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_rgba(76,215,246,0.6)]" />
            <span className="text-on-surface">النقرات</span>
          </div>
        </div>
      </div>

      {/* Main SVG Area Graph with glowing gradients */}
      <div className="relative w-full h-72 sm:h-80 pt-4 flex flex-col justify-end">
        {/* Floating Tooltip */}
        {activeView && (
          <div
            className="absolute top-2 z-20 pointer-events-none transform -translate-x-1/2 flex flex-col items-center transition-all duration-150"
            style={{ left: `${(activeView.x / width) * 100}%` }}
          >
            <div className="p-2.5 rounded-xl bg-surface-container-highest/95 backdrop-blur-md shadow-2xl border border-outline-variant/40 flex flex-col gap-1 min-w-[130px]">
              <span className="text-[11px] text-on-surface-variant text-center font-mono" dir="ltr">
                {activeView.point.date}
              </span>
              <div className="flex items-center justify-between gap-3 text-primary text-xs font-bold">
                <span>الزيارات:</span>
                <span dir="ltr">{activeView.point.count.toLocaleString("ar-SA")}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-tertiary text-xs font-bold">
                <span>النقرات:</span>
                <span dir="ltr">{(activeClick?.point.count || 0).toLocaleString("ar-SA")}</span>
              </div>
            </div>
            <div className="w-2 h-2 bg-surface-container-highest rotate-45 -mt-1 border-r border-b border-outline-variant/40" />
          </div>
        )}

        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cyanGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
            </linearGradient>
            <filter height="140%" id="neonEmeraldGlow" width="140%" x="-20%" y="-20%">
              <feGaussianBlur result="blur" stdDeviation="3" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter height="140%" id="neonCyanGlow" width="140%" x="-20%" y="-20%">
              <feGaussianBlur result="blur" stdDeviation="3" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines */}
          <line stroke="#262a33" strokeDasharray="4 4" strokeWidth="1" x1="0" x2={width} y1="30" y2="30" />
          <line stroke="#262a33" strokeDasharray="4 4" strokeWidth="1" x1="0" x2={width} y1="90" y2="90" />
          <line stroke="#262a33" strokeDasharray="4 4" strokeWidth="1" x1="0" x2={width} y1="150" y2="150" />
          <line stroke="#262a33" strokeWidth="1" x1="0" x2={width} y1={chartHeight} y2={chartHeight} />

          {/* Cyan Area & Line (Clicks) */}
          <path d={clicksAreaPath} fill="url(#cyanGradient)" />
          <path d={clicksLinePath} fill="none" filter="url(#neonCyanGlow)" stroke="#4cd7f6" strokeWidth="3" />

          {/* Emerald Area & Line (Views) */}
          <path d={viewsAreaPath} fill="url(#emeraldGradient)" />
          <path d={viewsLinePath} fill="none" filter="url(#neonEmeraldGlow)" stroke="#4edea3" strokeWidth="3.5" />

          {/* Active Highlight Marker Line */}
          {activeView && (
            <>
              <line
                stroke="#4edea3"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity="0.6"
                x1={activeView.x}
                x2={activeView.x}
                y1="30"
                y2={chartHeight}
              />
              <circle cx={activeView.x} cy={activeView.y} r="5" fill="#4edea3" className="animate-ping opacity-75" />
              <circle cx={activeView.x} cy={activeView.y} r="4" fill="#0f131c" stroke="#4edea3" strokeWidth="3" />
              {activeClick && (
                <circle cx={activeClick.x} cy={activeClick.y} r="4" fill="#0f131c" stroke="#4cd7f6" strokeWidth="3" />
              )}
            </>
          )}

          {/* Hover trigger areas */}
          {viewCoords.map((coord, idx) => (
            <rect
              key={idx}
              x={Math.max(0, coord.x - step / 2)}
              y={0}
              width={step}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(idx)}
            />
          ))}
        </svg>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between pt-3 text-xs text-on-surface-variant font-mono" dir="ltr">
          {viewsSeries.map((point, idx) => {
            const parts = point.date.split("-");
            const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : point.date;
            const isSelected = idx === activeIdx;

            return (
              <span
                key={point.date}
                className={`transition-colors cursor-pointer ${
                  isSelected ? "text-primary font-bold" : "hover:text-on-surface"
                }`}
                onClick={() => setHoverIndex(idx)}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
