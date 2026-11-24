"use client";

import React from "react";
import { AdminSubscriptionsContainer } from "./subscriptions/AdminSubscriptionsContainer";
import { SubscriptionSubTab } from "./subscriptions/SubscriptionsSubTabNav";

export interface AdminSubscriptionsTabProps {
  initialSubTab?: SubscriptionSubTab;
}

export function AdminSubscriptionsTab({
  initialSubTab = "plans",
}: AdminSubscriptionsTabProps = {}) {
  return (
    <div className="w-full">
      <AdminSubscriptionsContainer initialSubTab={initialSubTab} />
    </div>
  );
}
