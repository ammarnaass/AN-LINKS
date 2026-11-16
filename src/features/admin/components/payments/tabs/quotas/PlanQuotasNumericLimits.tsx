import React from "react";
import { AdminPlanQuotaConfig } from "../../../../types/admin.types";
import { Link as LinkIcon, Percent } from "lucide-react";

export interface PlanQuotasNumericLimitsProps {
  quotas: AdminPlanQuotaConfig;
  onChange: (updates: Partial<AdminPlanQuotaConfig>) => void;
}

export function PlanQuotasNumericLimits({
  quotas,
  onChange,
}: PlanQuotasNumericLimitsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
        <label className="text-xs font-bold text-on-surface flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-primary" />
          <span>أقصى عدد للروابط النشطة (Max Links)</span>
        </label>
        <input
          type="number"
          value={quotas.maxLinks}
          onChange={(e) => onChange({ maxLinks: Number(e.target.value) })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="block text-[11px] text-on-surface-variant">
          أدخل 9999 أو 0 لإتاحة عدد غير محدود من الروابط
        </span>
      </div>

      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
        <label className="text-xs font-bold text-on-surface flex items-center gap-2">
          <Percent className="w-4 h-4 text-amber-400" />
          <span>نسبة عمولة المنصة على المبيعات (%)</span>
        </label>
        <input
          type="number"
          step="0.1"
          value={quotas.storeCommissionRate}
          onChange={(e) => onChange({ storeCommissionRate: Number(e.target.value) })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="block text-[11px] text-on-surface-variant">
          النسبة المقتطعة تلقائياً عند بيع المنتجات الرقمية عبر صفحة المستخدم
        </span>
      </div>
    </div>
  );
}
