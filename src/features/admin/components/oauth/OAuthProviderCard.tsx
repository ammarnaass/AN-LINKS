"use client";

import React from "react";
import { Copy, Check, Save, ShieldCheck } from "lucide-react";
import { AppCard, AppButton, AppInput, AppBadge } from "@/shared/ui";
import { AdminOAuthProviderDTO, OAuthProviderKey } from "../../types/oauth.types";
import { ProviderBrandIcon } from "./ProviderBrandIcon";

export interface ProviderFormState {
  isEnabled: boolean;
  clientId: string;
  clientSecret: string;
  teamId: string;
  keyId: string;
}

interface OAuthProviderCardProps {
  item: AdminOAuthProviderDTO;
  form: ProviderFormState;
  onChange: (patch: Partial<ProviderFormState>) => void;
  onSave: (provider: OAuthProviderKey) => void;
  onCopyCallback: (provider: OAuthProviderKey, url: string) => void;
  isSaving: boolean;
  isSaved: boolean;
  isCopied: boolean;
}

export function OAuthProviderCard({
  item,
  form,
  onChange,
  onSave,
  onCopyCallback,
  isSaving,
  isSaved,
  isCopied,
}: OAuthProviderCardProps) {
  return (
    <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center shrink-0">
            <ProviderBrandIcon provider={item.provider} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-sm text-on-surface">{item.displayNameAr}</h4>
              <AppBadge variant={form.isEnabled ? "success" : "neutral"} size="sm">
                {form.isEnabled ? "مفعّل" : "معطّل"}
              </AppBadge>
              {item.hasSecret && (
                <AppBadge variant="primary" size="sm">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>مفتاح محفوظ</span>
                  </span>
                </AppBadge>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{item.descriptionAr}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({ isEnabled: !form.isEnabled })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            form.isEnabled
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {form.isEnabled ? "تعطيل المزود" : "تفعيل المزود"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput
          label={item.provider === "apple" ? "Services ID (Client ID)" : "Client ID / App ID"}
          value={form.clientId}
          onChange={(e) => onChange({ clientId: e.target.value })}
          placeholder={
            item.provider === "google"
              ? "123456-xxx.apps.googleusercontent.com"
              : "أدخل المعرّف هنا..."
          }
          dir="ltr"
        />

        <AppInput
          label={
            item.provider === "apple"
              ? "Client Secret / JWT Private Key"
              : "Client Secret / App Secret"
          }
          type="password"
          value={form.clientSecret}
          onChange={(e) => onChange({ clientSecret: e.target.value })}
          placeholder={item.secretPreview || "أدخل المفتاح السري..."}
          helperText={item.hasSecret ? "اتركه فارغاً للاحتفاظ بالمفتاح المشفر الحالي" : undefined}
          dir="ltr"
        />
      </div>

      {item.provider === "apple" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            label="Apple Team ID (اختياري)"
            value={form.teamId}
            onChange={(e) => onChange({ teamId: e.target.value })}
            placeholder="مثال: 9A8B7C6D5E"
            dir="ltr"
          />
          <AppInput
            label="Apple Key ID (اختياري)"
            value={form.keyId}
            onChange={(e) => onChange({ keyId: e.target.value })}
            placeholder="مثال: ABC123DEF4"
            dir="ltr"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold text-on-surface-variant shrink-0">Callback URL:</span>
          <code className="text-[11px] font-mono bg-surface-container px-2.5 py-1 rounded-lg text-primary truncate" dir="ltr">
            {item.callbackUrl}
          </code>
          <button
            type="button"
            onClick={() => onCopyCallback(item.provider, item.callbackUrl)}
            className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface-variant hover:text-primary transition shrink-0"
            title="نسخ رابط الاستجابة"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AppButton
          type="button"
          variant="primary"
          size="sm"
          isLoading={isSaving}
          onClick={() => onSave(item.provider)}
          leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {isSaved ? "تم الحفظ!" : "حفظ إعدادات المزود"}
        </AppButton>
      </div>
    </AppCard>
  );
}
