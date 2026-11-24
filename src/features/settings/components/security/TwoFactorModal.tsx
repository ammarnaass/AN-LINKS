"use client";

import React, { useState } from "react";
import { Check, Copy, X } from "lucide-react";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeDataUrl: string;
  secret: string;
  backupCodes: string[];
  onConfirm: (token: string) => Promise<void>;
}

export function TwoFactorModal({
  isOpen,
  onClose,
  qrCodeDataUrl,
  secret,
  backupCodes,
  onConfirm,
}: TwoFactorModalProps) {
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCodes, setCopiedCodes] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);
    try {
      await onConfirm(token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "رمز التحقق غير صحيح");
    } finally {
      setIsVerifying(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-lg w-full p-6 space-y-5 border border-outline-variant/30 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <h3 className="text-base font-bold text-on-surface">إعداد المصادقة الثنائية (2FA)</h3>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="p-3 rounded-xl bg-error/10 text-error text-xs font-semibold">{error}</div>}

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
          <img src={qrCodeDataUrl} alt="QR Code" className="w-32 h-32 rounded-lg bg-white p-1 shadow" />
          <div className="space-y-1.5 text-xs text-on-surface-variant flex-1 text-right">
            <p className="font-semibold text-on-surface">امسح الرمز عبر تطبيق المصادقة:</p>
            <p>Google Authenticator, 1Password, أو Authy.</p>
            <div className="pt-1">
              <span className="text-[10px] text-on-surface-variant">أو أدخل المفتاح يدوياً:</span>
              <p className="font-mono text-primary text-xs break-all select-all font-bold" dir="ltr">
                {secret}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-on-surface">رموز الاسترداد الاحتياطية (احفظها في مكان آمن):</span>
            <button onClick={copyBackupCodes} className="text-primary hover:underline flex items-center gap-1 text-[11px]">
              {copiedCodes ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCodes ? "تم النسخ" : "نسخ الرموز"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs text-on-surface-variant" dir="ltr">
            {backupCodes.map((code) => (
              <span key={code} className="bg-surface-container px-2 py-1 rounded text-center">
                {code}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <label className="text-xs font-medium text-on-surface-variant">أدخل الرمز السداسي للتأكيد</label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="flex-1 bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant/30 text-center font-mono text-lg font-bold tracking-widest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
            <button
              type="submit"
              disabled={isVerifying || token.length < 6}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {isVerifying ? "جاري التحقق..." : "تفعيل"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
