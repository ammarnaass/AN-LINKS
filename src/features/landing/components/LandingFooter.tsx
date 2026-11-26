"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo, LanguageSwitcher } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";
import { Check, Loader2 } from "lucide-react";

export function LandingFooter() {
  const { locale } = useTranslation();
  const footer = getLandingContent(locale).footer;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setFeedback("يرجى إدخال بريد إلكتروني صالح");
      return;
    }

    setStatus("loading");
    setFeedback("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "تعذر الاشتراك، يرجى المحاولة لاحقاً");
      }

      setStatus("success");
      setFeedback(data.message || "تم انضمامك للنشرة بنجاح! تفقد بريدك قريباً 🎉");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "حدث خطأ أثناء الاشتراك");
    }
  };

  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-16 pb-12 border-t border-outline-variant/15 text-on-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <BrandLogo href="/" variant="full" size="md" />
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              {footer.description}
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <span className="text-xs font-semibold text-on-surface">{footer.newsletterTitle}</span>
              {status === "success" ? (
                <div className="p-3 rounded-xl bg-primary/15 border border-primary/20 text-primary text-xs font-bold flex items-center gap-2 max-w-sm">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-outline-variant/20"
                      placeholder={footer.newsletterPlaceholder}
                      type="email"
                      required
                      value={email}
                      disabled={status === "loading"}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      type="submit"
                      disabled={status === "loading" || !email}
                    >
                      {status === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{footer.newsletterButton}</span>
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-[11px] text-error font-medium">{feedback}</p>
                  )}
                </form>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface">{footer.productTitle}</span>
            <nav className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a className="hover:text-on-surface transition-colors" href="#features">{footer.features}</a>
              <a className="hover:text-on-surface transition-colors" href="#live-demos">{footer.templates}</a>
              <a className="hover:text-on-surface transition-colors" href="#pricing">{footer.pricing}</a>
              <Link className="hover:text-on-surface transition-colors" href="/pricing">{footer.customDomains}</Link>
              <Link className="hover:text-on-surface transition-colors" href="/features">{footer.analytics}</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface">{footer.resourcesTitle}</span>
            <nav className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a className="hover:text-on-surface transition-colors" href="#faq">{footer.faq}</a>
              <Link className="hover:text-on-surface transition-colors" href="/features">{footer.blog}</Link>
              <Link className="hover:text-on-surface transition-colors" href="/features">{footer.guides}</Link>
              <Link className="hover:text-on-surface transition-colors" href="/features">{footer.api}</Link>
              <Link className="hover:text-on-surface transition-colors" href="/pricing">{footer.contact}</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface">{footer.legalTitle}</span>
            <nav className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <Link className="hover:text-on-surface transition-colors" href="/privacy">{footer.privacy}</Link>
              <Link className="hover:text-on-surface transition-colors" href="/terms">{footer.terms}</Link>
              <Link className="hover:text-on-surface transition-colors" href="/security">{footer.security}</Link>
            </nav>
            <div className="flex items-center gap-3 mt-4">
              <a aria-label="Community" className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </a>
              <a aria-label="Global Web" className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
              <a aria-label="Feed" className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">rss_feed</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p className="text-outline">{footer.rights}</p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="minimal" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span>{footer.status}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
