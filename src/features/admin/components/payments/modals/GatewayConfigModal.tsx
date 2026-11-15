"use client";

import React, { useState, useEffect } from "react";
import { AdminGatewayDetails, UpdateGatewayInput } from "../../../types/admin.types";
import { AppButton, AppInput, AppBadge } from "@/shared/ui";
import {
  X,
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  Sliders,
  Check,
  AlertCircle,
  Lock,
} from "lucide-react";

export interface GatewayConfigModalProps {
  isOpen: boolean;
  gateway: AdminGatewayDetails | null;
  onClose: () => void;
  onSave: (input: UpdateGatewayInput) => Promise<boolean>;
  isSaving?: boolean;
}

export function GatewayConfigModal({
  isOpen,
  gateway,
  onClose,
  onSave,
  isSaving = false,
}: GatewayConfigModalProps) {
  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState("");
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [isTestMode, setIsTestMode] = useState(true);
  const [feePercentage, setFeePercentage] = useState(0);
  const [feeFixed, setFeeFixed] = useState(0);
  const [supportedCurrencies, setSupportedCurrencies] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (gateway) {
      setPublishableKey(gateway.publishableKey || "");
      setSecretKey("");
      setWebhookSecret("");
      setIsTestMode(gateway.isTestMode);
      setFeePercentage(gateway.feePercentage || 0);
      setFeeFixed(gateway.feeFixed || 0);
      setSupportedCurrencies(gateway.supportedCurrencies?.join(", ") || "");
      setStatusMessage(null);
    }
  }, [gateway, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !gateway) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const currenciesArray = supportedCurrencies
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    const payload: UpdateGatewayInput = {
      id: gateway.id,
      publishableKey: publishableKey.trim(),
      isTestMode,
      feePercentage: Number(feePercentage),
      feeFixed: Number(feeFixed),
      supportedCurrencies: currenciesArray,
    };

    if (secretKey.trim()) {
      payload.secretKey = secretKey.trim();
    }
    if (webhookSecret.trim()) {
      payload.webhookSecret = webhookSecret.trim();
    }

    const success = await onSave(payload);
    if (success) {
      setStatusMessage({ type: "success", text: "تم حفظ إعدادات البوابة بنجاح" });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء حفظ الإعدادات" });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gateway-config-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="gateway-config-modal-title" className="font-bold text-on-surface text-base">
                إعدادات بوابة {gateway.nameAr}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">{gateway.nameEn} ({gateway.code})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-error/15 text-error border border-error/30"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Environment Mode Switch */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-on-surface">بيئة التشغيل (Environment)</span>
              <span className="text-[11px] text-on-surface-variant">
                {isTestMode
                  ? "وضع التجربة (Sandbox) - لن يتم خصم مبالغ حقيقية"
                  : "الوضع الحي (Live Production) - جاهز لاستقبال دفعات العملاء الفعلية"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsTestMode(!isTestMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isTestMode
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-primary text-on-primary shadow-sm"
              }`}
            >
              {isTestMode ? "وضع تجريبي" : "وضع حي"}
            </button>
          </div>

          {/* Publishable / Client Key */}
          <AppInput
            label="المفتاح العام (Publishable / Public API Key)"
            placeholder="pk_live_..."
            value={publishableKey}
            onChange={(e) => setPublishableKey(e.target.value)}
          />

          {/* Secret API Key with Mask indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>المفتاح السري (Secret Key)</span>
              </label>
              {gateway.hasSecretKey && (
                <AppBadge variant="success" size="sm">
                  مضبوط ومشفّر
                </AppBadge>
              )}
            </div>
            <div className="relative">
              <input
                type={showSecretKey ? "text" : "password"}
                placeholder={
                  gateway.hasSecretKey
                    ? "•••••••••••••••• (اتركه فارغاً للإبقاء على المفتاح الحالي)"
                    : "sk_live_..."
                }
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
                aria-label={showSecretKey ? "إخفاء المفتاح" : "إظهار المفتاح"}
              >
                {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Webhook Secret Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>مفتاح التحقق من الويب هوك (Webhook Secret)</span>
              </label>
              {gateway.hasWebhookSecret && (
                <AppBadge variant="neutral" size="sm">
                  مضبوط ومشفّر
                </AppBadge>
              )}
            </div>
            <div className="relative">
              <input
                type={showWebhookSecret ? "text" : "password"}
                placeholder={
                  gateway.hasWebhookSecret
                    ? "•••••••••••••••• (اتركه فارغاً للإبقاء على الحالي)"
                    : "whsec_..."
                }
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary font-mono"
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
                aria-label={showWebhookSecret ? "إخفاء الويب هوك" : "إظهار الويب هوك"}
              >
                {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Transaction Fees: Percentage & Fixed */}
          <div className="grid grid-cols-2 gap-3">
            <AppInput
              label="نسبة العمولة (%)"
              type="number"
              step="0.01"
              value={feePercentage}
              onChange={(e) => setFeePercentage(Number(e.target.value))}
            />
            <AppInput
              label="رسوم ثابتة (SAR)"
              type="number"
              step="0.01"
              value={feeFixed}
              onChange={(e) => setFeeFixed(Number(e.target.value))}
            />
          </div>

          {/* Supported Currencies */}
          <AppInput
            label="العملات المدعومة (مفصولة بفواصل)"
            placeholder="SAR, USD, AED, KWD, EGP"
            value={supportedCurrencies}
            onChange={(e) => setSupportedCurrencies(e.target.value)}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <AppButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Sliders className="w-4 h-4" />}
            >
              حفظ المفاتيح والإعدادات
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
