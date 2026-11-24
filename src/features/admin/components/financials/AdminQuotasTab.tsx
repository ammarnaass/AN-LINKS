"use client";

import React from "react";
import { AdminSubscriptionsTab } from "../AdminSubscriptionsTab";

export function AdminQuotasTab() {
  return (
    <div className="w-full">
      <AdminSubscriptionsTab initialSubTab="quotas" />
    </div>
  );
}
