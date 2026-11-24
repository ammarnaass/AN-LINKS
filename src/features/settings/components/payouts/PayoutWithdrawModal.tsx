"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { PayoutProfileDTO, PayoutBalanceDTO } from "../../hooks/useSettingsPayouts";

interface PayoutWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PayoutProfileDTO | null;
  balance: PayoutBalanceDTO | null;
  onConfirm: (amount: number) => Promise<void>;
}

export function PayoutWithdrawModal({
  isOpen,
  onClose,
  profile,
  balance,
  onConfirm,
}: PayoutWithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const available = balance?.availableBalance ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < 50) {
      setError("الحد الأدنى لطلب السحب هو 50 ريال سعودي");
      return;
    }
    if (num > available) {
      setError("المبلغ المطلوب أكبر من الرصيد المتاح");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(num);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل إرسال طلب السحب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-md w-full p-6 space-y-5 border border-outline-variant/30 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <h3 className="text-base font-bold text-on-surface">طلب سحب الأرباح</h3>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="p-3 rounded-xl bg-error/10 text-error text-xs font-semibold">{error}</div>}

        <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-1.5 text-xs text-on-surface-variant">
          <div className="flex justify-between">
            <span>البنك المحول إليه:</span>
            <span className="font-bold text-on-surface">{profile?.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span>اسم المستفيد:</span>
            <span className="font-bold text-on-surface">{profile?.beneficiaryName}</span>
          </div>
          <div className="flex justify-between">
            <span>الآيبان:</span>
            <span className="font-mono text-primary text-[11px]" dir="ltr">
              {profile?.iban}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-medium text-on-surface-variant">مبلغ السحب (ر.س)</label>
              <span className="text-[11px] text-primary cursor-pointer hover:underline" onClick={() => setAmount(String(available))}>
                سحب كامل الرصيد ({available.toFixed(2)} ر.س)
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="50"
              max={available}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant/30 text-center font-mono text-xl font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !amount || Number(amount) < 50}
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition"
          >
            {isSubmitting ? "جاري الإرسال..." : "تأكيد وإرسال طلب التحويل"}
          </button>
        </form>
      </div>
    </div>
  );
}
