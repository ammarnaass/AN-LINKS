"use client";

import React from "react";
import { AdminPlanPriceItem } from "../../../../types/admin.types";

export interface PriceState {
  monthly: number;
  yearly: number;
}

export const SUPPORTED_PLAN_CURRENCIES = ["SAR", "USD", "AED", "EGP"] as const;

export const DEFAULT_PLAN_PRICES: Record<string, PriceState> = {
  SAR: { monthly: 0, yearly: 0 },
  USD: { monthly: 0, yearly: 0 },
  AED: { monthly: 0, yearly: 0 },
  EGP: { monthly: 0, yearly: 0 },
};

export function extractPlanPrices(prices?: AdminPlanPriceItem[]): Record<string, PriceState> {
  const initial: Record<string, PriceState> = { ...DEFAULT_PLAN_PRICES };
  prices?.forEach((p) => {
    const curr = p.currency.toUpperCase();
    if (!initial[curr]) initial[curr] = { monthly: 0, yearly: 0 };
    if (p.billingCycle === "MONTHLY") initial[curr].monthly = p.amount;
    else if (p.billingCycle === "YEARLY") initial[curr].yearly = p.amount;
  });
  return initial;
}

export function formatPricesState(pricesState: Record<string, PriceState>): AdminPlanPriceItem[] {
  return Object.entries(pricesState).flatMap(([currency, amounts]) => [
    { currency, billingCycle: "MONTHLY", amount: Number(amounts.monthly) || 0, isActive: true },
    { currency, billingCycle: "YEARLY", amount: Number(amounts.yearly) || 0, isActive: true },
  ]);
}

export interface PlanPricingMatrixProps {
  pricesState: Record<string, PriceState>;
  onPriceChange: (currency: string, cycle: "monthly" | "yearly", val: number) => void;
}

export function PlanPricingMatrix({ pricesState, onPriceChange }: PlanPricingMatrixProps) {
  return (
    <div className="pt-2 border-t border-outline-variant/20 space-y-3">
      <h4 className="text-xs font-bold text-on-surface">مصفوفة التسعير متعددة العملات:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUPPORTED_PLAN_CURRENCIES.map((curr) => (
          <div key={curr} className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
            <span className="font-mono font-bold text-xs text-primary">{curr}</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1">شهرياً</label>
                <input
                  type="number" step="0.01" value={pricesState[curr]?.monthly || 0}
                  onChange={(e) => onPriceChange(curr, "monthly", Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1">سنوياً</label>
                <input
                  type="number" step="0.01" value={pricesState[curr]?.yearly || 0}
                  onChange={(e) => onPriceChange(curr, "yearly", Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanPricingMatrix;
