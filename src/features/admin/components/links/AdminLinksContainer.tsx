"use client";

import React, { useState } from "react";
import { Layers, Link2, BarChart3 } from "lucide-react";
import { PlatformsCatalogSubTab } from "./PlatformsCatalogSubTab";
import { LinksModerationSubTab } from "./LinksModerationSubTab";
import { PlatformAnalyticsSubTab } from "./PlatformAnalyticsSubTab";

export type LinksSubTabKey = "platforms" | "moderation" | "analytics";

export interface AdminLinksContainerProps {
  initialSubTab?: LinksSubTabKey;
}

export function AdminLinksContainer({
  initialSubTab = "platforms",
}: AdminLinksContainerProps) {
  const [activeSubTab, setActiveSubTab] = useState<LinksSubTabKey>(initialSubTab);

  const subTabs: Array<{
    key: LinksSubTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      key: "platforms",
      label: "دليل المنصات",
      icon: Layers,
    },
    {
      key: "moderation",
      label: "الإشراف على الروابط ومراجعتها",
      icon: Link2,
    },
    {
      key: "analytics",
      label: "تحليلات المنصات",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Sub-Tabs Navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto no-scrollbar">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSubTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-md"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab View */}
      <div>
        {activeSubTab === "platforms" && <PlatformsCatalogSubTab />}
        {activeSubTab === "moderation" && <LinksModerationSubTab />}
        {activeSubTab === "analytics" && <PlatformAnalyticsSubTab />}
      </div>
    </div>
  );
}
