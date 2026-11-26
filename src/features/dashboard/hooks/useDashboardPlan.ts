"use client";

import { useState, useEffect } from "react";

export interface DashboardPlanData {
  planName: string;
  planSlug: string;
  isSubscribed: boolean;
  billingCycle: string;
  badgeAr?: string | null;
}

const STORAGE_KEY = "an_dashboard_plan_cache";
let memoryPlan: DashboardPlanData | null = null;

const DEFAULT_PLAN: DashboardPlanData = {
  planName: "الباقة المجانية",
  planSlug: "free",
  isSubscribed: false,
  billingCycle: "MONTHLY",
  badgeAr: null,
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
          const data: DashboardPlanData = {
            planName: plan?.nameAr || (isSub ? "باقة مدفوعة" : "الباقة المجانية"),
            planSlug: (plan?.slug || (isSub ? "pro" : "free")).toLowerCase(),
            isSubscribed: isSub,
            billingCycle: sub.billingCycle || "MONTHLY",
            badgeAr: plan?.badgeAr || null,
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
