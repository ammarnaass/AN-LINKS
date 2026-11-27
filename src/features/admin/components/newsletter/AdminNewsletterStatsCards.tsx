"use client";

import React from "react";
import { Users, CheckCircle2, Send, TrendingUp } from "lucide-react";
import { AppCard } from "@/shared/ui";

export interface AdminNewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalBroadcasts: number;
  deliveryRate: number;
}

export function AdminNewsletterStatsCards({ stats }: { stats: AdminNewsletterStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AppCard className="p-5 border-primary/40 bg-surface-container-low">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant">إجمالي المشتركين</span>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-on-surface">{stats.totalSubscribers}</div>
        <p className="mt-2 text-[11px] text-on-surface-variant">عبر كافة صفحات المبدعين</p>
      </AppCard>

      <AppCard className="p-5 border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant">المشتركون النشطون</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-emerald-400">{stats.activeSubscribers}</div>
        <p className="mt-2 text-[11px] text-on-surface-variant">حسابات مؤكدة وجاهزة للاستلام</p>
      </AppCard>

      <AppCard className="p-5 border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant">حملات المنصة المرسلة</span>
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-on-surface">{stats.totalBroadcasts}</div>
        <p className="mt-2 text-[11px] text-on-surface-variant">رسائل ترويجية ونشرات دورية</p>
      </AppCard>

      <AppCard className="p-5 border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-surface-variant">نسبة تسليم الرسائل</span>
          <div className="w-8 h-8 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-on-surface">{stats.deliveryRate}%</div>
        <p className="mt-2 text-[11px] text-primary font-semibold">جاهزية تشغيلية كاملة</p>
      </AppCard>
    </div>
  );
}
