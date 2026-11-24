"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubscriptionDTO } from "../../hooks/useSettingsSubscription";

interface SubscriptionActivePlanCardProps {
  sub: SubscriptionDTO | null;
  onCancel: () => Promise<void>;
}

export function SubscriptionActivePlanCard({
  sub,
  onCancel,
}: SubscriptionActivePlanCardProps) {
  const isSubscribed = sub?.isSubscribed ?? false;
  const plan = sub?.plan;

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                isSubscribed ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {isSubscribed ? "الخطة النشطة" : "الباقة الافتراضية"}
            </span>
            {plan?.badgeAr && (
              <span className="text-tertiary text-xs font-mono">{plan.badgeAr}</span>
            )}
          </div>

          <h2 className="text-xl font-bold text-on-surface">{plan?.nameAr || "الباقة المجانية"}</h2>

          <p className="text-xs text-on-surface-variant">
            {isSubscribed && sub?.currentPeriodEnd ? (
              <>
                تجديد الحساب القادم في{" "}
                <strong className="text-on-surface font-mono">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("ar-SA")}
                </strong>{" "}
                مقابل <span className="font-mono text-primary font-bold">{sub.amountPaid.toFixed(2)} {sub.currency}</span>
              </>
            ) : (
              "حسابك يعمل حالياً على الباقة المجانية الأساسية بدون أي رسوم."
            )}
          </p>

          {sub?.cancelAtPeriodEnd && (
            <p className="text-xs text-secondary font-semibold pt-1">
              ⚠️ تم جدولة إلغاء التجديد التلقائي بنهاية الفترة الحالية.
            </p>
          )}
        </div>

        <Link
          href="/pricing"
          className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface text-xs font-bold border border-white/5 flex items-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <span>ترقية الباقة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isSubscribed && !sub?.cancelAtPeriodEnd && (
        <div className="pt-2 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-error hover:underline transition"
          >
            إلغاء التجديد التلقائي للاشتراك
          </button>
        </div>
      )}
    </div>
  );
}
