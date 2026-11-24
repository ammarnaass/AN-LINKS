"use client";

import React from "react";
import { FileText } from "lucide-react";
import { InvoiceDTO } from "../../hooks/useSettingsSubscription";

interface SubscriptionInvoicesTableProps {
  invoices: InvoiceDTO[];
  onSelectInvoice: (inv: InvoiceDTO) => void;
}

export function SubscriptionInvoicesTable({
  invoices,
  onSelectInvoice,
}: SubscriptionInvoicesTableProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <h3 className="font-bold text-on-surface text-base">سجل الفواتير الضريبية</h3>
          <p className="text-xs text-on-surface-variant">فواتير الاشتراكات والمدفوعات الإلكترونية الصادرة لحسابك</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="py-6 text-center text-xs text-on-surface-variant">لا توجد فواتير صادرة بعد</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 text-on-surface-variant">
                <th className="pb-3 font-semibold">رقم الفاتورة</th>
                <th className="pb-3 font-semibold">تاريخ الإصدار</th>
                <th className="pb-3 font-semibold">المبلغ الإجمالي</th>
                <th className="pb-3 font-semibold">الحالة</th>
                <th className="pb-3 font-semibold text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container/50 transition">
                  <td className="py-3 font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                  <td className="py-3 text-on-surface font-mono">{new Date(inv.createdAt).toLocaleDateString("ar-SA")}</td>
                  <td className="py-3 font-mono font-bold text-on-surface">
                    {inv.amountTotal.toFixed(2)} {inv.currency}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      مدفوعة ✓
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectInvoice(inv)}
                      className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-[11px] font-semibold flex items-center gap-1 mx-auto transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>عرض وطباعة</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
