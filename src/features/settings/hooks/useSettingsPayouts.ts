"use client";

import { useState, useEffect } from "react";

export interface PayoutProfileDTO {
  id?: string;
  bankName: string;
  bankCode: string;
  iban: string;
  beneficiaryName: string;
  isVerified: boolean;
}

export interface PayoutBalanceDTO {
  totalEarnings: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  availableBalance: number;
  currency: string;
  minWithdrawal: number;
}

export interface PayoutRequestDTO {
  id: string;
  amount: number;
  currency: string;
  status: string;
  requestedAt: string;
  processedAt?: string | null;
}

export function useSettingsPayouts() {
  const [profile, setProfile] = useState<PayoutProfileDTO | null>(null);
  const [balance, setBalance] = useState<PayoutBalanceDTO | null>(null);
  const [history, setHistory] = useState<PayoutRequestDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    fetch("/api/settings/payouts")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data.profile);
          setBalance(res.data.balance);
          setHistory(res.data.history || []);
        }
      })
      .catch((err) => setStatusMessage({ type: "error", text: err.message }))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveIban = async (iban: string, beneficiaryName: string) => {
    setStatusMessage(null);
    const res = await fetch("/api/settings/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-iban", iban, beneficiaryName }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || "فشل حفظ بيانات الحساب البنكي");
    }
    setProfile(data.data);
    setStatusMessage({ type: "success", text: "تم تحديث وتوثيق الآيبان البنكي بنجاح" });
  };

  const withdraw = async (amount: number) => {
    setStatusMessage(null);
    const res = await fetch("/api/settings/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "withdraw", amount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || "فشل إرسال طلب السحب");
    }
    setIsWithdrawModalOpen(false);
    setStatusMessage({ type: "success", text: "تم إرسال طلب السحب بنجاح وهو قيد التحويل" });
    loadData();
  };

  return {
    profile,
    balance,
    history,
    isLoading,
    statusMessage,
    saveIban,
    withdraw,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
  };
}
