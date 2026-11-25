"use client";

import React, { useEffect, useState } from "react";
import { KeyRound, AlertCircle, Lock, Eye } from "lucide-react";
import { AppBadge } from "@/shared/ui";
import { AdminOAuthProviderDTO, OAuthProviderKey } from "../types/oauth.types";
import { OAuthProviderCard, ProviderFormState } from "./oauth/OAuthProviderCard";

export function AdminAuthProvidersTab() {
  const [providers, setProviders] = useState<AdminOAuthProviderDTO[]>([]);
  const [forms, setForms] = useState<Record<string, ProviderFormState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [cardErrors, setCardErrors] = useState<Record<string, string | null>>({});

  const hydrateForms = (list: AdminOAuthProviderDTO[]) => {
    const next: Record<string, ProviderFormState> = {};
    for (const p of list) {
      next[p.provider] = {
        isEnabled: p.isEnabled,
        clientId: p.clientId || "",
        clientSecret: "",
        teamId: p.extraConfig?.teamId || "",
        keyId: p.extraConfig?.keyId || "",
      };
    }
    setForms(next);
  };

  useEffect(() => {
    fetch("/api/admin/auth-providers")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.providers)) {
          setProviders(data.providers);
          hydrateForms(data.providers);
        }
      })
      .catch(() => setGlobalError("تعذر تحميل إعدادات مزودي الدخول"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveProvider = async (providerKey: OAuthProviderKey, overrideEnabled?: boolean) => {
    const form = forms[providerKey];
    if (!form) return;

    const targetEnabled = overrideEnabled !== undefined ? overrideEnabled : form.isEnabled;
    setGlobalError(null);
    setCardErrors((prev) => ({ ...prev, [providerKey]: null }));
    setSavingKey(providerKey);

    try {
      const res = await fetch("/api/admin/auth-providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerKey,
          isEnabled: targetEnabled,
          clientId: form.clientId,
          clientSecret: form.clientSecret || undefined,
          extraConfig:
            providerKey === "apple"
              ? { teamId: form.teamId, keyId: form.keyId }
              : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCardErrors((prev) => ({
          ...prev,
          [providerKey]: data.error || "فشل حفظ بيانات المزود",
        }));
        return;
      }
      setProviders(data.providers);
      hydrateForms(data.providers);
      setSavedKey(providerKey);
      setTimeout(() => setSavedKey(null), 2500);
    } catch {
      setCardErrors((prev) => ({ ...prev, [providerKey]: "تعذر الاتصال بالخادم" }));
    } finally {
      setSavingKey(null);
    }
  };

  const handleCopyCallback = (provider: OAuthProviderKey, url: string) => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedKey(provider);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 rounded-2xl bg-surface-container-low" />
        <div className="h-52 rounded-2xl bg-surface-container-low" />
      </div>
    );
  }

  return (
    <div className="space-y-5 font-cairo" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              إعدادات نظام الدخول الخارجي (Social OAuth 2.0)
            </h3>
            <p className="text-xs text-on-surface-variant">
              تحكم في تسجيل الدخول السريع عبر Google و Facebook و Apple مع تشفير المفاتيح السرية تلقائياً
            </p>
          </div>
        </div>
        <AppBadge variant="success" size="sm">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>تشفير AES-256-GCM</span>
          </span>
        </AppBadge>
      </div>

      {/* Live Preview Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/25">
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
          <Eye className="w-4 h-4 text-primary shrink-0" />
          <span>حالة الظهور في شاشتي الدخول والتسجيل (/login و /register):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {providers.map((p) => {
            const isLive = Boolean(p.isEnabled && p.clientId && p.hasSecret);
            const isPartial = Boolean(p.hasSecret && !p.clientId);
            return (
              <AppBadge
                key={p.provider}
                variant={isLive ? "success" : isPartial ? "warning" : "neutral"}
                size="sm"
              >
                {p.provider.toUpperCase()}:{" "}
                {isLive ? "مفعّل وظاهر" : isPartial ? "ينقصه Client ID" : "معطّل"}
              </AppBadge>
            );
          })}
        </div>
      </div>

      {globalError && (
        <div className="p-3.5 rounded-2xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {providers.map((item) => {
          const form = forms[item.provider] || {
            isEnabled: item.isEnabled,
            clientId: item.clientId,
            clientSecret: "",
            teamId: "",
            keyId: "",
          };
          return (
            <OAuthProviderCard
              key={item.provider}
              item={item}
              form={form}
              cardError={cardErrors[item.provider]}
              onChange={(patch) => {
                setCardErrors((prev) => ({ ...prev, [item.provider]: null }));
                setForms((prev) => ({ ...prev, [item.provider]: { ...form, ...patch } }));
              }}
              onSave={handleSaveProvider}
              onCopyCallback={handleCopyCallback}
              isSaving={savingKey === item.provider}
              isSaved={savedKey === item.provider}
              isCopied={copiedKey === item.provider}
            />
          );
        })}
      </div>
    </div>
  );
}
