"use client";

import React, { useState } from "react";
import {
  AdminCurrencyItem,
  UpdateCurrencyInput,
  CreateCurrencyInput,
} from "../../../types/admin.types";
import { AppCard, AppBadge, AppButton } from "@/shared/ui";
import { CurrencyRateModal } from "../modals/CurrencyRateModal";
import { NewCurrencyModal } from "../modals/NewCurrencyModal";
import { Coins, Edit2, RefreshCw, Plus } from "lucide-react";

export interface CurrenciesSubTabProps {
  currencies: AdminCurrencyItem[];
  onSaveCurrency: (code: string, input: UpdateCurrencyInput) => Promise<boolean>;
  onAddCurrency?: (input: CreateCurrencyInput) => Promise<boolean>;
  onSyncRates?: () => Promise<boolean>;
  isSaving?: boolean;
  onOpenEditRate?: (currency: AdminCurrencyItem) => void;
}

export function CurrenciesSubTab({
  currencies,
  onSaveCurrency,
  onAddCurrency,
  onSyncRates,
  isSaving = false,
  onOpenEditRate,
}: CurrenciesSubTabProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<AdminCurrencyItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleEditRate = (currency: AdminCurrencyItem) => {
    if (onOpenEditRate) {
      onOpenEditRate(currency);
    } else {
      setSelectedCurrency(currency);
      setIsModalOpen(true);
    }
  };

  const handleSync = async () => {
    if (!onSyncRates || isSyncing) return;
    setIsSyncing(true);
    try {
      await onSyncRates();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">
            إدارة العملات وأسعار الصرف العالمية
          </h3>
          <p className="text-xs text-on-surface-variant">
            تحديد العملات المتاحة للدفع وحساب أسعار الصرف التلقائية بالنسبة للدولار الأمريكي (USD)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onSyncRates && (
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing || isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 transition-all cursor-pointer disabled:opacity-50"
              title="سحب أحدث أسعار الصرف العالمية للعملات مقابل الدولار الأمريكي"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-primary ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "جارٍ المزامنة..." : "تحديث أسعار الصرف الحية"}</span>
            </button>
          )}

          {onAddCurrency && (
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:brightness-110 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة عملة</span>
            </button>
          )}

          <AppBadge variant="primary" size="sm">
            <Coins className="w-3.5 h-3.5 ml-1 inline" />
            {currencies.length} عملات مهيأة
          </AppBadge>
        </div>
      </div>

      {/* Currencies Table */}
      <AppCard className="p-0 bg-surface-container-low border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-xs">
            <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
              <tr>
                <th className="py-3 px-4 font-bold">الرمز والعملة</th>
                <th className="py-3 px-4 font-bold">الاسم بالعربية</th>
                <th className="py-3 px-4 font-bold">رمز العرض</th>
                <th className="py-3 px-4 font-bold">سعر الصرف (1 USD =)</th>
                <th className="py-3 px-4 font-bold">الدول المربوطة تلقائياً</th>
                <th className="py-3 px-4 font-bold">الحالة</th>
                <th className="py-3 px-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {currencies.map((c) => (
                <tr
                  key={c.code}
                  className="hover:bg-surface-container/50 transition-colors"
                >
                  {/* Code & Base Badge */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-on-surface">
                        {c.code}
                      </span>
                      {c.isBaseCurrency && (
                        <AppBadge variant="live" size="sm">
                          العملة المرجعية
                        </AppBadge>
                      )}
                    </div>
                  </td>

                  {/* Arabic Name */}
                  <td className="py-3.5 px-4 font-medium text-on-surface">
                    {c.nameAr}
                  </td>

                  {/* Symbol */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container font-mono text-on-surface border border-outline-variant/30">
                      {c.symbol}
                    </span>
                  </td>

                  {/* Exchange Rate to USD */}
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {c.exchangeRateToUSD} {c.code}
                  </td>

                  {/* Auto-detected Countries */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 flex-wrap max-w-xs">
                      {c.autoDetectCountries && c.autoDetectCountries.length > 0 ? (
                        c.autoDetectCountries.map((country) => (
                          <span
                            key={country}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant border border-outline-variant/20"
                          >
                            {country}
                          </span>
                        ))
                      ) : (
                        <span className="text-outline text-[11px]">—</span>
                      )}
                    </div>
                  </td>

                  {/* Active Status */}
                  <td className="py-3.5 px-4">
                    <AppBadge
                      variant={c.isActive ? "success" : "neutral"}
                      size="sm"
                      dot={c.isActive}
                    >
                      {c.isActive ? "مفعلة" : "معطلة"}
                    </AppBadge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleEditRate(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل سعر الصرف</span>
                    </button>
                  </td>
                </tr>
              ))}

              {currencies.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-on-surface-variant text-xs"
                  >
                    لا توجد عملات مهيأة في المنصة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AppCard>

      {/* Currency Rate Modal (Fallback if not managed by container) */}
      {!onOpenEditRate && (
        <CurrencyRateModal
          isOpen={isModalOpen}
          currency={selectedCurrency}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCurrency(null);
          }}
          onSave={onSaveCurrency}
          isSaving={isSaving}
        />
      )}

      {onAddCurrency && (
        <NewCurrencyModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onAdd={onAddCurrency}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
