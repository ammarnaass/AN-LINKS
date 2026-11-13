"use client";

import React, { useState } from "react";
import { Flag, X, AlertTriangle, CheckCircle } from "lucide-react";

interface ReportModalProps {
  username: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ReportModal({ username, isOpen: controlledIsOpen, onClose }: ReportModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [reason, setReason] = useState("phishing");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          reason,
          details,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: data.message });
        setTimeout(() => {
          handleClose();
          setStatusMessage(null);
          setDetails("");
        }, 2000);
      } else {
        setStatusMessage({ type: "error", text: data.error || "فشل إرسال البلاغ" });
      }
    } catch {
      setStatusMessage({ type: "error", text: "حدث خطأ في الاتصال، يرجى المحاولة لاحقاً" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition text-gray-500 hover:text-red-500"
          title="الإبلاغ عن هذه الصفحة"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>إبلاغ عن محتوى مخالف</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-surface-container-low rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-on-surface text-base">إبلاغ عن صفحة مخالفة</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.type === "success"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-error-container/20 text-error border border-error/30"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  سبب البلاغ
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="phishing">احتيال أو تصيد إلكتروني (Phishing)</option>
                  <option value="hate_speech">خطاب كراهية أو تحريض</option>
                  <option value="spam">محتوى مزعج أو غير مرغوب فيه (Spam)</option>
                  <option value="illegal">محتوى غير قانوني أو ينتهك الحقوق</option>
                  <option value="other">سبب آخر</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  تفاصيل إضافية (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="اشرح المشكلة باختصار لمساعدتنا في مراجعة البلاغ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-error hover:bg-red-700 text-white shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال البلاغ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

