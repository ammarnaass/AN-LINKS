"use client";

import React, { useState } from "react";
import {
  AdminTransactionsResult,
  AdminTransactionsQuery,
  AdminTransactionItem,
} from "../../../types/admin.types";
import { AppCard, AppBadge, AppButton } from "@/shared/ui";
import {
  Receipt,
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
} from "lucide-react";

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

  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "PAID":
      case "COMPLETED":
      case "SUCCESS":
        return (
          <AppBadge variant="success" size="sm" dot>
            مدفوعة
          </AppBadge>
        );
      case "PENDING":
        return (
          <AppBadge variant="warning" size="sm">
            قيد الانتظار
          </AppBadge>
        );
      case "REFUNDED":
        return (
          <AppBadge variant="neutral" size="sm">
            مسترجعة
          </AppBadge>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-error/15 text-error border border-error/30">
            فاشلة
          </span>
        );
      default:
        return (
          <AppBadge variant="neutral" size="sm">
            {status}
          </AppBadge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleDownloadInvoice = (item: AdminTransactionItem) => {
    if (item.pdfUrl) {
      window.open(item.pdfUrl, "_blank");
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Search & Filter Bar */}
      <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="البحث برقم الفاتورة، اسم العميل أو بريده..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">جميع الحالات</option>
              <option value="PAID">مدفوعة ومكتملة</option>
              <option value="PENDING">معلقة / قيد الانتظار</option>
              <option value="REFUNDED">مسترجعة (Refunded)</option>
              <option value="FAILED">فاشلة / ملغاة</option>
            </select>

            {/* Gateway Filter */}
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">جميع بوابات الدفع</option>
              <option value="mada">مدى (Mada)</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="visa_mastercard">بطاقات فيزا وماستركارد</option>
              <option value="stc_pay">STC Pay</option>
              <option value="tamara">تمارا (Tamara)</option>
              <option value="tabby">تابي (Tabby)</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="fawry">فوري (Fawry)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <AppButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              تصفية
            </AppButton>
          </div>
        </form>
      </AppCard>

      {/* Invoices Table Card */}
      <AppCard className="p-0 bg-surface-container-low border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
              <tr>
                <th className="py-3 px-4 font-bold">رقم الفاتورة</th>
                <th className="py-3 px-4 font-bold">العميل</th>
                <th className="py-3 px-4 font-bold">المبلغ الإجمالي</th>
                <th className="py-3 px-4 font-bold">بوابة الدفع</th>
                <th className="py-3 px-4 font-bold">الحالة</th>
                <th className="py-3 px-4 font-bold">التاريخ والتوقيت</th>
                <th className="py-3 px-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {items.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-surface-container/50 transition-colors"
                >
                  {/* Invoice Number */}
                  <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-primary" />
                      <span>{tx.invoiceNumber}</span>
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{tx.customerName}</div>
                    <div className="text-[11px] font-mono text-on-surface-variant">
                      {tx.customerEmail}
                    </div>
                  </td>

                  {/* Amount Total */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-sm text-on-surface">
                      {tx.amountTotal} {tx.currency}
                    </div>
                    {tx.discountAmount > 0 && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        (خصم {tx.discountAmount} {tx.currency})
                      </span>
                    )}
                  </td>

                  {/* Gateway */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-on-surface">
                      <CreditCard className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>{tx.gatewayCode}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {renderStatusBadge(tx.status)}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-[11px] text-on-surface-variant font-mono">
                    {formatDate(tx.createdAt)}
                  </td>

                  {/* Actions: Download / Print */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(tx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      title="طباعة / تحميل الفاتورة"
                      aria-label="طباعة / تحميل الفاتورة"
                    >
                      <Download className="w-3.5 h-3.5 text-primary" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-on-surface-variant text-xs"
                  >
                    {isLoading
                      ? "جاري تحميل سجل الفواتير والمعاملات..."
                      : "لا توجد فواتير أو معاملات مسجلة مطابقة لمعايير البحث."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>
              إجمالي السجلات: <b className="text-on-surface">{totalRecords}</b>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </AppCard>
    </div>
  );
}
