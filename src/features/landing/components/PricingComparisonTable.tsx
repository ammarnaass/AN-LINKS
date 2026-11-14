import React from "react";
import { Check, X } from "lucide-react";
import { COMPARISON_FEATURES } from "../constants/pricing-plans";

export function PricingComparisonTable() {
  const categories = Array.from(new Set(COMPARISON_FEATURES.map((f) => f.category)));

  const renderCell = (val: boolean | string) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-4 h-4 text-primary mx-auto stroke-[2.5]" />
      ) : (
        <X className="w-4 h-4 text-outline/40 mx-auto" />
      );
    }
    return <span className="text-xs text-on-surface font-semibold">{val}</span>;
  };

  return (
    <div className="pt-16 pb-12 max-w-5xl mx-auto px-4">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
          مقارنة تفصيلية شاملة بين الخطط
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          نظرة شفافة على كافة الإمكانيات والصلاحيات المتاحة في كل فئة
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-surface-container/40 shadow-xl">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-surface-container-high/60 text-xs sm:text-sm text-on-surface">
              <th className="py-4 px-6 font-bold w-2/5">الميزة والخدمة</th>
              <th className="py-4 px-4 font-bold text-center w-1/5">المجانية</th>
              <th className="py-4 px-4 font-bold text-center text-primary w-1/5">المحترف</th>
              <th className="py-4 px-4 font-bold text-center w-1/5">الوكالات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, cIdx) => (
              <React.Fragment key={cIdx}>
                <tr className="bg-surface-container-highest/30">
                  <td colSpan={4} className="py-2.5 px-6 text-[11px] font-bold text-primary tracking-wider uppercase">
                    {cat}
                  </td>
                </tr>
                {COMPARISON_FEATURES.filter((f) => f.category === cat).map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-white/5 hover:bg-white/[0.02] text-xs transition-colors"
                  >
                    <td className="py-3.5 px-6 text-on-surface-variant font-medium">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">{renderCell(row.free)}</td>
                    <td className="py-3.5 px-4 text-center bg-primary/[0.02]">{renderCell(row.pro)}</td>
                    <td className="py-3.5 px-4 text-center">{renderCell(row.agency)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

