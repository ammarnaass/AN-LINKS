"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";

interface SecurityTwoFactorCardProps {
  isEnabled: boolean;
  isLoading: boolean;
  onStartSetup: () => void;
  onDisable: (password: string) => Promise<void>;
}

export function SecurityTwoFactorCard({
  isEnabled,
  isLoading,
  onStartSetup,
  onDisable,
}: SecurityTwoFactorCardProps) {
  const [showDisablePrompt, setShowDisablePrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDisableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabling(true);
    setError(null);
    try {
      await onDisable(password);
      setShowDisablePrompt(false);
      setPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل التعطيل");
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">المصادقة الثنائية (2FA)</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isEnabled ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {isLoading ? "جاري الفحص..." : isEnabled ? "مفعلة بنجاح" : "معطلة حالياً"}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          حماية إضافية لحسابك تتطلب إدخال رمز ديناميكي من تطبيق المصادقة في هاتفك عند كل تسجيل دخول.
        </p>

        {error && <p className="text-xs text-error">{error}</p>}

        {showDisablePrompt && (
          <form onSubmit={handleDisableSubmit} className="space-y-2 pt-2">
            <input
              type="password"
              placeholder="أدخل كلمة المرور للتأكيد"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container px-3 py-2 rounded-xl text-xs border border-outline-variant/30 text-on-surface"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isDisabling}
                className="px-3 py-1.5 rounded-lg bg-error text-on-error text-xs font-bold"
              >
                {isDisabling ? "جاري التعطيل..." : "تأكيد التعطيل"}
              </button>
              <button
                type="button"
                onClick={() => setShowDisablePrompt(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>

      {!showDisablePrompt && (
        <div className="pt-2">
          {isEnabled ? (
            <button
              type="button"
              onClick={() => setShowDisablePrompt(true)}
              className="px-4 py-2 rounded-xl bg-surface-container-high text-error text-xs font-semibold hover:bg-error/10 transition"
            >
              تعطيل المصادقة الثنائية
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartSetup}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow hover:opacity-90 transition disabled:opacity-50"
            >
              تفعيل المصادقة الثنائية الآن
            </button>
          )}
        </div>
      )}
    </div>
  );
}
