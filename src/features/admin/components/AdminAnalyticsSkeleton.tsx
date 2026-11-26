"use client";

import React from "react";
import { AppCard } from "@/shared/ui";
import { LayoutDashboard, RefreshCw, AlertCircle } from "lucide-react";

export interface AdminAnalyticsSkeletonProps {
  isLoading?: boolean;
  onRetry?: () => void;
}

export function AdminAnalyticsSkeleton({
  isLoading = true,
  onRetry,
}: AdminAnalyticsSkeletonProps) {
  if (!isLoading) {
    return (
      <AppCard className="p-8 text-center space-y-4 border-error/30 bg-error/5 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-on-surface">
            تعذّر تحميل بيانات لوحة التحكم الرئيسية
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            حدث خطأ أثناء جلب مؤشرات الأداء والتحليلات من الخادم. يرجى إعادة المحاولة.
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-sm mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة تحميل البيانات</span>
          </button>
        )}
      </AppCard>
    );
  }

  return (
    <div className="space-y-6 font-cairo animate-pulse" dir="rtl" aria-busy="true">
      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <AppCard key={i} className="p-5 border-outline-variant/30 bg-surface-container-low">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-24 bg-surface-container-high rounded" />
              <div className="w-8 h-8 rounded-xl bg-surface-container-high" />
            </div>
            <div className="h-7 w-28 bg-surface-container-high rounded mb-2" />
            <div className="h-2.5 w-36 bg-surface-container-high rounded" />
          </AppCard>
        ))}
      </div>

      {/* Chart Card Placeholder */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-4 w-48 bg-surface-container-high rounded" />
            <div className="h-3 w-32 bg-surface-container-high rounded" />
          </div>
          <div className="h-6 w-20 bg-surface-container-high rounded-full" />
        </div>
        <div className="w-full h-44 bg-surface-container/60 rounded-xl flex items-center justify-center text-on-surface-variant/40">
          <LayoutDashboard className="w-10 h-10 animate-spin opacity-20" />
        </div>
        <div className="flex justify-between pt-2 border-t border-outline-variant/20">
          <div className="h-3 w-16 bg-surface-container-high rounded" />
          <div className="h-3 w-16 bg-surface-container-high rounded" />
          <div className="h-3 w-16 bg-surface-container-high rounded" />
        </div>
      </AppCard>

      {/* Leaderboard Card Placeholder */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-44 bg-surface-container-high rounded" />
          <div className="h-3 w-28 bg-surface-container-high rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-container-high" />
                <div className="space-y-1">
                  <div className="h-3.5 w-28 bg-surface-container-high rounded" />
                  <div className="h-2.5 w-16 bg-surface-container-high rounded" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-3 w-12 bg-surface-container-high rounded" />
                <div className="h-3 w-12 bg-surface-container-high rounded" />
              </div>
            </div>
          ))}
        </div>
      </AppCard>
    </div>
  );
}
