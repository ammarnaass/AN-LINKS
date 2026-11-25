"use client";

import React from "react";
import {
  Copy,
  Check,
  Save,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { AppCard, AppButton, AppInput, AppBadge } from "@/shared/ui";
import { AdminOAuthProviderDTO, OAuthProviderKey } from "../../types/oauth.types";
import { ProviderBrandIcon } from "./ProviderBrandIcon";

export interface ProviderFormState {
  isEnabled: boolean;
  showWhenDisabled: boolean;
  clientId: string;
  clientSecret: string;
  teamId: string;
  keyId: string;
}

interface OAuthProviderCardProps {
  item: AdminOAuthProviderDTO;
  form: ProviderFormState;
  cardError?: string | null;
  onChange: (patch: Partial<ProviderFormState>) => void;
  onSave: (provider: OAuthProviderKey, overrideEnabled?: boolean) => void;
  onToggleVisibility: (provider: OAuthProviderKey, showWhenDisabled: boolean) => void;
  onCopyCallback: (provider: OAuthProviderKey, url: string) => void;
  isSaving: boolean;
  isSaved: boolean;
  isCopied: boolean;
}

export function OAuthProviderCard({
  item,
  form,
  cardError,
  onChange,
  onSave,
  onToggleVisibility,
  onCopyCallback,
  isSaving,
  isSaved,
  isCopied,
}: OAuthProviderCardProps) {
  const hasAnySecret = Boolean(form.clientSecret.trim() || item.hasSecret);
  const isReadyToPublish = Boolean(form.clientId.trim() && hasAnySecret);
  const missingClientIdWithSecret = Boolean(!form.clientId.trim() && hasAnySecret);

  return (
    <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center shrink-0">
            <ProviderBrandIcon provider={item.provider} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-sm text-on-surface">{item.displayNameAr}</h4>
              <AppBadge variant={form.isEnabled ? "success" : "neutral"} size="sm">
                {form.isEnabled ? "مفعّل وظاهر في شاشة الدخول" : "معطّل"}
              </AppBadge>
              {!form.isEnabled && (
                <AppBadge variant={form.showWhenDisabled ? "warning" : "neutral"} size="sm">
                  {form.showWhenDisabled ? "ظاهر كـ «بانتظار التفعيل»" : "مخفي عن شاشة الدخول"}
                </AppBadge>
              )}
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

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!form.isEnabled && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onToggleVisibility(item.provider, !form.showWhenDisabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border disabled:opacity-60 ${
                form.showWhenDisabled
                  ? "bg-surface-container border-outline-variant/30 text-on-surface hover:border-primary/40"
                  : "bg-error-container/15 border-error/30 text-error hover:bg-error-container/25"
              }`}
              title="التحكم في إظهار أو إخفاء الزر في شاشات الدخول والتسجيل أثناء التعطيل"
            >
              {form.showWhenDisabled ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>إخفاء من شاشة الدخول</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>إظهار في شاشة الدخول</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            role="switch"
            aria-checked={form.isEnabled}
            onClick={() => onChange({ isEnabled: !form.isEnabled })}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
              form.isEnabled
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span
              className={`w-8 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                form.isEnabled ? "bg-primary justify-end" : "bg-outline-variant/40 justify-start"
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
            </span>
            <span>{form.isEnabled ? "مفعّل" : "تفعيل المزود"}</span>
          </button>
        </div>
      </div>

      {missingClientIdWithSecret && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>يوجد مفتاح سري محفوظ، ولكن ينقص إدخال Client ID وتفعيل المزود ليظهر في شاشتي الدخول والتسجيل.</span>
        </div>
      )}

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

      {cardError && (
        <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cardError}</span>
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

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!form.isEnabled && isReadyToPublish && (
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={() => onSave(item.provider, true)}
              leftIcon={<Save className="w-4 h-4" />}
            >
              حفظ وتفعيل المزود
            </AppButton>
          )}
          <AppButton
            type="button"
            variant={!form.isEnabled && isReadyToPublish ? "outline" : "primary"}
            size="sm"
            isLoading={isSaving}
            onClick={() => onSave(item.provider)}
            leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {isSaved ? "تم الحفظ!" : "حفظ إعدادات المزود"}
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
