"use client";

import React, { useState, useEffect } from "react";
import { Check, Building2 } from "lucide-react";
import { PayoutProfileDTO } from "../../hooks/useSettingsPayouts";
import { detectBankFromIban, SaudiBank } from "../../constants/saudi-banks";

interface PayoutIbanFormProps {
  profile: PayoutProfileDTO | null;
  onSave: (iban: string, beneficiaryName: string) => Promise<void>;
}

export function PayoutIbanForm({ profile, onSave }: PayoutIbanFormProps) {
  const [iban, setIban] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [detectedBank, setDetectedBank] = useState<SaudiBank | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setIban(profile.iban || "");
      setBeneficiaryName(profile.beneficiaryName || "");
    }
  }, [profile]);

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, "").toUpperCase();
    setIban(val);
    const bank = detectBankFromIban(val);
    setDetectedBank(bank);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(iban, beneficiaryName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل حفظ الآيبان");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30 flex-1"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
        <div>
          <h3 className="font-bold text-on-surface text-base">الحساب البنكي لتحويل الأرباح</h3>
          <p className="text-xs text-on-surface-variant">التحقق المباشر من الآيبان المصرفي السعودي مع بنوك ساما</p>
        </div>
        {profile?.isVerified && (
          <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>IBAN Verified</span>
          </span>
        )}
      </div>

      {error && <div className="p-3 rounded-xl bg-error/10 text-error text-xs font-semibold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">رقم الآيبان الدولي (IBAN)</label>
          <input
            type="text"
            value={iban}
            onChange={handleIbanChange}
            placeholder="SA00 0000 0000 0000 0000 0000"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-mono text-xs text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
            maxLength={24}
            required
          />
          {detectedBank && (
            <p className="text-[11px] text-primary flex items-center gap-1 mt-1 font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{detectedBank.nameAr}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">اسم المستفيد الثلاثي (كما بالبنك)</label>
          <input
            type="text"
            value={beneficiaryName}
            onChange={(e) => setBeneficiaryName(e.target.value)}
            placeholder="مثال: فيصل فهد الشمري"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {isSaving ? "جاري التحقق والحفظ..." : "حفظ بيانات الحساب البنكي"}
        </button>
      </div>
    </form>
  );
}
