"use client";

import React from "react";
import { QuotasDTO } from "../../hooks/useSettingsSubscription";

interface SubscriptionQuotasGridProps {
  quotas?: QuotasDTO;
}

export function SubscriptionQuotasGrid({ quotas }: SubscriptionQuotasGridProps) {
  const linksUsed = quotas?.links.used ?? 0;
  const linksMax = quotas?.links.max ?? 5;
  const linksPercent = Math.min(100, Math.round((linksUsed / Math.max(1, linksMax)) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="p-4 bg-surface-container rounded-xl space-y-2 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>الروابط النشطة</span>
          <span className="font-mono text-primary font-bold">
            {linksUsed} / {linksMax >= 999 ? "∞" : linksMax}
          </span>
        </div>
        <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${linksPercent}%` }} />
        </div>
        <span className="text-[10px] text-outline block">
          {linksPercent >= 100 ? "تم استهلاك الحد الأقصى" : `متبقي ${Math.max(0, linksMax - linksUsed)} روابط`}
        </span>
      </div>

      <div className="p-4 bg-surface-container rounded-xl space-y-2 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>النطاق المخصص (Domain)</span>
          <span className={`font-mono font-bold text-xs ${quotas?.customDomain ? "text-primary" : "text-on-surface-variant"}`}>
            {quotas?.customDomain ? "متاح ✓" : "غير مدعوم"}
          </span>
        </div>
        <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${quotas?.customDomain ? "bg-primary" : "bg-outline-variant"}`}
            style={{ width: quotas?.customDomain ? "100%" : "0%" }}
          />
        </div>
        <span className="text-[10px] text-outline block">
          {quotas?.customDomain ? "ربط نطاقك الشخصي المباشر" : "يتطلب ترقية إلى باقة Pro"}
        </span>
      </div>

      <div className="p-4 bg-surface-container rounded-xl space-y-2 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>إخفاء شعار المنصة</span>
          <span className={`font-mono font-bold text-xs ${quotas?.removeBranding ? "text-primary" : "text-on-surface-variant"}`}>
            {quotas?.removeBranding ? "متاح ✓" : "غير مدعوم"}
          </span>
        </div>
        <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${quotas?.removeBranding ? "bg-tertiary" : "bg-outline-variant"}`}
            style={{ width: quotas?.removeBranding ? "100%" : "0%" }}
          />
        </div>
        <span className="text-[10px] text-outline block">
          {quotas?.removeBranding ? "صفحة بيضاء خالية من حقوق المنصة" : "يتطلب ترقية لباقات المحترفين"}
        </span>
      </div>
    </div>
  );
}
