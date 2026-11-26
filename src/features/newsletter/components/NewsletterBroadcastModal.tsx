"use client";

import React, { useState } from "react";
import { Send, X, AlertCircle, Loader2, MailCheck } from "lucide-react";
import { BroadcastPayload } from "../types/newsletter.types";
import { AppButton } from "@/shared/ui";

interface NewsletterBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: BroadcastPayload) => Promise<boolean>;
  isSending: boolean;
  activeSubscribersCount: number;
}

export function NewsletterBroadcastModal({
  isOpen,
  onClose,
  onSend,
  isSending,
  activeSubscribersCount,
}: NewsletterBroadcastModalProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (testOnly = false) => {
    if (!subject.trim()) {
      setError("الرجاء كتابة عنوان للحملة البريدية");
      return;
    }
    if (!content.trim()) {
      setError("الرجاء كتابة محتوى الرسالة");
      return;
    }
    setError("");

    const success = await onSend({ subject, content, testOnly });
    if (success && !testOnly) {
      setSubject("");
      setContent("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-surface-container-low border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                إرسال حملة بريدية للمشتركين
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                سيتم إرسال الرسالة إلى {activeSubscribersCount} مشترك نشط
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error/20 text-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              عنوان الرسالة (الموضوع)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: خصم حصري لمتابعي النشرة البريدية 🔥"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              نص الرسالة
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب رسالتك هنا... كل سطر جديد سيتحول تلقائياً إلى فقرة منسقة في البريد."
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 bg-surface-container-lowest/60 border-t border-outline-variant/20">
          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(true)}
            disabled={isSending}
            leftIcon={<MailCheck className="w-4 h-4 text-amber-400" />}
          >
            إرسال تجربة إلى بريدي
          </AppButton>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSending}
            >
              إلغاء
            </AppButton>
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleSubmit(false)}
              disabled={isSending || activeSubscribersCount === 0}
              leftIcon={
                isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )
              }
            >
              {isSending ? "جاري الإرسال..." : "إرسال الحملة الآن"}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
