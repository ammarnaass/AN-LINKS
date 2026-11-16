"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminPlatformAnalyticsResponse } from "@/features/admin/types/admin.types";
import { AppCard, AppButton } from "@/shared/ui";
import {
  Link2,
  MousePointerClick,
  Layers,
  RefreshCw,
} from "lucide-react";
import { AnalyticsDeviceCountryCards } from "./AnalyticsDeviceCountryCards";

export function PlatformAnalyticsSubTab() {
  const [data, setData] = useState<AdminPlatformAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/links/analytics");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "فشل جلب إحصائيات المنصات والروابط");
      }
      setData(json.data || json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل التحليلات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading && !data) {
    return (
      <div className="p-12 text-center text-on-surface-variant font-cairo" dir="rtl">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        <span>جارٍ تجميع بيانات التحليلات الفعلية...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-4 rounded-xl bg-error/10 text-error border border-error/20 text-xs font-cairo" dir="rtl">
        {error}
      </div>
    );
  }

  const {
    totalLinks = 0,
    totalClicks = 0,
    activePlatformsCount = 0,
    platformBreakdown = [],
    deviceBreakdown = [],
    countryBreakdown = [],
    topLinks = [],
  } = data || {};

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface">
            تحليلات المنصات والأداء الفعلي
          </h2>
          <p className="text-xs text-on-surface-variant">
            مؤشرات النقرات الحقيقية المجمعة من حركة المرور والتوزيع الجغرافي والأجهزة
          </p>
        </div>
        <AppButton
          variant="ghost"
          size="sm"
          onClick={fetchAnalytics}
          disabled={isLoading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
        >
          تحديث
        </AppButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppCard className="p-4 sm:p-5 flex items-center justify-between border-primary/30">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface-variant mb-1">إجمالي الروابط</span>
            <span className="text-2xl font-bold text-on-surface font-mono">
              {totalLinks.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Link2 className="w-5 h-5" />
          </div>
        </AppCard>

        <AppCard className="p-4 sm:p-5 flex items-center justify-between border-emerald-500/30">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface-variant mb-1">إجمالي النقرات الفعلية</span>
            <span className="text-2xl font-bold text-on-surface font-mono">
              {totalClicks.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <MousePointerClick className="w-5 h-5" />
          </div>
        </AppCard>

        <AppCard className="p-4 sm:p-5 flex items-center justify-between border-secondary/30">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface-variant mb-1">المنصات النشطة</span>
            <span className="text-2xl font-bold text-on-surface font-mono">
              {activePlatformsCount.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
            <Layers className="w-5 h-5" />
          </div>
        </AppCard>
      </div>

      {/* Breakdown Grid: Platforms & Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <AppCard className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>توزيع النقرات والروابط حسب المنصة</span>
          </h3>
          {platformBreakdown.length === 0 ? (
            <p className="text-xs text-on-surface-variant py-4">لا توجد إحصائيات منصات حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {platformBreakdown.slice(0, 8).map((p) => {
                const percentage = totalClicks > 0 ? Math.round((p.clicks / totalClicks) * 100) : 0;
                return (
                  <div key={p.slug} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.brandColor }}
                        />
                        <span className="font-bold text-on-surface">{p.nameAr}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">({p.linksCount} رابط)</span>
                      </div>
                      <span className="font-mono font-bold text-on-surface">
                        {p.clicks.toLocaleString("ar-SA")} نقرة ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: p.brandColor || "#4EDEA3",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AppCard>

        {/* Top Performing Links */}
        <AppCard className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
            <span>أعلى الروابط نقراً وتفاعلاً</span>
          </h3>
          {topLinks.length === 0 ? (
            <p className="text-xs text-on-surface-variant py-4">لا توجد نقرات مسجلة حتى الآن.</p>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {topLinks.slice(0, 6).map((l, index) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-surface-container-high font-mono font-bold flex items-center justify-center text-[10px] text-on-surface-variant shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-on-surface truncate" title={l.title}>
                        {l.title}
                      </p>
                      <span className="text-[11px] text-on-surface-variant font-mono" dir="ltr">
                        @{l.username}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary shrink-0">
                    {l.clicksCount.toLocaleString("ar-SA")} نقرة
                  </span>
                </div>
              ))}
            </div>
          )}
        </AppCard>
      </div>

      {/* Device & Country Breakdown Cards */}
      <AnalyticsDeviceCountryCards
        deviceBreakdown={deviceBreakdown}
        countryBreakdown={countryBreakdown}
      />
    </div>
  );
}
