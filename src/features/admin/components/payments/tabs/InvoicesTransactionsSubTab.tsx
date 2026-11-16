"use client";

import React, { useState } from "react";
import { AdminTransactionsResult, AdminTransactionsQuery } from "../../../types/admin.types";
import { AppCard } from "@/shared/ui";
import { InvoicesFilterBar } from "./invoices/InvoicesFilterBar";
import { InvoicesTable } from "./invoices/InvoicesTable";
import { InvoicesPagination } from "./invoices/InvoicesPagination";

export interface InvoicesTransactionsSubTabProps {
  transactions: AdminTransactionsResult | null;
  onFilterChange?: (query: AdminTransactionsQuery) => void;
  isLoading?: boolean;
}

export function InvoicesTransactionsSubTab({
  transactions,
  onFilterChange,
  isLoading = false,
}: InvoicesTransactionsSubTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");

  const items = transactions?.items || [];
  const currentPage = transactions?.page || 1;
  const totalPages = transactions?.totalPages || 1;
  const totalRecords = transactions?.total || items.length;

  const handleApplyFilter = (page: number = 1) => {
    if (!onFilterChange) return;
    onFilterChange({
      page,
      status: statusFilter === "all" ? undefined : statusFilter,
      gateway: gatewayFilter === "all" ? undefined : gatewayFilter,
      search: searchTerm.trim() || undefined,
    } as AdminTransactionsQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyFilter(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    handleApplyFilter(newPage);
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      <InvoicesFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        gatewayFilter={gatewayFilter}
        onGatewayFilterChange={setGatewayFilter}
        onSubmit={handleSearchSubmit}
        isLoading={isLoading}
      />

      <AppCard className="p-0 bg-surface-container-low border-outline-variant/30 overflow-hidden shadow-sm">
        <InvoicesTable items={items} isLoading={isLoading} />
        <InvoicesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </AppCard>
    </div>
  );
}

export { InvoicesFilterBar, InvoicesTable, InvoicesPagination };
