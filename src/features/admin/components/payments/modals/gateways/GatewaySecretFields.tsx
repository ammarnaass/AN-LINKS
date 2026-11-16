"use client";

import React, { useState } from "react";
import { AppBadge } from "@/shared/ui";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";

export interface GatewaySecretFieldsProps {
  secretKey: string;
  setSecretKey: (val: string) => void;
  webhookSecret: string;
  setWebhookSecret: (val: string) => void;
  hasSecretKey?: boolean;
  hasWebhookSecret?: boolean;
}

export function GatewaySecretFields({
  secretKey, setSecretKey, webhookSecret, setWebhookSecret, hasSecretKey, hasWebhookSecret,
}: GatewaySecretFieldsProps) {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>المفتاح السري (Secret Key)</span>
          </label>
          {hasSecretKey && <AppBadge variant="success" size="sm">مضبوط ومشفّر</AppBadge>}
        </div>
        <div className="relative">
          <input
            type={showSecretKey ? "text" : "password"}
            placeholder={hasSecretKey ? "•••••••••••••••• (اتركه فارغاً للإبقاء على المفتاح الحالي)" : "sk_live_..."}
            value={secretKey} onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary font-mono"
          />
          <button type="button" onClick={() => setShowSecretKey(!showSecretKey)} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1" aria-label={showSecretKey ? "إخفاء المفتاح" : "إظهار المفتاح"}>
            {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>مفتاح التحقق من الويب هوك (Webhook Secret)</span>
          </label>
          {hasWebhookSecret && <AppBadge variant="neutral" size="sm">مضبوط ومشفّر</AppBadge>}
        </div>
        <div className="relative">
          <input
            type={showWebhookSecret ? "text" : "password"}
            placeholder={hasWebhookSecret ? "•••••••••••••••• (اتركه فارغاً للإبقاء على الحالي)" : "whsec_..."}
            value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)}
            className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary font-mono"
          />
          <button type="button" onClick={() => setShowWebhookSecret(!showWebhookSecret)} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1" aria-label={showWebhookSecret ? "إخفاء الويب هوك" : "إظهار الويب هوك"}>
            {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
}

export default GatewaySecretFields;
