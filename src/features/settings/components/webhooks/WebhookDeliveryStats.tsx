"use client";

import React from "react";
import { Activity, CheckCircle2, AlertTriangle } from "lucide-react";

export interface WebhookDeliveryStatsProps {
  totalDispatched: number;
  deliveredCount: number;
  failedCount: number;
  successRate: number;
}

export function WebhookDeliveryStats({
  totalDispatched,
  deliveredCount,
  failedCount,
  successRate,
}: WebhookDeliveryStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
      <div className="space-y-1">
        <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span>إجمالي الأحداث</span>
        </span>
        <p className="text-base font-bold text-on-surface font-mono">{totalDispatched}</p>
      </div>

      <div className="space-y-1">
        <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>نسبة النجاح</span>
        </span>
        <p className="text-base font-bold text-emerald-400 font-mono">{successRate}%</p>
      </div>

      <div className="space-y-1">
        <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>فشل الاستجابة</span>
        </span>
        <p className="text-base font-bold text-on-surface font-mono">{failedCount}</p>
      </div>
    </div>
  );
}
