"use client";

import { useState, useEffect } from "react";

export interface DashboardPlanQuotas {
  linksUsed: number;
  linksMax: number;
  customDomain: boolean;
  removeBranding: boolean;
}

export interface DashboardPlanData {
  planName: string;
  planSlug: string;
  isSubscribed: boolean;
  billingCycle: string;
  badgeAr?: string | null;
  currentPeriodEnd: string | null;
  amountPaid: number;
  currency: string;
  quotas: DashboardPlanQuotas;
}

const STORAGE_KEY = "an_dashboard_plan_cache";
let memoryPlan: DashboardPlanData | null = null;

const DEFAULT_PLAN: DashboardPlanData = {
  planName: "الباقة المجانية",
  planSlug: "free",
  isSubscribed: false,
  billingCycle: "MONTHLY",
  badgeAr: null,
  currentPeriodEnd: null,
  amountPaid: 0,
  currency: "SAR",
  quotas: {
    linksUsed: 0,
    linksMax: 5,
    customDomain: false,
    removeBranding: false,
  },
};

export function getCachedDashboardPlan(): DashboardPlanData {
  if (memoryPlan) return memoryPlan;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryPlan = JSON.parse(raw);
        return memoryPlan as DashboardPlanData;
      }
    } catch {
      // ignore storage access errors
    }
  }
  return DEFAULT_PLAN;
}

export function setCachedDashboardPlan(data: DashboardPlanData): void {
  memoryPlan = data;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage access errors
    }
  }
}

export function useDashboardPlan() {
  const [planData, setPlanData] = useState<DashboardPlanData>(getCachedDashboardPlan);
  const [isLoading, setIsLoading] = useState(!memoryPlan);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/settings/subscription")
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.subscription) {
          const sub = res.data.subscription;
          const plan = sub.plan;
          const isSub = Boolean(sub.isSubscribed);
          const quotas = sub.quotas;

          const data: DashboardPlanData = {
            planName: plan?.nameAr || (isSub ? "باقة مدفوعة" : "الباقة المجانية"),
            planSlug: (plan?.slug || (isSub ? "pro" : "free")).toLowerCase(),
            isSubscribed: isSub,
            billingCycle: sub.billingCycle || "MONTHLY",
            badgeAr: plan?.badgeAr || null,
            currentPeriodEnd: sub.currentPeriodEnd || null,
            amountPaid: sub.amountPaid || 0,
            currency: sub.currency || "SAR",
            quotas: {
              linksUsed: quotas?.links?.used ?? 0,
              linksMax: quotas?.links?.max ?? 5,
              customDomain: Boolean(quotas?.customDomain),
              removeBranding: Boolean(quotas?.removeBranding),
            },
          };
          setCachedDashboardPlan(data);
          setPlanData(data);
        }
      })
      .catch(() => {
        // graceful fallback to default/cached state
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { planData, isLoading };
}
