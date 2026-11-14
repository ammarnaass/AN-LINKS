"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/shared/ui";
import { LandingHeaderProps } from "../types/landing.types";
import { useCurrentUser, UserNavDropdown } from "@/features/auth";
import { LayoutDashboard } from "lucide-react";

export function LandingHeader({ onOpenAuth }: LandingHeaderProps = {}) {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/15 text-on-surface">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
              <span className="material-symbols-outlined text-[24px]">link</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-on-surface tracking-tight leading-tight">روابط</span>
              <span className="text-[11px] text-primary uppercase tracking-widest font-semibold font-mono">Rawabet</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#features">
              المميزات
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#live-demos">
              نماذج حية
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#pricing">
              الأسعار
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#testimonials">
              آراء العملاء
            </a>
            <a className="text-sm px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium" href="#faq">
              الأسئلة الشائعة
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-on-primary-container bg-primary-container hover:bg-primary hover:text-on-primary px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>لوحة التحكم</span>
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
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-on-primary-container bg-primary-container hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>ابدأ مجاناً</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
