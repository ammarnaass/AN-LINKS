"use client";

import React from "react";
import { AppCard } from "@/shared/ui";
import { Smartphone, Laptop, Tablet, HelpCircle, Globe } from "lucide-react";

const DEVICE_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  MOBILE: { label: "الهواتف الذكية", icon: Smartphone },
  DESKTOP: { label: "أجهزة الحاسوب", icon: Laptop },
  TABLET: { label: "الأجهزة اللوحية", icon: Tablet },
  UNKNOWN: { label: "أجهزة أخرى / غير محدد", icon: HelpCircle },
};

export interface AnalyticsDeviceCountryCardsProps {
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  countryBreakdown: Array<{ country: string; count: number; percentage: number }>;
}

export function AnalyticsDeviceCountryCards({
  deviceBreakdown,
  countryBreakdown,
}: AnalyticsDeviceCountryCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-cairo" dir="rtl">
      {/* Device Breakdown */}
      <AppCard className="space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-secondary" />
          <span>توزيع الأجهزة المستخدمة</span>
        </h3>
        {deviceBreakdown.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">لا توجد بيانات أجهزة كافية.</p>
        ) : (
          <div className="space-y-3">
            {deviceBreakdown.map((dev) => {
              const meta = DEVICE_LABELS[dev.device] || DEVICE_LABELS.UNKNOWN;
              const Icon = meta.icon;
              return (
                <div key={dev.device} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-on-surface">
                      <Icon className="w-4 h-4 text-on-surface-variant" />
                      <span className="font-semibold">{meta.label}</span>
                    </div>
                    <span className="font-mono font-bold text-on-surface">
                      {dev.count.toLocaleString("ar-SA")} ({dev.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-500"
                      style={{ width: `${dev.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AppCard>

      {/* Country Breakdown */}
      <AppCard className="space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span>التوزيع الجغرافي للنقرات</span>
        </h3>
        {countryBreakdown.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">لا توجد بيانات جغرافية مسجلة.</p>
        ) : (
          <div className="space-y-3">
            {countryBreakdown.map((c) => (
              <div key={c.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-on-surface uppercase">
                    {c.country === "UNKNOWN" ? "دولة غير محددة" : c.country}
                  </span>
                  <span className="font-mono font-bold text-on-surface">
                    {c.count.toLocaleString("ar-SA")} ({c.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AppCard>
    </div>
  );
}
