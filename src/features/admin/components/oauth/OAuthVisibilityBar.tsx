"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { AppBadge } from "@/shared/ui";
import { AdminOAuthProviderDTO } from "../../types/oauth.types";

interface OAuthVisibilityBarProps {
  providers: AdminOAuthProviderDTO[];
  isBusy: boolean;
  onToggleBulk: (showWhenDisabled: boolean) => void;
}

export function OAuthVisibilityBar({
  providers,
  isBusy,
  onToggleBulk,
}: OAuthVisibilityBarProps) {
  const disabledProviders = providers.filter((p) => !p.isEnabled);
  const anyVisibleDisabled = disabledProviders.some((p) => p.showWhenDisabled !== false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/25">
      <div className="flex flex-wrap items-center gap-2">
        <Eye className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-bold text-on-surface">
          الظهور في شاشتي الدخول والتسجيل:
        </span>
        {providers.map((p) => {
          const isLive = Boolean(p.isEnabled && p.clientId && p.hasSecret);
          const label = isLive
            ? "مفعّل وظاهر"
            : p.showWhenDisabled === false
              ? "مخفي"
              : p.hasSecret && !p.clientId
                ? "ينقصه Client ID"
                : "بانتظار التفعيل";
          return (
            <AppBadge
              key={p.provider}
              variant={isLive ? "success" : p.showWhenDisabled === false ? "neutral" : "warning"}
              size="sm"
            >
              {p.provider.toUpperCase()}: {label}
            </AppBadge>
          );
        })}
      </div>

      {disabledProviders.length > 0 && (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onToggleBulk(!anyVisibleDisabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-surface-container-high border border-outline-variant/30 hover:border-primary/40 text-on-surface transition cursor-pointer disabled:opacity-60"
        >
          {anyVisibleDisabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>
            {anyVisibleDisabled
              ? "إخفاء الأزرار المعطّلة عن شاشة الدخول"
              : "إظهار الأزرار المعطّلة كـ «بانتظار التفعيل»"}
          </span>
        </button>
      )}
    </div>
  );
}
