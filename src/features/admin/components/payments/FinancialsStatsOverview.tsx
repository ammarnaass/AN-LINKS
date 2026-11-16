import React from "react";
import { AppCard } from "@/shared/ui";
import { CreditCard, Package, Globe, Tag, Receipt } from "lucide-react";

export interface FinancialsStatsOverviewProps {
  activeGateways: number;
  totalGateways: number;
  activePlans: number;
  totalPlans: number;
  totalCurrencies: number;
  activeCoupons: number;
  totalCoupons: number;
  totalRevenue: number;
  totalInvoices: number;
}

export function FinancialsStatsOverview({
  activeGateways,
  totalGateways,
  activePlans,
  totalPlans,
  totalCurrencies,
  activeCoupons,
  totalCoupons,
  totalRevenue,
  totalInvoices,
}: FinancialsStatsOverviewProps) {
  const cards = [
    { title: "بوابات الدفع", value: `${activeGateways} / ${totalGateways}`, sub: `${activeGateways} بوابات نشطة`, subColor: "text-emerald-400", icon: <CreditCard className="w-4 h-4" />, iconColor: "text-primary" },
    { title: "باقات الاشتراك", value: activePlans, sub: `${totalPlans} إجمالي الباقات`, icon: <Package className="w-4 h-4" />, iconColor: "text-amber-400" },
    { title: "العملات المدعومة", value: totalCurrencies, sub: "SAR العملة الأساسية", icon: <Globe className="w-4 h-4" />, iconColor: "text-sky-400" },
    { title: "كوبونات الخصم", value: activeCoupons, sub: `${totalCoupons} إجمالي الكوبونات`, icon: <Tag className="w-4 h-4" />, iconColor: "text-purple-400" },
    { title: "إجمالي التحصيل", value: `${totalRevenue.toLocaleString("ar-SA")} ر.س`, sub: `${totalInvoices} عملية مسجلة`, icon: <Receipt className="w-4 h-4" />, iconColor: "text-emerald-400", colSpan: "col-span-2 sm:col-span-1" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5" data-testid="financial-overview-stats">
      {cards.map((c) => (
        <AppCard key={c.title} className={`p-4 bg-surface-container-low border-outline-variant/30 flex items-center justify-between ${c.colSpan || ""}`}>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant mb-1">{c.title}</span>
            <span className="text-xl font-bold text-on-surface font-mono">{c.value}</span>
            <span className={`text-[10px] mt-0.5 ${c.subColor || "text-on-surface-variant"}`}>{c.sub}</span>
          </div>
          <div className={`w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 ${c.iconColor}`}>
            {c.icon}
          </div>
        </AppCard>
      ))}
    </div>
  );
}
