"use client";

import React from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import { BrandLogo } from "@/shared/ui";
import { DashboardSidebarNav } from "./DashboardSidebarNav";

export interface DashboardSidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isAdmin?: boolean;
  username?: string;
}

export function DashboardSidebar({
  currentPath,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  isAdmin = false,
  username,
}: DashboardSidebarProps) {
  const renderSidebarContent = (isCollapsedView: boolean) => (
    <div
      className="flex flex-col h-full bg-surface-container-lowest border-l border-outline-variant/20 font-cairo"
      dir="rtl"
    >
      <div
        className={`border-b border-outline-variant/15 flex ${
          isCollapsedView
            ? "p-3 flex-col items-center gap-3 justify-center"
            : "p-4 items-center justify-between"
        }`}
      >
        {isCollapsedView ? (
          <Link
            href="/dashboard"
            title="AN LINKS"
            aria-label="AN LINKS"
            className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          >
            <Link2 className="w-5 h-5 text-primary" />
          </Link>
        ) : (
          <BrandLogo href="/dashboard" variant="minimal" size="sm" />
        )}

        {onCloseMobile && !isCollapsedView && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="إغلاق القائمة"
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors items-center justify-center cursor-pointer"
            title={isCollapsedView ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
            aria-label={isCollapsedView ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
          >
            {isCollapsedView ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <DashboardSidebarNav
        currentPath={currentPath}
        isCollapsedView={isCollapsedView}
        onCloseMobile={onCloseMobile}
        isAdmin={isAdmin}
        username={username}
      />
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block ${
          isCollapsed ? "w-20" : "w-64 xl:w-72"
        } shrink-0 h-screen sticky top-0 z-30 transition-all duration-300`}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden font-cairo" dir="rtl">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-surface-container-lowest shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
