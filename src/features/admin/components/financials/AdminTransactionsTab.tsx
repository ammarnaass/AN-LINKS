"use client";

import React from "react";
import { AdminPaymentsTab } from "../AdminPaymentsTab";

export function AdminTransactionsTab() {
  return (
    <div className="w-full">
      <AdminPaymentsTab initialSubTab="transactions" />
    </div>
  );
}
