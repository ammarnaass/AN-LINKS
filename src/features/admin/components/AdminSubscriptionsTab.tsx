"use client";

import React from "react";
import { AdminSubscriptionsContainer } from "./subscriptions/AdminSubscriptionsContainer";
import { SubscriptionSubTab } from "./subscriptions/SubscriptionsSubTabNav";

export interface AdminSubscriptionsTabProps {
  initialSubTab?: SubscriptionSubTab;
  hideSubNav?: boolean;
  hideOverviewStats?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AdminSubscriptionsTab({
  initialSubTab = "plans",
  hideSubNav = false,
  hideOverviewStats = false,
  title,
  subtitle,
  icon,
}: AdminSubscriptionsTabProps = {}) {
  return (
    <div className="w-full">
      <AdminSubscriptionsContainer
        initialSubTab={initialSubTab}
        hideSubNav={hideSubNav}
        hideOverviewStats={hideOverviewStats}
        title={title}
        subtitle={subtitle}
        icon={icon}
      />
    </div>
  );
}
