"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Shield, ChevronDown, User } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { UserNavMenu } from "./UserNavMenu";

export function UserNavDropdown() {
  const { user, isAdmin, isLoading } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
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

  // Reset img error state if user changes
  useEffect(() => {
    setImgError(false);
  }, [user?.image]);

  // Loading skeleton state during auth resolution
  if (isLoading && !user) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-surface-container-high" />
        <div className="hidden md:block w-16 h-3 bg-surface-container-high rounded" />
      </div>
    );
  }

  // Unauthenticated fallback with clickable login button
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full sm:rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary/40 text-on-surface text-xs font-bold transition-all shadow-sm group"
        title="تسجيل الدخول إلى حسابك"
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
          <User className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline">تسجيل الدخول</span>
      </Link>
    );
  }

  const displayName = user.name || user.username || "المستخدم";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-right font-cairo" dir="rtl" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="قائمة الحساب"
        className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant/60 transition-all cursor-pointer group shadow-sm select-none"
      >
        <div className="relative flex items-center justify-center shrink-0">
          {user.image && !imgError ? (
            <img
              src={user.image}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40 group-hover:ring-primary transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-2 ring-primary/40 group-hover:ring-primary flex items-center justify-center font-bold text-xs transition-all shadow-inner">
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
        <UserNavMenu
          user={user}
          isAdmin={isAdmin}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
