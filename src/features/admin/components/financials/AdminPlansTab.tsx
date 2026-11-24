"use client";

import React from "react";
import { AdminSubscriptionsTab } from "../AdminSubscriptionsTab";

export function AdminPlansTab() {
  return (
    <div className="w-full">
      <AdminSubscriptionsTab initialSubTab="plans" />
    </div>
  );
}
