"use client";

import React, { useState } from "react";
import { UserPlus, X, AlertCircle, Loader2 } from "lucide-react";
import { AppButton } from "@/shared/ui";

interface NewsletterAddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string, name?: string) => Promise<boolean>;
}

export function NewsletterAddSubscriberModal({
  isOpen,
  onClose,
  onAdd,
}: NewsletterAddSubscriberModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }
    setError("");
    setIsLoading(true);

    const success = await onAdd(email.trim(), name.trim() || undefined);
    setIsLoading(false);
    if (success) {
      setEmail("");
      setName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-surface-container-low border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">إضافة مشترك يدوياً</h3>
              <p className="text-[11px] text-on-surface-variant">
                أدخل بيانات جهة الاتصال لإضافتها لقائمتك البريدية
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error/20 text-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              البريد الإلكتروني <span className="text-error">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="subscriber@example.com"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              الاسم (اختياري)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم المشترك"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <AppButton type="button" variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
              إلغاء
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading}
              leftIcon={
                isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />
              }
            >
              {isLoading ? "جاري الإضافة..." : "إضافة المشترك"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
