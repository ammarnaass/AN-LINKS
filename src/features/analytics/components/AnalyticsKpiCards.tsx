"use client";

import React from "react";

interface AnalyticsKpiCardsProps {
  totalViews: number;
  totalClicks: number;
  ctr: number;
  topLinkTitle: string;
}

export function AnalyticsKpiCards({
  totalViews,
  totalClicks,
  ctr,
  topLinkTitle,
}: AnalyticsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Views */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 flex flex-col justify-between shadow-xl border border-outline-variant/30 group hover:border-outline-variant/60 transition">
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/20 transition" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-on-surface-variant">إجمالي الزيارات</span>
            <span className="text-2xl font-bold text-on-surface mt-1 tracking-tight">
              {totalViews.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-1">
          <div className="flex items-center gap-1 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] [transform:scaleX(-1)]">trending_up</span>
            <span dir="ltr">+18.4%</span>
            <span className="text-on-surface-variant mr-1 text-[11px]">مقارنة بالفترة السابقة</span>
          </div>
          <svg className="w-16 h-5 text-primary overflow-visible" fill="none" viewBox="0 0 60 20">
            <path d="M1 17L12 14L24 16L36 9L48 11L59 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Card 2: Total Clicks */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 flex flex-col justify-between shadow-xl border border-outline-variant/30 group hover:border-outline-variant/60 transition">
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary-container/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary-container/25 transition" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-on-surface-variant">إجمالي النقرات</span>
            <span className="text-2xl font-bold text-on-surface mt-1 tracking-tight">
              {totalClicks.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-fixed">
            <span className="material-symbols-outlined text-[20px]">ads_click</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-1">
          <div className="flex items-center gap-1 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] [transform:scaleX(-1)]">trending_up</span>
            <span dir="ltr">+24.1%</span>
            <span className="text-on-surface-variant mr-1 text-[11px]">نمو ممتاز</span>
          </div>
          <svg className="w-16 h-5 text-primary-fixed overflow-visible" fill="none" viewBox="0 0 60 20">
            <path d="M1 18L14 13L25 15L38 6L49 8L59 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Card 3: CTR */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 flex flex-col justify-between shadow-xl border border-outline-variant/30 group hover:border-outline-variant/60 transition">
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-tertiary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-tertiary/20 transition" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-on-surface-variant">معدل التحويل (CTR)</span>
            <span className="text-2xl font-bold text-on-surface mt-1 tracking-tight">
              {ctr}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[20px]">touch_app</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-1">
          <div className="flex items-center gap-1 text-tertiary text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] [transform:scaleX(-1)]">trending_up</span>
            <span dir="ltr">+4.2%</span>
            <span className="text-on-surface-variant mr-1 text-[11px]">تحسن مستمر</span>
          </div>
          <svg className="w-16 h-5 text-tertiary overflow-visible" fill="none" viewBox="0 0 60 20">
            <path d="M1 12L13 14L27 10L39 11L48 5L59 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Card 4: Top Link */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 flex flex-col justify-between shadow-xl border border-outline-variant/30 group hover:border-outline-variant/60 transition">
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-secondary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-secondary/20 transition" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-on-surface-variant">أعلى رابط تفاعلاً</span>
            <span className="text-lg font-bold text-secondary mt-1 tracking-tight truncate max-w-[150px]">
              {topLinkTitle}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">local_mall</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-1">
          <div className="flex items-center gap-1 text-on-surface-variant text-xs">
            <span className="text-secondary font-bold">45%</span>
            <span>من مجموع نقراتك</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-[10px] font-semibold">
            الأول أسبوعياً
          </span>
        </div>
      </div>
    </div>
  );
}
