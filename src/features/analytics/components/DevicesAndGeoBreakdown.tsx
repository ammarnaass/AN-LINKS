"use client";

import React from "react";
import { CountryItem } from "../types/analytics.types";

interface DevicesAndGeoBreakdownProps {
  countries: CountryItem[];
}

export function DevicesAndGeoBreakdown({ countries }: DevicesAndGeoBreakdownProps) {
  return (
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
  );
}
