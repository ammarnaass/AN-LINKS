"use client";

import React, { useState } from "react";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { Eye, MousePointerClick, Percent, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { generateDateRange, aggregateTimeSeries, calculateCTR } from "@/lib/analytics-service";

export default function AnalyticsPage() {
  const [range, setRange] = useState<7 | 30>(7);

  // Sample data simulating active page metrics for demonstration
  const dates = generateDateRange(range);

  const sampleViews = dates.map((d, i) => ({
    date: d,
    count: Math.floor(15 + Math.sin(i) * 10 + (i % 3) * 5),
  }));

  const sampleClicks = dates.map((d, i) => ({
    date: d,
    count: Math.floor(4 + Math.sin(i) * 3 + (i % 2) * 2),
  }));

  const totalViews = sampleViews.reduce((acc, c) => acc + c.count, 0);
  const totalClicks = sampleClicks.reduce((acc, c) => acc + c.count, 0);
  const ctr = calculateCTR(totalViews, totalClicks);

  const topLinks = [
    { id: "1", title: "موقعي الشخصي ومعرض الأعمال", url: "https://ammar.dev", clicks: 38 },
    { id: "2", title: "قناتي التقنية على يوتيوب", url: "https://youtube.com/@tech", clicks: 24 },
    { id: "3", title: "تواصل معي عبر واتساب", url: "https://wa.me/966500000000", clicks: 19 },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Date Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إحصاءات التفاعل والزيارات</h1>
          <p className="text-xs text-gray-500 mt-1">
            متابعة دقيقة لمشاهدات صفحتك ونقرات روابطك مع استبعاد الزواحف الآلية
          </p>
        </div>

        <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRange(7)}
            className={`px-3 py-1.5 rounded-lg transition ${
              range === 7 ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            آخر 7 أيام
          </button>
          <button
            type="button"
            onClick={() => setRange(30)}
            className={`px-3 py-1.5 rounded-lg transition ${
              range === 30 ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            آخر 30 يوم
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500 block">إجمالي المشاهدات</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {totalViews.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500 block">إجمالي النقرات</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {totalClicks.toLocaleString("ar-SA")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>

        {/* CTR */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500 block">معدل النقر (CTR)</span>
            <span className="text-3xl font-extrabold text-gray-900 mt-1 block">
              {ctr}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <AnalyticsChart viewsSeries={sampleViews} clicksSeries={sampleClicks} />

      {/* Top Links Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base">الروابط الأكثر تفاعلاً</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                <th className="pb-3 pr-2">عنوان الرابط</th>
                <th className="pb-3 text-center">النقرات</th>
                <th className="pb-3 text-left pl-2">نسبة المساهمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topLinks.map((link) => {
                const sharePercent = totalClicks > 0 ? Math.round((link.clicks / totalClicks) * 100) : 0;
                return (
                  <tr key={link.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 pr-2">
                      <div className="font-semibold text-gray-800">{link.title}</div>
                      <div className="text-xs text-gray-400 font-mono" dir="ltr">
                        {link.url}
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-bold text-emerald-600">
                      {link.clicks}
                    </td>
                    <td className="py-3.5 text-left pl-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-500 font-mono">{sharePercent}%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${sharePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

