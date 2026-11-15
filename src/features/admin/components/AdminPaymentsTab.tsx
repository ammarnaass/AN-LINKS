"use client";

import React, { useState } from "react";
import { AdminPlatformSettings, AdminTransaction, GatewayId } from "../types/admin.types";
import { AppCard, AppButton, AppBadge, AppInput } from "@/shared/ui";
import { CreditCard, Smartphone, Wallet, CalendarCheck, Check, Save } from "lucide-react";

export interface AdminPaymentsTabProps {
  settings: AdminPlatformSettings;
  transactions: AdminTransaction[];
  onUpdateSettings: (updated: Partial<AdminPlatformSettings>) => Promise<boolean>;
}

export function AdminPaymentsTab({ settings, transactions, onUpdateSettings }: AdminPaymentsTabProps) {
  const [gateways, setGateways] = useState(settings.gateways);
  const [pricing, setPricing] = useState(settings.pricing);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const GATEWAY_ICONS: Record<GatewayId, React.ReactNode> = {
    mada: <CreditCard className="w-5 h-5 text-emerald-400" />,
    apple_pay: <Smartphone className="w-5 h-5 text-on-surface" />,
    visa_mastercard: <CreditCard className="w-5 h-5 text-primary" />,
    stc_pay: <Wallet className="w-5 h-5 text-purple-400" />,
    tamara: <CalendarCheck className="w-5 h-5 text-amber-400" />,
    tabby: <CalendarCheck className="w-5 h-5 text-emerald-400" />,
    fawry: <Wallet className="w-5 h-5 text-amber-500" />,
    stripe: <CreditCard className="w-5 h-5 text-indigo-400" />,
    paypal: <Wallet className="w-5 h-5 text-blue-400" />,
  };

  const handleToggleGateway = (id: GatewayId) => {
    setGateways((prev) => ({
      ...prev,
      [id]: { ...prev[id], isEnabled: !prev[id].isEnabled },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onUpdateSettings({ gateways, pricing });
    setIsSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">إدارة بوابات الدفع والاشتراكات المالية</h3>
          <p className="text-xs text-on-surface-variant">تحكم بتفعيل بوابات الدفع الوطنية والعالمية وضبط أسعار الباقات والعمولات</p>
        </div>
        <AppButton
          variant="primary"
          size="sm"
          isLoading={isSaving}
          onClick={handleSave}
          leftIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? "تم الحفظ!" : "حفظ التغييرات"}
        </AppButton>
      </div>

      {/* Payment Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(gateways) as GatewayId[]).map((id) => {
          const gw = gateways[id];
          return (
            <AppCard key={id} className="p-5 bg-surface-container-low border-outline-variant/30 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center">
                      {GATEWAY_ICONS[id]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{gw.nameAr}</h4>
                      <span className="text-[10px] text-on-surface-variant font-mono">{gw.name}</span>
                    </div>
                  </div>
                  <AppBadge variant={gw.isEnabled ? "success" : "neutral"} size="sm" dot={gw.isEnabled}>
                    {gw.isEnabled ? "مفعلة" : "معطلة"}
                  </AppBadge>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{gw.descriptionAr}</p>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleGateway(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gw.isEnabled
                      ? "bg-error/15 text-error hover:bg-error/25"
                      : "bg-primary text-on-primary hover:bg-primary-container"
                  }`}
                >
                  {gw.isEnabled ? "تعطيل البوابة" : "تفعيل البوابة"}
                </button>
                <span className="text-[11px] text-outline font-mono">
                  {gw.isTestMode ? "وضع التجربة (Sandbox)" : "وضع الإنتاج الحي"}
                </span>
              </div>
            </AppCard>
          );
        })}
      </div>

      {/* Pricing & Platform Commission */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <h4 className="font-bold text-sm text-on-surface">تسعير باقات المنصة والعمولة</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AppInput
            label="سعر اشتراك باقة Pro الشهري (ر.س)"
            type="number"
            value={pricing.proMonthlyPrice}
            onChange={(e) => setPricing({ ...pricing, proMonthlyPrice: Number(e.target.value) })}
          />
          <AppInput
            label="سعر اشتراك باقة Pro السنوي (ر.س)"
            type="number"
            value={pricing.proYearlyPrice}
            onChange={(e) => setPricing({ ...pricing, proYearlyPrice: Number(e.target.value) })}
          />
          <AppInput
            label="نسبة عمولة المنصة من المبيعات (%)"
            type="number"
            value={pricing.storeCommissionRate}
            onChange={(e) => setPricing({ ...pricing, storeCommissionRate: Number(e.target.value) })}
          />
        </div>
      </AppCard>

      {/* Recent Transactions Table */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-on-surface">سجل المعاملات والاشتراكات الأخيرة</h4>
          <span className="text-xs text-on-surface-variant font-mono">{transactions.length} عمليات مسجلة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
              <tr>
                <th className="py-2.5 px-3 font-bold">رقم العملية</th>
                <th className="py-2.5 px-3 font-bold">العميل</th>
                <th className="py-2.5 px-3 font-bold">المبلغ</th>
                <th className="py-2.5 px-3 font-bold">البوابة</th>
                <th className="py-2.5 px-3 font-bold">الباقة</th>
                <th className="py-2.5 px-3 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant text-xs">
                    لا توجد عمليات دفع مسجلة بعد. عند اشتراك صناع المحتوى في الباقات المدفوعة، ستظهر العمليات هنا فوراً.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container/30">
                    <td className="py-2.5 px-3 font-mono text-primary">{tx.transactionNumber}</td>
                    <td className="py-2.5 px-3">{tx.customerName}</td>
                    <td className="py-2.5 px-3 font-bold">{tx.amount} {tx.currency}</td>
                    <td className="py-2.5 px-3 font-mono text-on-surface-variant">{tx.gateway}</td>
                    <td className="py-2.5 px-3">{tx.plan}</td>
                    <td className="py-2.5 px-3">
                      <AppBadge variant={tx.status === "COMPLETED" ? "success" : "neutral"} size="sm">
                        {tx.status === "COMPLETED" ? "مكتملة" : "قيد المعالجة"}
                      </AppBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  );
}
