"use client";

import React from "react";
import { AdminPaymentsTab } from "../AdminPaymentsTab";

export function AdminGatewaysTab() {
  return (
    <div className="w-full">
      <AdminPaymentsTab initialSubTab="gateways" />
    </div>
  );
}
