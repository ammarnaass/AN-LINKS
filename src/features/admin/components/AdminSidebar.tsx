"use client";

import React from "react";
import { AdminTabKey } from "./AdminNavTabs";
import {
  AdminSidebarHeader,
  AdminSidebarNavList,
  AdminSidebarFooter,
} from "./sidebar";

export interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onTabChange: (tab: AdminTabKey) => void;
  usersCount?: number;
  sessionsCount?: number;
  pendingReportsCount?: number;
  linksCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  usersCount = 0,
  sessionsCount = 0,
  pendingReportsCount = 0,
  linksCount = 0,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const renderSidebarContent = (isCollapsedView: boolean) => (
    <div className="flex flex-col h-full bg-surface-container-lowest border-l border-outline-variant/20 font-cairo" dir="rtl">
      <AdminSidebarHeader
        isCollapsedView={isCollapsedView}
        onCloseMobile={onCloseMobile}
        onToggleCollapse={onToggleCollapse}
      />
      <AdminSidebarNavList
        activeTab={activeTab}
        onTabChange={onTabChange}
        isCollapsedView={isCollapsedView}
        onCloseMobile={onCloseMobile}
        usersCount={usersCount}
        sessionsCount={sessionsCount}
        pendingReportsCount={pendingReportsCount}
        linksCount={linksCount}
      />
      <AdminSidebarFooter isCollapsedView={isCollapsedView} />
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block ${
          isCollapsed ? "w-20" : "w-72"
        } shrink-0 h-screen sticky top-0 z-30 transition-all duration-300`}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
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
