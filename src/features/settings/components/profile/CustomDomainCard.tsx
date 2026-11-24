"use client";

import React, { useState, useEffect } from "react";
import { DnsInstructionsBox } from "./DnsInstructionsBox";

interface DomainData {
  customDomain: string | null;
  domainVerified: boolean;
  verificationToken: string | null;
  domainVerifiedAt: string | null;
  instructions?: {
    cname: { type: string; name: string; target: string };
    txt: { type: string; name: string; value: string };
  };
}

export function CustomDomainCard() {
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchDomainData = async () => {
    try {
      const res = await fetch("/api/profile/custom-domain");
      const json = await res.json();
      if (json.success && json.data) {
        setDomainData(json.data);
        if (json.data.customDomain) {
          setDomainInput(json.data.customDomain);
        }
      }
    } catch {
      // silently fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainData();
  }, []);

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/profile/custom-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput }),
      });
      const json = await res.json();

      if (json.success) {
        setStatusMessage({ text: json.message, isError: false });
        await fetchDomainData();
      } else {
        setStatusMessage({ text: json.error || "فشل حفظ النطاق", isError: true });
      }
    } catch {
      setStatusMessage({ text: "حدث خطأ في الاتصال بالخادم", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/profile/custom-domain", { method: "PUT" });
      const json = await res.json();

      if (json.success && json.verified) {
        setStatusMessage({ text: json.message, isError: false });
        await fetchDomainData();
      } else {
        setStatusMessage({ text: json.error || "لم يكتمل نشر سجلات DNS بعد", isError: true });
      }
    } catch {
      setStatusMessage({ text: "حدث خطأ أثناء فحص سجلات DNS", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("هل أنت متأكد من رغبتك في إزالة النطاق المخصص؟")) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/profile/custom-domain", { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        setDomainInput("");
        setStatusMessage({ text: "تمت إزالة النطاق بنجاح", isError: false });
        await fetchDomainData();
      } else {
        setStatusMessage({ text: json.error || "فشل إزالة النطاق", isError: true });
      }
    } catch {
      setStatusMessage({ text: "حدث خطأ في الاتصال بالخادم", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }

  const hasDomain = Boolean(domainData?.customDomain);
  const isVerified = Boolean(domainData?.domainVerified);

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">language</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">النطاق المخصص (Custom Domain)</h3>
            <p className="text-xs text-on-surface-variant">
              اربط صفحة روابطك باسم نطاقك أو موقعك الخاص لتعزيز هويتك التجارية
            </p>
          </div>
        </div>

        {hasDomain && (
          <div>
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                مُفعّل ونشط
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                بانتظار التحقق من DNS
              </span>
            )}
          </div>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border ${
            statusMessage.isError
              ? "bg-error-container/20 text-error border-error-container/40"
              : "bg-primary/10 text-primary border-primary/20"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {!hasDomain ? (
        <form onSubmit={handleSaveDomain} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              اسم النطاق أو النطاق الفرعي
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="links.mybrand.com أو mybrand.sa"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                dir="ltr"
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:border-primary font-mono"
              />
              <button
                type="submit"
                disabled={isSubmitting || !domainInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-105 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "جاري الحفظ..." : "ربط النطاق"}
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5">
              يمكنك ربط دومين فرعي مثل `links.example.com` أو دومين رئيسي مثل `example.com`.
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 gap-3">
            <div>
              <span className="text-[11px] text-on-surface-variant block mb-0.5">النطاق المرتبط:</span>
              <span className="text-sm font-mono font-bold text-on-surface" dir="ltr">
                {domainData?.customDomain}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!isVerified && (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:brightness-105 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "جاري الفحص..." : "التحقق من DNS"}
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-error hover:bg-error-container/20 text-xs font-bold transition-all"
              >
                حذف النطاق
              </button>
            </div>
          </div>

          {!isVerified && (
            <DnsInstructionsBox verificationToken={domainData?.verificationToken} />
          )}
        </div>
      )}
    </div>
  );
}
