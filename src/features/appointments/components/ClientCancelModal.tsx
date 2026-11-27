"use client";

import React, { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";

interface ClientCancelModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function ClientCancelModal({ onClose, onConfirm }: ClientCancelModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onConfirm(reason.trim() || "إلغاء بطلب العميل عبر بوابة إدارة الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-surface-container border border-outline-variant/40 p-5 space-y-4 shadow-2xl text-right"
        dir="rtl"
      >
        <div className="flex items-center gap-2 text-error">
          <XCircle className="w-5 h-5" />
          <h3 className="text-sm font-black">تأكيد إلغاء الموعد</h3>
        </div>
        <p className="text-xs text-on-surface-variant">
          هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ سيتم إشعار مقدم الاستشارة وتحرير الفترة الزمنية.
        </p>
        <textarea
          rows={3}
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="سبب الإلغاء (اختياري)..."
          className="w-full px-3 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary resize-none"
        />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-high text-on-surface hover:bg-surface-container cursor-pointer"
          >
            تراجع
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-error text-white hover:opacity-90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>تأكيد الإلغاء</span>
          </button>
        </div>
      </form>
    </div>
  );
}
