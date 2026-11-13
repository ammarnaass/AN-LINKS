"use client";

import React, { useState } from "react";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { generateDateRange, calculateCTR } from "@/lib/analytics-service";
import { Download, ExternalLink, RefreshCw, FileText } from "lucide-react";

export default function AnalyticsPage() {
  const [range, setRange] = useState<7 | 30>(7);

  // Sample data simulating active page metrics
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

  const topLinks = [
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

  const trafficSources = [
    { name: "إنستغرام (Instagram)", percentage: 54, color: "bg-secondary", text: "text-secondary" },
    { name: "تيك توك (TikTok)", percentage: 28, color: "bg-tertiary", text: "text-tertiary" },
    { name: "منصة إكس (Twitter)", percentage: 12, color: "bg-primary", text: "text-primary" },
    { name: "زيارات مباشرة (Direct)", percentage: 6, color: "bg-outline-variant", text: "text-on-surface-variant" },
  ];

  const countries = [
    { name: "المملكة العربية السعودية", percentage: "68%", flag: "🇸🇦" },
    { name: "الإمارات العربية المتحدة", percentage: "15%", flag: "🇦🇪" },
    { name: "دولة الكويت", percentage: "9%", flag: "🇰🇼" },
    { name: "مصر", percentage: "8%", flag: "🇪🇬" },
  ];

  const handleExportCsv = () => {
    window.open("/api/analytics/export?type=csv", "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
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
          {/* Date range picker */}
          <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setRange(7)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                range === 7 ? "bg-surface-container-high text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              آخر 7 أيام
            </button>
            <button
              type="button"
              onClick={() => setRange(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                range === 30 ? "bg-surface-container-high text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              آخر 30 يوماً
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold border border-outline-variant/30 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>تصدير CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Bento KPI Metric Cards */}
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
                {topLinks[0].title}
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

      {/* Main Chart Section */}
      <AnalyticsChart viewsSeries={sampleViews} clicksSeries={sampleClicks} />

      {/* 2 Columns Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Links Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30 space-y-4">
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

        {/* Column 2: Sources, Devices & Countries (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Traffic Sources Bento Card */}
          <div className="rounded-2xl bg-surface-container-low p-6 shadow-xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-on-surface text-base">مصادر الزيارات الأساسية</h3>
              <span className="text-xs text-primary font-semibold">المتصدر: إنستغرام</span>
            </div>

            <div className="space-y-3">
              {trafficSources.map((source) => (
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

          {/* Devices & Countries Sub-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Devices Widget */}
            <div className="p-4 rounded-xl bg-surface-container-low shadow-xl border border-outline-variant/30 flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface">الأجهزة المستخدمة</span>
              <div className="my-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    هواتف ذكية
                  </span>
                  <span className="font-bold text-on-surface">82%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    أجهزة مكتبية
                  </span>
                  <span className="font-bold text-on-surface">14%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                    أجهزة لوحية
                  </span>
                  <span className="font-bold text-on-surface">4%</span>
                </div>
              </div>
            </div>

            {/* Top Countries Widget */}
            <div className="p-4 rounded-xl bg-surface-container-low shadow-xl border border-outline-variant/30 flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface">أعلى الدول زيارة</span>
              <div className="my-3 space-y-2">
                {countries.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant flex items-center gap-1.5 truncate">
                      <span>{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="font-bold text-primary font-mono">{c.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
