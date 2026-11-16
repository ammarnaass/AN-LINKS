import React from "react";
import { AppCard, AppButton } from "@/shared/ui";
import { Search, Filter } from "lucide-react";

export interface InvoicesFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  gatewayFilter: string;
  onGatewayFilterChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const STATUS_OPTS = [
  { v: "all", l: "جميع الحالات" }, { v: "PAID", l: "مدفوعة ومكتملة" }, { v: "PENDING", l: "معلقة / قيد الانتظار" }, { v: "REFUNDED", l: "مسترجعة (Refunded)" }, { v: "FAILED", l: "فاشلة / ملغاة" },
];
const GW_OPTS = [
  { v: "all", l: "جميع بوابات الدفع" }, { v: "mada", l: "مدى (Mada)" }, { v: "apple_pay", l: "Apple Pay" }, { v: "visa_mastercard", l: "بطاقات فيزا وماستركارد" },
  { v: "stc_pay", l: "STC Pay" }, { v: "tamara", l: "تمارا (Tamara)" }, { v: "tabby", l: "تابي (Tabby)" }, { v: "stripe", l: "Stripe" }, { v: "paypal", l: "PayPal" }, { v: "fawry", l: "فوري (Fawry)" },
];

export function InvoicesFilterBar({
  searchTerm, onSearchTermChange, statusFilter, onStatusFilterChange,
  gatewayFilter, onGatewayFilterChange, onSubmit, isLoading = false,
}: InvoicesFilterBarProps) {
  return (
    <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 shadow-sm">
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="البحث برقم الفاتورة، اسم العميل أو بريده..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary">
            {STATUS_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>

          <select value={gatewayFilter} onChange={(e) => onGatewayFilterChange(e.target.value)} className="px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary">
            {GW_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>

        <AppButton type="submit" variant="primary" size="sm" isLoading={isLoading} leftIcon={<Filter className="w-3.5 h-3.5" />}>تصفية</AppButton>
      </form>
    </AppCard>
  );
}
