"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

interface BioNewsletterCardProps {
  username: string;
  displayName: string;
  accentColor?: string | null;
  buttonClass?: string;
  isPreview?: boolean;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
}

export function BioNewsletterCard({
  username,
  displayName,
  accentColor = "#3B82F6",
  buttonClass = "",
  isPreview = false,
  title,
  subtitle,
  buttonText,
}: BioNewsletterCardProps) {
  const effectiveAccent = accentColor || "#3B82F6";
  const effectiveTitle = title?.trim() || `النشرة البريدية لـ ${displayName}`;
  const effectiveSubtitle = subtitle?.trim() || "احصل على أحدث المحتوى والعروض الحصرية أولاً بأول";
  const effectiveButtonText = buttonText?.trim() || "اشتراك";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isPreview) {
      if (isPreview) setIsSuccess(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/bio/${encodeURIComponent(username)}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setEmail("");
      } else {
        setErrorMessage(data.error || "تعذر الاشتراك، يرجى المحاولة لاحقاً");
      }
    } catch {
      setErrorMessage("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full my-3 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md flex items-center gap-3 text-emerald-400 animate-fadeIn">
        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
        <div className="text-xs">
          <p className="font-bold">تم الاشتراك بنجاح!</p>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">شكراً لانضمامك إلى {effectiveTitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-3 p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/50 backdrop-blur-md shadow-lg flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-on-surface">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${effectiveAccent}25`, color: effectiveAccent }}
        >
          <Mail className="w-4 h-4" />
        </div>
        <div className="text-right flex-1">
          <h4 className="text-xs font-bold text-on-surface">{effectiveTitle}</h4>
          <p className="text-[10px] text-on-surface-variant">{effectiveSubtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل بريدك الإلكتروني..."
          disabled={isLoading}
          className="flex-1 bg-surface-container-lowest/80 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shrink-0 shadow-sm ${buttonClass}`}
          style={{ backgroundColor: effectiveAccent }}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <span>{effectiveButtonText}</span>
          )}
        </button>
      </form>

      {errorMessage && (
        <p className="text-[10px] text-red-400 font-medium text-right mt-0.5">{errorMessage}</p>
      )}
    </div>
  );
}
