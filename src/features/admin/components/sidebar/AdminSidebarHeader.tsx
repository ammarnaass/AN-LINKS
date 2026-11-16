"use client";

import React from "react";
import Link from "next/link";
import { Shield, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminSidebarHeaderProps {
  isCollapsedView: boolean;
  onCloseMobile?: () => void;
  onToggleCollapse?: () => void;
}

export function AdminSidebarHeader({ isCollapsedView, onCloseMobile, onToggleCollapse }: AdminSidebarHeaderProps) {
  const containerClass = isCollapsedView
    ? "p-3 flex-col items-center gap-3 justify-center"
    : "p-5 items-center justify-between";
  const linkClass = `flex items-center group ${isCollapsedView ? "justify-center" : "gap-3"}`;
  const iconWrapClass = `w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 ${isCollapsedView ? "mx-auto" : ""}`;

  return (
    <div className={`border-b border-outline-variant/15 flex ${containerClass}`}>
      <Link href="/admin" className={linkClass} title="روابط | AN LINKS" aria-label="روابط | AN LINKS">
        <div className={iconWrapClass}>
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className={isCollapsedView ? "hidden" : "flex flex-col"}>
          <span className="font-black text-sm text-on-surface tracking-tight">روابط | AN LINKS</span>
          <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-wider">Console المشغّل والمدير</span>
        </div>
      </Link>
      {onCloseMobile && !isCollapsedView && (
        <button type="button" onClick={onCloseMobile} aria-label="إغلاق القائمة" className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      )}
      {onToggleCollapse && (
        <button type="button" onClick={onToggleCollapse} className="hidden lg:flex p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors items-center justify-center cursor-pointer" title={isCollapsedView ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"} aria-label={isCollapsedView ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}>
          {isCollapsedView ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
