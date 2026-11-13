"use client";

import React, { useState } from "react";
import {
  generateDateRange,
  calculateCTR,
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

const TOP_LINKS_DATA: TopLinkPerformance[] = [
  {
    id: "1",
    rank: 1,
    title: "متجري الإلكتروني على سلة",
    badge: "متجر إلكتروني",
    badgeColor: "bg-secondary/10 text-secondary",
    icon: "shopping_bag",
    iconColor: "bg-secondary/15 text-secondary",
    url: "salla.sa/tariq-store",
    clicks: 8920,
    ctr: "45.0%",
    barWidth: "45%",
    barColor: "bg-primary",
    bounceRate: "22.4%",
    avgStay: "1m 45s",
    tag: "الأعلى إيراداً",
    tagColor: "text-primary",
  },
  {
    id: "2",
    rank: 2,
    title: "قناة اليوتيوب الرسمية",
    badge: "فيديو يوتيوب",
    badgeColor: "bg-error/10 text-error",
    icon: "smart_display",
    iconColor: "bg-error/15 text-error",
    url: "youtube.com/@tariq_creative",
    clicks: 5430,
    ctr: "27.4%",
    barWidth: "27.4%",
    barColor: "bg-primary-container",
    bounceRate: "18.1%",
    avgStay: "4m 12s",
    tag: "مشاهدات مرتفعة",
    tagColor: "text-tertiary",
  },
  {
    id: "3",
    rank: 3,
    title: "حجز استشارة خاصة واتساب",
    badge: "محادثة فورية",
    badgeColor: "bg-primary/10 text-primary",
    icon: "chat",
    iconColor: "bg-primary/15 text-primary",
    url: "wa.me/966500000000",
    clicks: 3720,
    ctr: "18.7%",
    barWidth: "18.7%",
    barColor: "bg-tertiary",
    bounceRate: "9.8%",
    avgStay: "--",
    tag: "تحويل مباشر 82%",
    tagColor: "text-primary",
  },
  {
    id: "4",
    rank: 4,
    title: "مقالات ونشرات المدونة",
    badge: "مقال وتدوينة",
    badgeColor: "bg-surface-container-high text-on-surface-variant",
    icon: "auto_stories",
    iconColor: "bg-tertiary/15 text-tertiary",
    url: "tariq.me/articles",
    clicks: 1750,
    ctr: "8.9%",
    barWidth: "8.9%",
    barColor: "bg-outline-variant",
    bounceRate: "38.2%",
    avgStay: "2m 10s",
    tag: "قراءة متأنية",
    tagColor: "text-on-surface-variant",
  },
];

const TRAFFIC_SOURCES_DATA: TrafficSourceItem[] = [
  { name: "إنستغرام (Instagram)", percentage: 54, color: "bg-secondary", text: "text-secondary" },
  { name: "تيك توك (TikTok)", percentage: 28, color: "bg-tertiary", text: "text-tertiary" },
  { name: "منصة إكس (Twitter)", percentage: 12, color: "bg-primary", text: "text-primary" },
  { name: "زيارات مباشرة (Direct)", percentage: 6, color: "bg-outline-variant", text: "text-on-surface-variant" },
];

const COUNTRIES_DATA: CountryItem[] = [
  { name: "المملكة العربية السعودية", percentage: "68%", flag: "🇸🇦" },
  { name: "الإمارات العربية المتحدة", percentage: "15%", flag: "🇦🇪" },
  { name: "دولة الكويت", percentage: "9%", flag: "🇰🇼" },
  { name: "مصر", percentage: "8%", flag: "🇪🇬" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<7 | 30>(7);

  const dates = generateDateRange(range);
  const sampleViews = dates.map((d, i) => ({
    date: d,
    count: Math.floor(4500 + Math.sin(i * 0.8) * 1800 + (i % 3) * 600),
  }));

  const sampleClicks = dates.map((d, i) => ({
    date: d,
    count: Math.floor(1800 + Math.sin(i * 0.8) * 800 + (i % 2) * 300),
  }));

  const totalViews = sampleViews.reduce((acc, c) => acc + c.count, 0);
  const totalClicks = sampleClicks.reduce((acc, c) => acc + c.count, 0);
  const ctr = calculateCTR(totalViews, totalClicks);

  const handleExportCsv = () => {
    window.open("/api/analytics/export?type=csv", "_blank");
  };

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
        topLinkTitle={TOP_LINKS_DATA[0].title}
      />

      <AnalyticsChart
        viewsSeries={sampleViews}
        clicksSeries={sampleClicks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <TopLinksTable topLinks={TOP_LINKS_DATA} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <TrafficSourcesTable sources={TRAFFIC_SOURCES_DATA} />
          <DevicesAndGeoBreakdown countries={COUNTRIES_DATA} />
        </div>
      </div>
    </div>
  );
}
