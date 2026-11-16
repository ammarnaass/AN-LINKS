import React from "react";
import { FinancialSubTab } from "../../hooks/useAdminFinancials";
import { CreditCard, Package, Sliders, Globe, Tag, Receipt } from "lucide-react";

export interface FinancialsSubTabNavProps {
  activeSubTab: FinancialSubTab;
  setActiveSubTab: (tab: FinancialSubTab) => void;
  activeGateways: number;
  totalGateways: number;
  totalPlans: number;
  totalCurrencies: number;
  activeCoupons: number;
  totalInvoices: number;
}

export function FinancialsSubTabNav({
  activeSubTab,
  setActiveSubTab,
  activeGateways,
  totalGateways,
  totalPlans,
  totalCurrencies,
  activeCoupons,
  totalInvoices,
}: FinancialsSubTabNavProps) {
  const tabs = [
    { key: "gateways" as const, label: "بوابات الدفع", icon: <CreditCard className="w-4 h-4 shrink-0" />, badge: `${activeGateways}/${totalGateways}` },
    { key: "plans" as const, label: "باقات الاشتراك", icon: <Package className="w-4 h-4 shrink-0" />, badge: totalPlans > 0 ? totalPlans : undefined },
    { key: "quotas" as const, label: "المحددات والمميزات", icon: <Sliders className="w-4 h-4 shrink-0" /> },
    { key: "currencies" as const, label: "العملات وأسعار الصرف", icon: <Globe className="w-4 h-4 shrink-0" />, badge: totalCurrencies > 0 ? totalCurrencies : undefined },
    { key: "coupons" as const, label: "كوبونات الخصم", icon: <Tag className="w-4 h-4 shrink-0" />, badge: activeCoupons > 0 ? activeCoupons : undefined },
    { key: "transactions" as const, label: "المعاملات والفواتير", icon: <Receipt className="w-4 h-4 shrink-0" />, badge: totalInvoices > 0 ? totalInvoices : undefined },
  ];

  return (
    <div role="tablist" aria-label="تبويبات الإدارة المالية" className="w-full flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeSubTab === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive ? "bg-primary-container text-on-primary-container shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${isActive ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
