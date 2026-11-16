"use client";

import React, { useState, useEffect } from "react";
import { AdminGatewayDetails, UpdateGatewayInput } from "../../../types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { X, CreditCard, Sliders, Check, AlertCircle } from "lucide-react";
import { GatewaySecretFields } from "./gateways/GatewaySecretFields";
import { GatewayFeeSettings, GatewayFeeData } from "./gateways/GatewayFeeSettings";

export interface GatewayConfigModalProps {
  isOpen: boolean;
  gateway: AdminGatewayDetails | null;
  onClose: () => void;
  onSave: (input: UpdateGatewayInput) => Promise<boolean>;
  isSaving?: boolean;
}

export function GatewayConfigModal({
  isOpen, gateway, onClose, onSave, isSaving = false,
}: GatewayConfigModalProps) {
  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [isTestMode, setIsTestMode] = useState(true);
  const [fees, setFees] = useState<GatewayFeeData>({ feePercentage: 0, feeFixed: 0, supportedCurrencies: "" });
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (gateway) {
      setPublishableKey(gateway.publishableKey || "");
      setSecretKey(""); setWebhookSecret(""); setIsTestMode(gateway.isTestMode);
      setFees({
        feePercentage: gateway.feePercentage || 0, feeFixed: gateway.feeFixed || 0,
        supportedCurrencies: gateway.supportedCurrencies?.join(", ") || "",
      });
      setStatusMessage(null);
    }
  }, [gateway, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !gateway) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const currencies = fees.supportedCurrencies.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean);
    const success = await onSave({
      id: gateway.id, publishableKey: publishableKey.trim(), isTestMode,
      feePercentage: Number(fees.feePercentage), feeFixed: Number(fees.feeFixed), supportedCurrencies: currencies,
      ...(secretKey.trim() ? { secretKey: secretKey.trim() } : {}),
      ...(webhookSecret.trim() ? { webhookSecret: webhookSecret.trim() } : {}),
    });
    if (success) {
      setStatusMessage({ type: "success", text: "تم حفظ إعدادات البوابة بنجاح" });
      setTimeout(() => onClose(), 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء حفظ الإعدادات" });
    }
  };

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="gateway-config-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
            <div>
              <h3 id="gateway-config-modal-title" className="font-bold text-on-surface text-base">إعدادات بوابة {gateway.nameAr}</h3>
              <p className="text-xs text-on-surface-variant font-mono">{gateway.nameEn} ({gateway.code})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer" aria-label="إغلاق النافذة"><X className="w-5 h-5" /></button>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${statusMessage.type === "success" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-error/15 text-error border border-error/30"}`}>
            {statusMessage.type === "success" ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-on-surface">بيئة التشغيل (Environment)</span>
              <span className="text-[11px] text-on-surface-variant">
                {isTestMode ? "وضع التجربة (Sandbox) - لن يتم خصم مبالغ حقيقية" : "الوضع الحي (Live Production) - جاهز لاستقبال دفعات العملاء الفعلية"}
              </span>
            </div>
            <button
              type="button" onClick={() => setIsTestMode(!isTestMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isTestMode ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-primary text-on-primary shadow-sm"}`}
            >{isTestMode ? "وضع تجريبي" : "وضع حي"}</button>
          </div>

          <AppInput label="المفتاح العام (Publishable / Public API Key)" placeholder="pk_live_..." value={publishableKey} onChange={(e) => setPublishableKey(e.target.value)} />
          <GatewaySecretFields secretKey={secretKey} setSecretKey={setSecretKey} webhookSecret={webhookSecret} setWebhookSecret={setWebhookSecret} hasSecretKey={gateway.hasSecretKey} hasWebhookSecret={gateway.hasWebhookSecret} />
          <GatewayFeeSettings data={fees} onChange={(k, v) => setFees((p) => ({ ...p, [k]: v }))} />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">إلغاء</button>
            <AppButton type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Sliders className="w-4 h-4" />}>حفظ المفاتيح والإعدادات</AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GatewayConfigModal;
