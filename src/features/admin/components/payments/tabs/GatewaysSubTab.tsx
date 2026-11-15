"use client";

import React, { useState } from "react";
import {
  AdminGatewayDetails,
  UpdateGatewayInput,
} from "../../../types/admin.types";
import { AppCard, AppBadge, AppButton } from "@/shared/ui";
import { GatewayConfigModal } from "../modals/GatewayConfigModal";
import {
  CreditCard,
  Smartphone,
  Wallet,
  CalendarCheck,
  Globe,
  Sliders,
  CheckCircle2,
  Lock,
  Percent,
} from "lucide-react";

export interface GatewaysSubTabProps {
  gateways: AdminGatewayDetails[];
  onToggleGateway: (id: string) => Promise<boolean>;
  onSaveConfig?: (input: UpdateGatewayInput) => Promise<boolean>;
  isSaving?: boolean;
}

export function GatewaysSubTab({
  gateways,
  onToggleGateway,
  onSaveConfig,
  isSaving = false,
}: GatewaysSubTabProps) {
  const [selectedGateway, setSelectedGateway] = useState<AdminGatewayDetails | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const getGatewayIcon = (code: string) => {
    const c = code.toLowerCase();
    switch (c) {
      case "mada":
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case "apple_pay":
        return <Smartphone className="w-5 h-5 text-on-surface" />;
      case "stc_pay":
        return <Wallet className="w-5 h-5 text-purple-400" />;
      case "tamara":
        return <CalendarCheck className="w-5 h-5 text-amber-400" />;
      case "tabby":
        return <CalendarCheck className="w-5 h-5 text-emerald-400" />;
      case "fawry":
        return <Wallet className="w-5 h-5 text-amber-500" />;
      case "visa_mastercard":
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case "stripe":
        return <CreditCard className="w-5 h-5 text-indigo-400" />;
      case "paypal":
        return <Wallet className="w-5 h-5 text-sky-400" />;
      default:
        return <CreditCard className="w-5 h-5 text-primary" />;
    }
  };

  const isNational = (gw: AdminGatewayDetails) => {
    const c = gw.code?.toLowerCase();
    return (
      gw.category === "NATIONAL" ||
      gw.category === "BNPL" ||
      gw.category === "WALLET" ||
      ["mada", "stc_pay", "tamara", "tabby", "fawry", "apple_pay"].includes(c)
    );
  };

  const nationalGateways = gateways.filter((g) => isNational(g));
  const internationalGateways = gateways.filter((g) => !isNational(g));

  const handleOpenConfig = (gw: AdminGatewayDetails) => {
    setSelectedGateway(gw);
    setIsConfigModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await onToggleGateway(id);
    } finally {
      setTogglingId(null);
    }
  };

  const renderGatewayCard = (gw: AdminGatewayDetails) => {
    const isThisToggling = togglingId === gw.id;

    return (
      <AppCard
        key={gw.id}
        className="p-5 bg-surface-container-low border-outline-variant/30 flex flex-col justify-between hover:border-outline-variant/60 transition-all shadow-sm"
      >
        <div className="space-y-4">
          {/* Card Top: Icon + Names + Status Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 border border-outline-variant/20 shadow-xs">
                {getGatewayIcon(gw.code)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">{gw.nameAr}</h4>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {gw.nameEn} ({gw.code})
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <AppBadge
                variant={gw.isEnabled ? "success" : "neutral"}
                size="sm"
                dot={gw.isEnabled}
              >
                {gw.isEnabled ? "مفعلة" : "معطلة"}
              </AppBadge>
              <AppBadge
                variant={gw.isTestMode ? "warning" : "live"}
                size="sm"
              >
                {gw.isTestMode ? "تجريبي" : "حي"}
              </AppBadge>
            </div>
          </div>

          {/* Fee & Secret Status */}
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-surface">
              <Percent className="w-3.5 h-3.5 text-primary" />
              <span>الرسوم:</span>
              <span className="font-mono font-bold">
                {gw.feePercentage}% + {gw.feeFixed} ر.س
              </span>
            </div>
            <div className="flex items-center gap-1">
              {gw.hasSecretKey ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> المفاتيح مشفّرة
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                  <Lock className="w-3 h-3" /> بانتظار الربط
                </span>
              )}
            </div>
          </div>

          {/* Supported Currencies */}
          {gw.supportedCurrencies && gw.supportedCurrencies.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-on-surface-variant font-bold">العملات:</span>
              {gw.supportedCurrencies.slice(0, 5).map((cur) => (
                <span
                  key={cur}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant border border-outline-variant/30"
                >
                  {cur}
                </span>
              ))}
              {gw.supportedCurrencies.length > 5 && (
                <span className="text-[10px] text-outline">
                  +{gw.supportedCurrencies.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={isThisToggling}
            onClick={() => handleToggle(gw.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gw.isEnabled
                ? "bg-error/15 text-error hover:bg-error/25"
                : "bg-primary text-on-primary hover:bg-primary-container"
            }`}
          >
            {isThisToggling
              ? "جاري التحديث..."
              : gw.isEnabled
              ? "تعطيل البوابة"
              : "تفعيل البوابة"}
          </button>

          <button
            type="button"
            onClick={() => handleOpenConfig(gw)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
          >
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>إعداد المفاتيح والربط</span>
          </button>
        </div>
      </AppCard>
    );
  };

  return (
    <div className="space-y-8 font-cairo" dir="rtl">
      {/* National Gateways Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                بوابات الدفع الوطنية (السعودية والخليج ومصر)
              </h3>
              <p className="text-xs text-on-surface-variant">
                مدى، STC Pay، تمارا، تابي، فوري والدفع المباشر عبر المحافظ
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">
            {nationalGateways.length} بوابات
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nationalGateways.map(renderGatewayCard)}
        </div>
      </div>

      {/* International Gateways Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                بوابات الدفع العالمية والبطاقات
              </h3>
              <p className="text-xs text-on-surface-variant">
                Stripe، فيزا/ماستركارد، PayPal والمدفوعات الدولية بالدولار واليورو
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">
            {internationalGateways.length} بوابات
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {internationalGateways.map(renderGatewayCard)}
        </div>
      </div>

      {/* Config Modal */}
      <GatewayConfigModal
        isOpen={isConfigModalOpen}
        gateway={selectedGateway}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedGateway(null);
        }}
        onSave={onSaveConfig || (async () => true)}
        isSaving={isSaving}
      />
    </div>
  );
}
