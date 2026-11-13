"use client";

import React from "react";
import { SettingsTab } from "../types/settings.types";

interface SettingsTabsNavProps {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
}

export function SettingsTabsNav({ activeTab, onSelectTab }: SettingsTabsNavProps) {
  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/30">
      <button
        type="button"
        onClick={() => onSelectTab("profile")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
          activeTab === "profile"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">badge</span>
        <span>الملف الشخصي والبيانات العامة</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("subscription")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
          activeTab === "subscription"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
        <span>خطة الاشتراك والفواتير</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("payouts")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
          activeTab === "payouts"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
        <span>تحصيل الأرباح وبوابات الدفع</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("security")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
          activeTab === "security"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">shield_person</span>
        <span>الأمان وتسجيل الدخول</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab("danger")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
          activeTab === "danger"
            ? "bg-error-container/30 text-error shadow-sm"
            : "text-error/80 hover:bg-error-container/20"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
        <span>منطقة الخطر</span>
      </button>
    </nav>
  );
}
