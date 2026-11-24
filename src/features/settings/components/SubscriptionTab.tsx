"use client";

import React from "react";
import { useSettingsSubscription } from "../hooks/useSettingsSubscription";
import { SubscriptionActivePlanCard } from "./subscription/SubscriptionActivePlanCard";
import { SubscriptionQuotasGrid } from "./subscription/SubscriptionQuotasGrid";
import { SubscriptionInvoicesTable } from "./subscription/SubscriptionInvoicesTable";
import { InvoicePrintModal } from "./subscription/InvoicePrintModal";

export function SubscriptionTab() {
  const {
    sub,
    invoices,
    isLoading,
    statusMessage,
    cancelSubscription,
    selectedInvoice,
    setSelectedInvoice,
  } = useSettingsSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant text-sm">
        جاري تحميل تفاصيل الاشتراك والحصص...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-error/10 text-error border border-error/20"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <SubscriptionActivePlanCard sub={sub} onCancel={cancelSubscription} />

      <SubscriptionQuotasGrid quotas={sub?.quotas} />

      <SubscriptionInvoicesTable
        invoices={invoices}
        onSelectInvoice={(inv) => setSelectedInvoice(inv)}
      />

      <InvoicePrintModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </section>
  );
}
