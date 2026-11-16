"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Globe } from "lucide-react";

export interface AdminSidebarFooterProps {
  isCollapsedView: boolean;
}

export function AdminSidebarFooter({ isCollapsedView }: AdminSidebarFooterProps) {
  const linkBaseClass = `flex items-center rounded-xl text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all ${
    isCollapsedView ? "w-12 h-10 mx-auto justify-center px-0" : "gap-2.5 px-3 py-2"
  }`;

  return (
    <div className={`${isCollapsedView ? "p-2" : "p-3"} border-t border-outline-variant/15 space-y-1`}>
      {isCollapsedView ? (
        <div className="my-2 border-t border-outline-variant/15" aria-hidden="true" />
      ) : (
        <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">
          التنقل السريع
        </div>
      )}
      <Link href="/dashboard" title="لوحة صانع المحتوى" aria-label="لوحة صانع المحتوى" className={linkBaseClass}>
        <LayoutDashboard className="w-4 h-4 shrink-0 text-primary" />
        {!isCollapsedView && <span>لوحة صانع المحتوى</span>}
      </Link>
      <Link href="/" title="الموقع الرئيسي" aria-label="الموقع الرئيسي" className={linkBaseClass}>
        <Globe className="w-4 h-4 shrink-0 text-secondary" />
        {!isCollapsedView && <span>الموقع الرئيسي</span>}
      </Link>
    </div>
  );
}
