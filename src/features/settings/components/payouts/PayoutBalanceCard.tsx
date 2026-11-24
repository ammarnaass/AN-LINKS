"use client";

import React from "react";
import { PayoutBalanceDTO } from "../../hooks/useSettingsPayouts";

interface PayoutBalanceCardProps {
  balance: PayoutBalanceDTO | null;
  onOpenWithdraw: () => void;
  hasVerifiedIban: boolean;
}

export function PayoutBalanceCard({
  balance,
  onOpenWithdraw,
  hasVerifiedIban,
}: PayoutBalanceCardProps) {
  const available = balance?.availableBalance ?? 0;
  const pending = balance?.pendingWithdrawal ?? 0;

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            تحصيل مبيعات روابط
          </span>
          {pending > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-bold">
              معلق: {pending.toFixed(2)} ر.س
            </span>
          )}
        </div>

        <span className="text-xs text-on-surface-variant block">الرصيد المتاح للسحب الفوري</span>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-4xl font-extrabold text-primary font-mono">
            {available.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-lg text-on-surface font-semibold">ر.س</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onOpenWithdraw}
          disabled={available < 50 || !hasVerifiedIban}
          className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:opacity-90 disabled:opacity-40 transition"
        >
          {!hasVerifiedIban
            ? "يرجى ربط الآيبان البنكي أولاً"
            : available < 50
            ? "الحد الأدنى للسحب 50 ر.س"
            : "طلب سحب الأرباح الآن"}
        </button>
        <p className="text-[10px] text-center text-on-surface-variant">
          التحويل يتم تلقائياً لحسابك المصرفي خلال 24 ساعة عمل
        </p>
      </div>
    </div>
  );
}
