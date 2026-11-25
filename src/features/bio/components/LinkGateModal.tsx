"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, X, Loader2, ArrowLeft } from "lucide-react";

interface LinkGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
  linkTitle: string;
  hasPin: boolean;
  isSensitive: boolean;
}

/**
 * Interactive visitor gate modal handling PIN-protected links and +18 sensitive content warnings.
 */
export function LinkGateModal({
  isOpen,
  onClose,
  linkId,
  linkTitle,
  hasPin,
  isSensitive,
}: LinkGateModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasPin) {
      window.open(`/go/${linkId}`, "_blank", "noopener,noreferrer");
      onClose();
      return;
    }

    if (!pin.trim()) {
      setError("يرجى إدخال رمز الدخول");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await fetch("/api/bio/verify-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId, pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "رمز الدخول غير صحيح");
        return;
      }
      window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
      setPin("");
      onClose();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-3xl bg-surface-container-high border border-white/10 p-6 shadow-2xl space-y-5 text-right"
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${hasPin ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-400"}`}>
              {hasPin ? <Lock className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                {hasPin ? "رابط محمي برمز سري (PIN)" : "تنبيه محتوى حساس (+18)"}
              </h3>
              <p className="text-[11px] text-on-surface-variant truncate max-w-[200px]">{linkTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-xl text-outline hover:text-on-surface hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {isSensitive && (
            <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 leading-relaxed">
              قد يحتوي هذا الرابط الخارجي على محتوى مخصص للبالغين أو مواد حساسة. يرجى تأكيد رغبتك في المتابعة.
            </p>
          )}

          {hasPin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">أدخل الرمز السري للفتح</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                dir="ltr"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-center font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-white/5 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition disabled:opacity-60"
            >
              {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{hasPin ? "تحقق وفتح الرابط" : "أوافق، متابعة للرابط"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
