"use client";

import React, { useState } from "react";
import { Users, Copy, Check, ShieldCheck, Clock, Percent } from "lucide-react";
import { AffiliateSummaryDTO } from "../../hooks/useSettingsPayouts";

interface AffiliateReferralCardProps {
  affiliate: AffiliateSummaryDTO | null;
}

export function AffiliateReferralCard({ affiliate }: AffiliateReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const referralLink = affiliate?.referralLink || "";
  const referralCode = affiliate?.referralCode || "";

  const handleCopyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers or if clipboard permission is denied
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-on-surface text-base">برنامج التسويق بالعمولة لصناع المحتوى</h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            شارك رابطك الخاص واحصل على 20% عمولة متكررة شهرياً عن كل مشترك جديد
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold font-mono">
            كودك: {referralCode || "..."}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
            20% عمولة متكررة
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-on-surface block">
          رابط الإحالة المباشر الخاص بك
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            dir="ltr"
            value={referralLink}
            placeholder="https://anlinks.dev/?ref=..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-mono focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={!referralLink}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              copied
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span>المشتركون المحالون</span>
            <Users className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-xl font-black text-on-surface font-mono">
            {affiliate?.totalReferrals ?? 0}
          </div>
          <span className="text-[10px] text-on-surface-variant block">مشترك مسجل</span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span>نسبة العمولة</span>
            <Percent className="w-3.5 h-3.5 text-secondary" />
          </div>
          <div className="text-xl font-black text-secondary font-mono">
            {affiliate?.commissionRate ?? 20}%
          </div>
          <span className="text-[10px] text-on-surface-variant block">شهرياً مدى الحياة</span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span>أرباح قيد الضمان</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-500 font-mono">
            {(affiliate?.escrowBalance ?? 0).toFixed(2)}
          </div>
          <span className="text-[10px] text-on-surface-variant block">ضمان 30 يوماً</span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span>أرباح معتمدة</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-500 font-mono">
            {(affiliate?.clearedBalance ?? 0).toFixed(2)}
          </div>
          <span className="text-[10px] text-on-surface-variant block">جاهزة في رصيدك</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 text-[11px] text-on-surface-variant leading-relaxed">
        💡 <strong className="text-on-surface">آلية فترة الأمان والضمان:</strong> تخضع عمولات الاشتراكات الجديدة لفترة حجز أمان مدتها 30 يوماً للوقاية من طلبات استرجاع المبالغ البنكية، ثم يتم تحويلها تلقائياً إلى رصيدك المتاح للسحب والمطالبة عبر الحساب البنكي.
      </div>
    </div>
  );
}
