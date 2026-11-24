"use client";

import React from "react";
import {
  AdminPlatformSettings,
  AdminTransaction,
} from "../types/admin.types";
import { FinancialSubTab } from "../hooks/useAdminFinancials";
import { AdminFinancialsContainer } from "./payments/AdminFinancialsContainer";

export interface AdminPaymentsTabProps {
  settings?: AdminPlatformSettings;
  transactions?: AdminTransaction[];
  onUpdateSettings?: (
    updated: Partial<AdminPlatformSettings>
  ) => Promise<boolean>;
  initialSubTab?: FinancialSubTab;
  hideSubNav?: boolean;
  hideOverviewStats?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

/**
 * Backward-compatible wrapper mounting AdminFinancialsContainer.
 * Accepts legacy optional settings, transactions, and onUpdateSettings props without breaking callers.
 */
export function AdminPaymentsTab({
  initialSubTab = "gateways",
  hideSubNav = false,
  hideOverviewStats = false,
  title,
  subtitle,
  icon,
}: AdminPaymentsTabProps = {}) {
  return (
    <div className="w-full">
      <AdminFinancialsContainer
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
