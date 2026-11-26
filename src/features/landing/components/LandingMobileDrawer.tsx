"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  LayoutTemplate,
  CreditCard,
  MessageSquare,
  HelpCircle,
  LayoutDashboard,
  Shield,
  LogIn,
  Rocket,
} from "lucide-react";
import { BrandLogo, LanguageSwitcher, ThemeToggle } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useCurrentUser } from "@/features/auth";

export interface LandingMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingMobileDrawer({ isOpen, onClose }: LandingMobileDrawerProps) {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useCurrentUser();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { href: "#features", label: t("nav.features"), icon: Sparkles, color: "text-primary" },
    { href: "#live-demos", label: t("nav.liveDemos"), icon: LayoutTemplate, color: "text-secondary" },
    { href: "#pricing", label: t("nav.pricing"), icon: CreditCard, color: "text-tertiary" },
    { href: "#testimonials", label: t("nav.testimonials"), icon: MessageSquare, color: "text-amber-400" },
    { href: "#faq", label: t("nav.faq"), icon: HelpCircle, color: "text-sky-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true" aria-label="قائمة التنقل الجانبية">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-80 max-w-[85vw] h-full bg-surface-container-lowest/95 backdrop-blur-2xl border-s border-outline-variant/30 flex flex-col p-6 shadow-2xl z-10 transition-transform animate-in slide-in-from-start duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-outline-variant/20">
          <div onClick={onClose} className="cursor-pointer">
            <BrandLogo href="/" variant="full" size="sm" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-2">
          <div className="px-3 text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
            أقسام المنصة
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Language & Theme Controls */}
        <div className="py-4 border-t border-outline-variant/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">المظهر واللغة:</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="minimal" />
            <ThemeToggle />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-outline-variant/20 space-y-2.5">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-error bg-error-container/25 hover:bg-error-container/40 border border-error/30 transition-all shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>لوحة المشغّل (الإدارة المركزية)</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-on-primary-container bg-primary-container hover:bg-primary hover:text-on-primary transition-all shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t("nav.dashboard")}</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-on-surface bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("nav.login")}</span>
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-on-primary-container bg-primary-container hover:bg-primary hover:text-on-primary transition-all shadow-md"
              >
                <Rocket className="w-4 h-4" />
                <span>{t("nav.startFree")}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
