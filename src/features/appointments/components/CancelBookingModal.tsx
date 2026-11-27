"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface CancelBookingModalProps {
  clientName: string;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function CancelBookingModal({
  clientName,
  onCancel,
  onConfirm,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onConfirm(reason);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-container rounded-3xl p-6 border border-outline-variant/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5 text-error">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-bold text-on-surface">إلغاء موعد العميل</h3>
        </div>
        <p className="text-xs text-on-surface-variant">
          سيتم إلغاء الحجز الخاص بالعميل <strong>{clientName}</strong> وإرسال إشعار بريدي فوري بالسبب مع تحرير الوقت في جدولك.
        </p>
        <form onSubmit={handleConfirm} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-on-surface mb-1">سبب الإلغاء (يُرسل للعميل)</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: تعارض طارئ في الجدول، يرجى اختيار وقت آخر..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-high"
            >
              تراجع
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl font-bold bg-error text-white hover:bg-error/90"
            >
              {submitting ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
