"use client";

import React from "react";
import { AdminSubscriptionsTab } from "../AdminSubscriptionsTab";

export function AdminCouponsTab() {
  return (
    <div className="w-full">
      <AdminSubscriptionsTab initialSubTab="coupons" />
    </div>
  );
}
