"use client";

import React, { useEffect, useState } from "react";
import { KeyRound, AlertCircle, Lock } from "lucide-react";
import { AppBadge } from "@/shared/ui";
import { AdminOAuthProviderDTO, OAuthProviderKey } from "../types/oauth.types";
import { OAuthProviderCard, ProviderFormState } from "./oauth/OAuthProviderCard";
import { OAuthVisibilityBar } from "./oauth/OAuthVisibilityBar";

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
        showWhenDisabled: p.showWhenDisabled !== false,
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

  const persistProvider = async (
    providerKey: OAuthProviderKey,
    payload: { isEnabled: boolean; showWhenDisabled: boolean; form?: ProviderFormState }
  ) => {
    setGlobalError(null);
    setCardErrors((prev) => ({ ...prev, [providerKey]: null }));
    setSavingKey(providerKey);

    try {
      const res = await fetch("/api/admin/auth-providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerKey,
          isEnabled: payload.isEnabled,
          showWhenDisabled: payload.showWhenDisabled,
          clientId: payload.form?.clientId,
          clientSecret: payload.form?.clientSecret || undefined,
          extraConfig:
            providerKey === "apple" && payload.form
              ? { teamId: payload.form.teamId, keyId: payload.form.keyId }
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

  const handleSaveProvider = (providerKey: OAuthProviderKey, overrideEnabled?: boolean) => {
    const form = forms[providerKey];
    if (!form) return;
    const isEnabled = overrideEnabled !== undefined ? overrideEnabled : form.isEnabled;
    void persistProvider(providerKey, { isEnabled, showWhenDisabled: form.showWhenDisabled, form });
  };

  const handleToggleVisibility = (providerKey: OAuthProviderKey, showWhenDisabled: boolean) => {
    const form = forms[providerKey];
    if (!form) return;
    void persistProvider(providerKey, { isEnabled: form.isEnabled, showWhenDisabled, form });
  };

  const handleBulkVisibility = async (showWhenDisabled: boolean) => {
    const disabledList = providers.filter((p) => !p.isEnabled);
    if (disabledList.length === 0) return;
    setSavingKey("bulk");
    try {
      let latest: AdminOAuthProviderDTO[] | null = null;
      for (const p of disabledList) {
        const res = await fetch("/api/admin/auth-providers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: p.provider, isEnabled: false, showWhenDisabled }),
        });
        const data = await res.json();
        if (res.ok && data.success) latest = data.providers;
      }
      if (latest) {
        setProviders(latest);
        hydrateForms(latest);
      }
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

      <OAuthVisibilityBar
        providers={providers}
        isBusy={savingKey !== null}
        onToggleBulk={(nextShow) => void handleBulkVisibility(nextShow)}
      />

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
            showWhenDisabled: item.showWhenDisabled !== false,
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
              onToggleVisibility={handleToggleVisibility}
              onCopyCallback={handleCopyCallback}
              isSaving={savingKey === item.provider || savingKey === "bulk"}
              isSaved={savedKey === item.provider}
              isCopied={copiedKey === item.provider}
            />
          );
        })}
      </div>
    </div>
  );
}
