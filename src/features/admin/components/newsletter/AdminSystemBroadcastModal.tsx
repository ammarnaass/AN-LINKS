"use client";

import React, { useState } from "react";
import { Send, X, Users, Loader2 } from "lucide-react";
import { AppButton } from "@/shared/ui";

export function AdminSystemBroadcastModal({
  isOpen,
  onClose,
  onSend,
  isSending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { subject: string; content: string; targetAudience: string }) => Promise<void>;
  isSending: boolean;
}) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL_SUBSCRIBERS");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    await onSend({ subject, content, targetAudience });
    setSubject("");
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-surface-container-high border border-outline-variant/40 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2 text-on-surface font-bold text-sm">
            <Send className="w-4 h-4 text-primary" />
            <span>إرسال حملة بريدية من إدارة المنصة</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant">الجمهور المستهدف:</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface outline-none"
            >
              <option value="ALL_SUBSCRIBERS">كافة مشتركي النشرات البريدية في المنصة</option>
              <option value="ALL_USERS">كافة المستخدمين المسجلين في المنصة</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant">عنوان الرسالة (Subject):</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: تحديث أمني هام أو نشرة AN LINKS الشهرية..."
              className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface-variant">محتوى الحملة البريدية:</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب تفاصيل الرسالة هنا..."
              className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <AppButton type="button" variant="outline" size="sm" onClick={onClose} disabled={isSending}>
              إلغاء
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSending || !subject.trim() || !content.trim()}
              leftIcon={isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            >
              {isSending ? "جاري الإرسال..." : "إرسال الحملة الآن"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
