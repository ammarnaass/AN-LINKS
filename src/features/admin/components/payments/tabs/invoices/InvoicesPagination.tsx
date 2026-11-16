import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface InvoicesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
}

export function InvoicesPagination({
  currentPage, totalPages, totalRecords, isLoading = false, onPageChange,
}: InvoicesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
      <span>إجمالي السجلات: <b className="text-on-surface">{totalRecords}</b></span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="font-mono">{currentPage} / {totalPages}</span>
        <button
          type="button"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
