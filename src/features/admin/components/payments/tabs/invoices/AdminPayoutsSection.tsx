"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Banknote, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { AppCard } from "@/shared/ui";
import { AppBadge } from "@/shared/ui/AppBadge";

interface AdminPayoutRow {
  id: string;
  amount: number;
  currency: string;
  status: string;
  requestedAt: string;
  transferReference?: string | null;
  user?: {
    username: string;
    email: string;
    payoutProfile?: { bankName: string; iban: string; beneficiaryName: string } | null;
  } | null;
}

export function AdminPayoutsSection() {
  const [requests, setRequests] = useState<AdminPayoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payouts");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setRequests(json.requests || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (payoutId: string, action: "TRANSFERRED" | "REJECT") => {
    try {
      setBusyId(payoutId);
      const res = await fetch("/api/admin/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutId,
          action,
          transferReference: action === "TRANSFERRED" ? `SARIE-${Date.now().toString().slice(-6)}` : undefined,
        }),
      });
      if (res.ok) await loadRequests();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppCard className="p-5 bg-surface-container-low border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Banknote className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-black text-on-surface">تسوية وطلبات صرف أرباح المبدعين (Payouts)</h3>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer"
          title="تحديث طلبات الصرف"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
      ) : requests.length === 0 ? (
        <p className="text-xs text-on-surface-variant text-center py-4">لا توجد طلبات صرف معلقة أو مسجلة حالياً.</p>
      ) : (
        <div className="space-y-2.5">
          {requests.map((r) => {
            const canAct = r.status === "PENDING" || r.status === "APPROVED";
            const badge = r.status === "TRANSFERRED" ? "success" : r.status === "REJECTED" ? "error" : "warning";
            return (
              <div key={r.id} className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-on-surface">@{r.user?.username || "creator"}</span>
                    <span className="font-mono font-black text-primary">{r.amount} {r.currency}</span>
                    <AppBadge variant={badge} className="text-[10px]">{r.status}</AppBadge>
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {r.user?.payoutProfile ? `${r.user.payoutProfile.bankName} — ${r.user.payoutProfile.iban} (${r.user.payoutProfile.beneficiaryName})` : "بدون ملف بنكي"}
                  </div>
                </div>
                {canAct && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => handleAction(r.id, "TRANSFERRED")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> اعتماد التحويل
                    </button>
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => handleAction(r.id, "REJECT")}
                      className="px-3 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> رفض
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppCard>
  );
}
