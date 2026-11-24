"use client";

import React from "react";
import { useSettingsPayouts } from "../hooks/useSettingsPayouts";
import { PayoutBalanceCard } from "./payouts/PayoutBalanceCard";
import { PayoutIbanForm } from "./payouts/PayoutIbanForm";
import { PayoutWithdrawModal } from "./payouts/PayoutWithdrawModal";
import { PayoutHistoryTable } from "./payouts/PayoutHistoryTable";

export function PayoutsTab() {
  const {
    profile,
    balance,
    history,
    isLoading,
    statusMessage,
    saveIban,
    withdraw,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
  } = useSettingsPayouts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant text-sm">
        جاري تحميل بيانات الأرباح والآيبان...
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 flex">
          <PayoutBalanceCard
            balance={balance}
            onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
            hasVerifiedIban={Boolean(profile?.isVerified)}
          />
        </div>
        <div className="lg:col-span-8 flex">
          <PayoutIbanForm profile={profile} onSave={saveIban} />
        </div>
      </div>

      <PayoutHistoryTable history={history} />

      <PayoutWithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        profile={profile}
        balance={balance}
        onConfirm={withdraw}
      />
    </section>
  );
}
