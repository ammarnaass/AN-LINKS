"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Crown, Zap, ArrowUpRight, Calendar, CheckCircle2, Sliders } from "lucide-react";
import { DashboardPlanData } from "../hooks/useDashboardPlan";

export interface DashboardPlanPopoverProps {
  planData: DashboardPlanData;
  onClose: () => void;
}

export function DashboardPlanPopover({ planData, onClose }: DashboardPlanPopoverProps) {
  const isVip = planData.planSlug === "vip";
  const isPro = planData.planSlug === "pro" || (planData.isSubscribed && !isVip);

  const usagePercent = Math.min(
    100,
    Math.round((planData.quotas.linksUsed / Math.max(1, planData.quotas.linksMax)) * 100)
  );

  const formattedPeriodEnd = planData.currentPeriodEnd
    ? new Date(planData.currentPeriodEnd).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      role="dialog"
      aria-label="تفاصيل الخطة والاشتراك الشهري"
      className="absolute left-0 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto mt-2 w-80 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/40 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 font-cairo text-right"
      dir="rtl"
    >
      {/* Plan Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isVip
                ? "bg-amber-500/15 border-amber-500/35 text-amber-500"
                : isPro
                  ? "bg-primary/15 border-primary/35 text-primary"
                  : "bg-surface-container-high border-outline-variant/30 text-primary"
            }`}
          >
            {isVip ? <Crown className="w-5 h-5" /> : isPro ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-black text-sm text-on-surface">{planData.planName}</h4>
            <span className="text-[11px] text-on-surface-variant">
              {planData.isSubscribed ? "اشتراك نشط" : "خطة الحساب الحالية"}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isVip
              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
              : isPro
                ? "bg-primary/20 text-primary"
                : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
          }`}
        >
          {planData.isSubscribed ? "شهري" : "مجانية"}
        </span>
      </div>

      {/* Subscription Details & Renewal */}
      <div className="py-3 space-y-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>دورة الفوترة والتجديد:</span>
            </span>
            <span className="font-bold text-on-surface">
              {planData.billingCycle === "ANNUAL" ? "سنوي" : "شهري"}
            </span>
          </div>

          {formattedPeriodEnd ? (
            <p className="text-[11px] text-on-surface-variant flex items-center justify-between">
              <span>تاريخ التجديد القادم:</span>
              <span className="font-bold text-primary">{formattedPeriodEnd}</span>
            </p>
          ) : (
            <p className="text-[11px] text-on-surface-variant">
              أنت حالياً على الباقة المجانية. رقِّ حسابك للاستفادة من مميزات الـ VIP.
            </p>
          )}
        </div>

        {/* Links Quota Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant flex items-center gap-1">
              <Sliders className="w-3 h-3 text-secondary" />
              <span>استهلاك الروابط:</span>
            </span>
            <span className="font-bold text-on-surface font-mono">
              {planData.quotas.linksUsed} / {planData.quotas.linksMax}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                usagePercent >= 90 ? "bg-error" : "bg-primary"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
        <Link
          href="/dashboard/settings?tab=subscription"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:brightness-110 transition-all shadow-sm"
        >
          <span>إدارة الاشتراكات الشهرية والفواتير</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
