import React from "react";
import { AdminSubscriptionPlanItem } from "../../../../types/admin.types";
import { AppCard, AppBadge } from "@/shared/ui";
import { Sparkles, Link as LinkIcon, Check, X as XIcon, Percent, Edit2, Trash2 } from "lucide-react";

export interface PlanPricingCardProps {
  plan: AdminSubscriptionPlanItem;
  cycle: "MONTHLY" | "YEARLY";
  isDeleting: boolean;
  onEdit: (plan: AdminSubscriptionPlanItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function PlanPricingCard({ plan, cycle, isDeleting, onEdit, onDelete }: PlanPricingCardProps) {
  const sarPrice = plan.prices?.find((p) => p.currency === "SAR" && p.billingCycle === cycle)?.amount ?? 0;
  const usdPrice = plan.prices?.find((p) => p.currency === "USD" && p.billingCycle === cycle)?.amount ?? 0;
  const quotas = plan.quotas || {
    maxLinks: 5, allowCustomDomain: false, allowRemoveBranding: false,
    allowAdvancedThemes: false, allowDetailedAnalytics: false,
    allowPrioritySupport: false, customCssAllowed: false, storeCommissionRate: 10,
  };

  return (
    <AppCard className={`p-5 bg-surface-container-low border flex flex-col justify-between hover:shadow-md transition-all ${plan.badgeAr ? "border-primary/40 shadow-xs" : "border-outline-variant/30"}`}>
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="font-bold text-base text-on-surface">{plan.nameAr}</h4>
            <div className="flex flex-col items-end gap-1">
              {plan.badgeAr && (
                <AppBadge variant="primary" size="sm"><Sparkles className="w-3 h-3 ml-1 inline" />{plan.badgeAr}</AppBadge>
              )}
              <AppBadge variant={plan.isActive ? "success" : "neutral"} size="sm">{plan.isActive ? "نشطة" : "معطلة"}</AppBadge>
            </div>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">{plan.nameEn} ({plan.slug})</span>
          {plan.descriptionAr && <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{plan.descriptionAr}</p>}
        </div>

        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
          <div className="flex items-baseline gap-1 text-on-surface">
            <span className="text-2xl font-extrabold font-mono">{sarPrice}</span>
            <span className="text-xs font-bold">ر.س</span>
            <span className="text-[11px] text-on-surface-variant">/ {cycle === "MONTHLY" ? "شهرياً" : "سنوياً"}</span>
          </div>
          <div className="text-[11px] font-mono text-on-surface-variant">يعادل تقريباً ${usdPrice} USD</div>
        </div>

        <div className="space-y-2 pt-1 text-xs">
          <div className="flex items-center gap-2 text-on-surface">
            <LinkIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>{quotas.maxLinks <= 0 || quotas.maxLinks >= 9999 ? "روابط غير محدودة" : `حتى ${quotas.maxLinks} روابط نشطة`}</span>
          </div>
          <div className="flex items-center gap-2">
            {quotas.allowCustomDomain ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <XIcon className="w-3.5 h-3.5 text-outline flex-shrink-0" />}
            <span className={quotas.allowCustomDomain ? "text-on-surface font-medium" : "text-on-surface-variant line-through opacity-70"}>ربط نطاق خاص (Domain)</span>
          </div>
          <div className="flex items-center gap-2">
            {quotas.allowRemoveBranding ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <XIcon className="w-3.5 h-3.5 text-outline flex-shrink-0" />}
            <span className={quotas.allowRemoveBranding ? "text-on-surface font-medium" : "text-on-surface-variant line-through opacity-70"}>إزالة شعار AN LINKS</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface">
            <Percent className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>عمولة متجر: {quotas.storeCommissionRate}%</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
        <button type="button" onClick={() => onEdit(plan)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer">
          <Edit2 className="w-3.5 h-3.5" /><span>تعديل الباقة</span>
        </button>
        <button type="button" disabled={isDeleting} onClick={() => onDelete(plan.id, plan.nameAr)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50" aria-label="أرشفة أو حذف الباقة">
          <Trash2 className="w-3.5 h-3.5" /><span>{isDeleting ? "..." : "أرشفة/حذف"}</span>
        </button>
      </div>
    </AppCard>
  );
}
