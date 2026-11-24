"use client";

import React from "react";
import { X, Printer } from "lucide-react";
import { InvoiceDTO } from "../../hooks/useSettingsSubscription";

interface InvoicePrintModalProps {
  invoice: InvoiceDTO | null;
  onClose: () => void;
}

export function InvoicePrintModal({ invoice, onClose }: InvoicePrintModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-lg w-full p-6 space-y-6 border border-outline-variant/30 shadow-2xl relative text-on-surface">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-on-surface">فاتورة ضريبية مبسطة</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
              مدفوعة بالكامل
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 bg-white text-neutral-900 p-6 rounded-xl shadow border border-neutral-200 text-xs">
          <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-neutral-900">منصة AN LINKS</h2>
              <p className="text-[11px] text-neutral-500">شركة الروابط الرقمية لتقنية المعلومات</p>
              <p className="text-[10px] text-neutral-400 font-mono">الرقم الضريبي: 310123456700003</p>
            </div>
            <div className="text-left font-mono text-xs">
              <p className="font-bold text-neutral-900">{invoice.invoiceNumber}</p>
              <p className="text-neutral-500">{new Date(invoice.createdAt).toLocaleDateString("ar-SA")}</p>
            </div>
          </div>

          <div className="space-y-2 py-2">
            <div className="flex justify-between font-bold border-b border-neutral-100 pb-1 text-neutral-600">
              <span>البند / الخدمة</span>
              <span>المبلغ</span>
            </div>
            <div className="flex justify-between py-1">
              <span>اشتراك باقة AN LINKS للمحترفين</span>
              <span className="font-mono">{invoice.amountSubtotal.toFixed(2)} {invoice.currency}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-emerald-600">
                <span>خصم الكوبون الترويجي</span>
                <span className="font-mono">-{invoice.discountAmount.toFixed(2)} {invoice.currency}</span>
              </div>
            )}
            <div className="flex justify-between py-1 text-neutral-500">
              <span>ضريبة القيمة المضافة (15% VAT)</span>
              <span className="font-mono">{invoice.taxAmount.toFixed(2)} {invoice.currency}</span>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-3 flex justify-between items-center text-sm font-black">
            <span>المبلغ الإجمالي المدفوع:</span>
            <span className="text-base text-neutral-900 font-mono">
              {invoice.amountTotal.toFixed(2)} {invoice.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
