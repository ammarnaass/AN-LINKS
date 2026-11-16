import React from "react";
import { AdminTransactionItem } from "../../../../types/admin.types";
import { AppBadge } from "@/shared/ui";
import { Receipt, CreditCard, Download } from "lucide-react";

export interface InvoicesTableProps {
  items: AdminTransactionItem[];
  isLoading?: boolean;
  onDownloadInvoice?: (item: AdminTransactionItem) => void;
}

export function InvoicesTable({ items, isLoading = false, onDownloadInvoice }: InvoicesTableProps) {
  const renderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
      case "SUCCESS":
        return <AppBadge variant="success" size="sm" dot>مدفوعة</AppBadge>;
      case "PENDING":
        return <AppBadge variant="warning" size="sm">قيد الانتظار</AppBadge>;
      case "REFUNDED":
        return <AppBadge variant="neutral" size="sm">مسترجعة</AppBadge>;
      case "FAILED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-error/15 text-error border border-error/30">فاشلة</span>;
      default:
        return <AppBadge variant="neutral" size="sm">{status}</AppBadge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  const handleDownload = (item: AdminTransactionItem) => {
    if (onDownloadInvoice) onDownloadInvoice(item);
    else if (item.pdfUrl) window.open(item.pdfUrl, "_blank");
    else window.print();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-right text-xs">
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
            <tr key={tx.id} className="hover:bg-surface-container/50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                <div className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5 text-primary" /><span>{tx.invoiceNumber}</span></div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-semibold text-on-surface">{tx.customerName}</div>
                <div className="text-[11px] font-mono text-on-surface-variant">{tx.customerEmail}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-mono font-bold text-sm text-on-surface">{tx.amountTotal} {tx.currency}</div>
                {tx.discountAmount > 0 && <span className="text-[10px] text-emerald-400 font-mono">(خصم {tx.discountAmount} {tx.currency})</span>}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5 font-mono text-on-surface"><CreditCard className="w-3.5 h-3.5 text-on-surface-variant" /><span>{tx.gatewayCode}</span></div>
              </td>
              <td className="py-3.5 px-4">{renderStatusBadge(tx.status)}</td>
              <td className="py-3.5 px-4 text-[11px] text-on-surface-variant font-mono">{formatDate(tx.createdAt)}</td>
              <td className="py-3.5 px-4 text-center">
                <button type="button" onClick={() => handleDownload(tx)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer" title="طباعة / تحميل الفاتورة" aria-label="طباعة / تحميل الفاتورة">
                  <Download className="w-3.5 h-3.5 text-primary" /><span>PDF</span>
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={7} className="py-10 text-center text-on-surface-variant text-xs">{isLoading ? "جاري تحميل سجل الفواتير والمعاملات..." : "لا توجد فواتير أو معاملات مسجلة مطابقة لمعايير البحث."}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
