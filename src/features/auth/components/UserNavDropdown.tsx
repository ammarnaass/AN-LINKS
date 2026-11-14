"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  User,
  Shield,
  LayoutDashboard,
  Palette,
  Settings,
  ExternalLink,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useCurrentUser, clearAuthCache } from "../hooks/useCurrentUser";

export function UserNavDropdown() {
  const { user, isAdmin } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const displayName = user.name || user.username || "المستخدم";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-right font-cairo" dir="rtl" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant/60 transition-all cursor-pointer group shadow-sm"
      >
        <div className="relative flex items-center justify-center">
          {user.image ? (
            <img
              src={user.image}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40 group-hover:ring-primary transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary ring-2 ring-primary/40 group-hover:ring-primary flex items-center justify-center font-bold text-xs transition-all">
              {userInitial}
            </div>
          )}

          {isAdmin && (
            <span
              title="مدير النظام"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-error text-white rounded-full flex items-center justify-center shadow-md ring-2 ring-surface"
            >
              <Shield className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        <div className="hidden md:flex flex-col text-right pr-0.5 leading-tight">
          <span className="text-xs font-bold text-on-surface truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[10px] text-on-surface-variant font-mono" dir="ltr">
            @{user.username || "user"}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 mr-0.5 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/40 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Header */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                    {userInitial}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-on-surface truncate">{displayName}</p>
                <p className="text-xs text-on-surface-variant truncate font-mono" dir="ltr">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container/40 text-error border border-error/30 text-[11px] font-bold">
                  <Shield className="w-3 h-3 shrink-0" />
                  <span>مدير النظام (Admin)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container/40 text-primary border border-primary/20 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>حساب عميل (Client)</span>
                </span>
              )}
              {user.username && (
                <span className="text-[11px] text-outline font-mono" dir="ltr">
                  @{user.username}
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-error-container/15 hover:bg-error-container/30 text-error font-bold text-xs border border-error/20 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>لوحة المشغّل (الإدارة المركزية)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-error/20 text-error font-mono">
                  ADMIN
                </span>
              </Link>
            )}

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-on-surface hover:bg-surface-container hover:text-primary text-xs font-semibold transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
              <span>لوحة التحكم (الروابط)</span>
            </Link>

            <Link
              href="/dashboard/appearance"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-on-surface hover:bg-surface-container hover:text-primary text-xs font-semibold transition-all"
            >
              <Palette className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
              <span>تخصيص المظهر والهوية</span>
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-on-surface hover:bg-surface-container hover:text-primary text-xs font-semibold transition-all"
            >
              <Settings className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
              <span>إعدادات الحساب</span>
            </Link>

            {user.username && (
              <Link
                href={`/${user.username}`}
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-xs font-medium transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 shrink-0" />
                  <span>معاينة صفحتي العامة</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-outline-variant/30 my-1" />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              clearAuthCache();
              signOut({ callbackUrl: "/login" });
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-error hover:bg-error-container/20 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
}
