"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle, BrandLogo, LanguageSwitcher } from "@/shared/ui";
import { LandingHeaderProps } from "../types/landing.types";
import { useCurrentUser, UserNavDropdown } from "@/features/auth";
import { DashboardPlanBadge } from "@/features/dashboard";
import { useTranslation } from "@/shared/i18n";
import { LayoutDashboard, Shield } from "lucide-react";

export function LandingHeader({ onOpenAuth }: LandingHeaderProps = {}) {
  const { isAuthenticated, isLoading, isAdmin } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/15 text-on-surface">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <BrandLogo href="/" variant="full" size="md" />

          <nav className="hidden lg:flex items-center gap-1">
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#features">
              {t("nav.features")}
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#live-demos">
              {t("nav.liveDemos")}
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#pricing">
              {t("nav.pricing")}
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#testimonials">
              {t("nav.testimonials")}
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#faq">
              {t("nav.faq")}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-error bg-error-container/25 hover:bg-error-container/40 border border-error/30 px-3 py-2 rounded-xl transition-all"
                  title="لوحة تحكم مدير النظام"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>لوحة الإدارة</span>
                </Link>
              )}
              <DashboardPlanBadge />
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-on-primary-container bg-primary-container hover:bg-primary hover:text-on-primary px-3.5 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t("nav.dashboard")}</span>
              </Link>
              <UserNavDropdown />
            </div>
          ) : isLoading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-20 h-9 rounded-xl bg-surface-container-high/60 hidden sm:block" />
              <div className="w-24 h-9 rounded-xl bg-primary-container/40" />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-on-surface px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-on-primary-container bg-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>{t("nav.startFree")}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
