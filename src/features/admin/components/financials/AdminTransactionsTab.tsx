"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { AdminPaymentsTab } from "../AdminPaymentsTab";

export function AdminTransactionsTab() {
  return (
    <div className="w-full">
      <AdminPaymentsTab
        initialSubTab="transactions"
        hideSubNav={true}
        icon={<Receipt className="w-4 h-4" />}
        title="سجل العمليات المالية والفواتير"
        subtitle="متابعة الإيرادات والتحصيلات، الفواتير الصادرة للمشتركين، وسجل المعاملات والمدفوعات"
      />
    </div>
  );
}
