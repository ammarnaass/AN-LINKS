"use client";

import React from "react";
import { AdminPaymentsTab } from "../AdminPaymentsTab";

export function AdminCurrenciesTab() {
  return (
    <div className="w-full">
      <AdminPaymentsTab initialSubTab="currencies" />
    </div>
  );
}
