"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Crown, Zap } from "lucide-react";
import { useDashboardPlan } from "../hooks/useDashboardPlan";

export function DashboardPlanBadge() {
  const { planData } = useDashboardPlan();

  const isVip = planData.planSlug === "vip";
  const isPro = planData.planSlug === "pro" || (planData.isSubscribed && !isVip);

  const containerClasses = isVip
    ? "border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/15 hover:border-amber-500/60"
    : isPro
      ? "border-primary/30 bg-primary/10 hover:bg-primary/15 hover:border-primary/50"
      : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container hover:border-primary/40";

  return (
    <Link
      href="/dashboard/settings?tab=subscription"
      title={`الاشتراك الشهري والخطة: ${planData.planName} — اضغط لإدارة الخطة والاشتراكات`}
      aria-label="الخطة الحالية والاشتراكات الشهرية"
      className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full sm:rounded-2xl border text-xs font-bold transition-all duration-200 select-none cursor-pointer shadow-xs hover:shadow-sm ${containerClasses}`}
      style={{ textDecoration: "none" }}
    >
      {isVip ? (
        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
          </div>
          <span className="hidden sm:inline font-black text-on-surface text-xs">
            {planData.planName}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/25 text-amber-700 dark:text-amber-300 font-extrabold tracking-wide">
            VIP
          </span>
        </span>
      ) : isPro ? (
        <span className="flex items-center gap-1.5 text-primary">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
          </div>
          <span className="hidden sm:inline font-bold text-on-surface text-xs">
            {planData.planName}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/25 text-primary font-bold">
            PRO
          </span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-on-surface-variant group-hover:text-on-surface">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="hidden md:inline font-medium text-xs text-on-surface">
            {planData.planName}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold group-hover:bg-primary group-hover:text-on-primary transition-all shadow-xs">
            ترقية
          </span>
        </span>
      )}
    </Link>
  );
}
