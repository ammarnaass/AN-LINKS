"use client";

import { useState, useEffect } from "react";

export interface PlanDTO {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  badgeAr?: string | null;
}

export interface QuotasDTO {
  links: { used: number; max: number };
  socials: { used: number; max: number };
  customDomain: boolean;
  advancedThemes: boolean;
  removeBranding: boolean;
  detailedAnalytics: boolean;
}

export interface SubscriptionDTO {
  isSubscribed: boolean;
  plan: PlanDTO;
  status: string;
  billingCycle: string;
  currency: string;
  amountPaid: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  quotas: QuotasDTO;
}

export interface InvoiceDTO {
  id: string;
  invoiceNumber: string;
  amountTotal: number;
  amountSubtotal: number;
  taxAmount: number;
  discountAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  gatewayCode: string;
}

export function useSettingsSubscription() {
  const [sub, setSub] = useState<SubscriptionDTO | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDTO | null>(null);

  const loadData = () => {
    setIsLoading(true);
    fetch("/api/settings/subscription")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setSub(res.data.subscription);
          setInvoices(res.data.invoices || []);
        }
      })
      .catch((err) => setStatusMessage({ type: "error", text: err.message }))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const cancelSubscription = async () => {
    if (!confirm("هل أنت متأكد من إلغاء التجديد التلقائي؟ ستستمر ميزات باقتك حتى نهاية الفترة.")) {
      return;
    }
    const res = await fetch("/api/settings/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || "فشل إلغاء الاشتراك");
    }
    setStatusMessage({ type: "success", text: "تم إلغاء التجديد التلقائي بنجاح" });
    loadData();
  };

  return {
    sub,
    invoices,
    isLoading,
    statusMessage,
    cancelSubscription,
    selectedInvoice,
    setSelectedInvoice,
  };
}
