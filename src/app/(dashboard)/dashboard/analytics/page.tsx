"use client";

import React, { useState, useEffect } from "react";
import {
  AnalyticsHeader,
  AnalyticsKpiCards,
  AnalyticsChart,
  TopLinksTable,
  TrafficSourcesTable,
  DevicesAndGeoBreakdown,
  TopLinkPerformance,
  TrafficSourceItem,
  CountryItem,
} from "@/features/analytics";
import { UserAnalyticsSummary } from "@/features/analytics/types/analytics.types";
import { BarChart3 } from "lucide-react";

const TRAFFIC_SOURCES_DATA: TrafficSourceItem[] = [
  { name: "زيارات مباشرة (Direct)", percentage: 65, color: "bg-primary", text: "text-primary" },
  { name: "إنستغرام (Instagram)", percentage: 20, color: "bg-secondary", text: "text-secondary" },
  { name: "تويتر / إكس (X)", percentage: 15, color: "bg-tertiary", text: "text-tertiary" },
];

const COUNTRIES_DATA: CountryItem[] = [
  { name: "المملكة العربية السعودية", percentage: "78%", flag: "🇸🇦" },
  { name: "الإمارات العربية المتحدة", percentage: "12%", flag: "🇦🇪" },
  { name: "الكويت", percentage: "6%", flag: "🇰🇼" },
  { name: "أخرى", percentage: "4%", flag: "🌍" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<7 | 30>(7);
  const [analytics, setAnalytics] = useState<UserAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/analytics?range=${range}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch((err) => console.error("Analytics fetch error:", err))
      .finally(() => setIsLoading(false));
  }, [range]);

  const totalViews = analytics?.totalViews ?? 0;
  const totalClicks = analytics?.totalClicks ?? 0;
  const ctr = analytics?.averageCtr ?? 0;

  const viewsSeries = analytics?.chartData.map((d) => ({ date: d.date, count: d.views })) || [];
  const clicksSeries = analytics?.chartData.map((d) => ({ date: d.date, count: d.clicks })) || [];

  const topLinks: TopLinkPerformance[] = (analytics?.topLinks || []).map((l, idx) => ({
    id: l.id,
    rank: idx + 1,
    title: l.title,
    badge: "رابط مخصص",
    badgeColor: "bg-primary/10 text-primary",
    icon: "link",
    iconColor: "bg-primary/15 text-primary",
    url: l.url,
    clicks: l.clicks,
    ctr: `${l.ctr}%`,
    barWidth: `${Math.min(100, Math.max(10, l.ctr))}%`,
    barColor: "bg-primary",
    bounceRate: "--",
    avgStay: "--",
    tag: idx === 0 ? "الأعلى نقراً" : "نشط",
    tagColor: "text-primary",
  }));

  const handleExportCsv = () => {
    window.open("/api/analytics/export?type=csv", "_blank");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-surface-container-high rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-surface-container-low rounded-2xl" />
          <div className="h-28 bg-surface-container-low rounded-2xl" />
          <div className="h-28 bg-surface-container-low rounded-2xl" />
        </div>
        <div className="h-72 bg-surface-container-low rounded-2xl" />
      </div>
    );
  }

  const isEmpty = totalViews === 0 && totalClicks === 0 && topLinks.length === 0;

  return (
    <div className="space-y-8">
      <AnalyticsHeader
        range={range}
        onRangeChange={setRange}
        onExportCsv={handleExportCsv}
      />

      <AnalyticsKpiCards
        totalViews={totalViews}
        totalClicks={totalClicks}
        ctr={ctr}
        topLinkTitle={topLinks[0]?.title || "لا توجد روابط نشطة"}
      />

      {isEmpty && (
        <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-on-surface text-base">لا توجد زيارات مسجلة بعد لصفحتك</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            قم بنسخ رابط صفحتك الشخصية ومشاركته في حساباتك على وسائل التواصل الاجتماعي لبدء جمع الزيارات ورصد تفاعل جمهورك.
          </p>
        </div>
      )}

      <AnalyticsChart
        viewsSeries={viewsSeries}
        clicksSeries={clicksSeries}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <TopLinksTable topLinks={topLinks} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <TrafficSourcesTable sources={analytics?.trafficSources || TRAFFIC_SOURCES_DATA} />
          <DevicesAndGeoBreakdown countries={analytics?.countries || COUNTRIES_DATA} />
        </div>
      </div>
    </div>
  );
}
