"use client";

import React from "react";
import { AdminAnalyticsData } from "../types/admin.types";
import { AppCard, AppBadge } from "@/shared/ui";
import { TrendingUp, Users, DollarSign, MousePointerClick, Eye, Award } from "lucide-react";

export function AdminAnalyticsTab({ data }: { data: AdminAnalyticsData }) {
  const chartHeight = 160;
  const chartWidth = 600;
  const maxRevenue = Math.max(...data.chartData.map((d) => d.revenue), 100);

  const points = data.chartData.map((d, i) => {
    const x = (i / (data.chartData.length - 1)) * chartWidth;
    const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 30);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AppCard className="p-5 border-primary/40 bg-surface-container-low">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-surface-variant">الإيرادات الشهرية (MRR)</span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-on-surface">{data.mrr.toLocaleString("ar-SA")}</span>
            <span className="text-xs text-on-surface-variant font-bold">ر.س</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-primary font-bold">
            <TrendingUp className="w-3 h-3" />
            <span dir="ltr">+{data.mrrGrowthRate}%</span>
            <span className="text-on-surface-variant mr-1">مقارنة بالشهر الماضي</span>
          </div>
        </AppCard>

        <AppCard className="p-5 border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-surface-variant">إجمالي المستخدمين</span>
            <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-on-surface">{data.totalUsers}</div>
          <p className="mt-2 text-[11px] text-on-surface-variant">{data.activeUsers} حساب نشط حالياً</p>
        </AppCard>

        <AppCard className="p-5 border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-surface-variant">المشتركون (Pro)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-on-surface">{data.proSubscribersCount}</div>
          <p className="mt-2 text-[11px] text-amber-400 font-semibold">باقة الاحترافية والمتاجر</p>
        </AppCard>

        <AppCard className="p-5 border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-surface-variant">زيارات وتفاعلات المنصة</span>
            <div className="w-8 h-8 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-on-surface">{data.totalPlatformViews.toLocaleString("ar-SA")}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-on-surface-variant">
            <MousePointerClick className="w-3 h-3 text-primary" />
            <span>{data.totalPlatformClicks.toLocaleString("ar-SA")} نقرة محققة</span>
          </div>
        </AppCard>
      </div>

      {/* Pure SVG Revenue & Platform Growth Chart */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface">منحنى نمو الإيرادات والاشتراكات اليومية</h3>
            <p className="text-xs text-on-surface-variant">رسم بياني Pure SVG خفيف وفوري لآخر 14 يوماً</p>
          </div>
          <AppBadge variant="live" dot size="sm">تحديث مباشر</AppBadge>
        </div>

        <div className="w-full h-44 relative">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="adminChartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#adminChartGlow)" />
            <path d={pathD} fill="none" stroke="#4edea3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, idx) => (
              <circle key={idx} cx={p.x} cy={p.y} r="3" fill="#4edea3" className="hover:r-5 transition-all cursor-pointer" />
            ))}
          </svg>
        </div>

        <div className="flex justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/20 font-mono">
          <span>{data.chartData[0]?.date}</span>
          <span>{data.chartData[Math.floor(data.chartData.length / 2)]?.date}</span>
          <span>{data.chartData[data.chartData.length - 1]?.date}</span>
        </div>
      </AppCard>

      {/* Top Creators Leaderboard */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-on-surface">أعلى صانعي المحتوى نشاطاً ومبيعات</h3>
          </div>
          <span className="text-xs text-on-surface-variant">مرتبة حسب الأداء التراكمي</span>
        </div>

        <div className="divide-y divide-outline-variant/20">
          {data.topCreators.map((creator, i) => (
            <div key={creator.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface font-mono">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-on-surface">{creator.displayName}</p>
                  <p className="text-[11px] text-primary font-mono" dir="ltr">@{creator.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-on-surface-variant">{creator.linksCount} روابط</span>
                <span className="text-on-surface-variant">{creator.viewsCount} زيارة</span>
                <span className="font-bold text-primary font-mono">{creator.revenue} ر.س</span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>
    </div>
  );
}
