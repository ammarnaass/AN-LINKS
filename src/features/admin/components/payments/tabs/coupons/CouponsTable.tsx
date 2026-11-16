import React from "react";
import { AdminCouponItem } from "../../../../types/admin.types";
import { AppCard } from "@/shared/ui";
import { Calendar, Users, Copy, Check, Trash2 } from "lucide-react";

export interface CouponsTableProps {
  coupons: AdminCouponItem[];
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  togglingId: string | null;
  onToggle: (id: string) => void;
  deletingId: string | null;
  onDelete: (id: string, code: string) => void;
}

export function CouponsTable({
  coupons, copiedCode, onCopyCode, togglingId, onToggle, deletingId, onDelete,
}: CouponsTableProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "دائم (بلا تاريخ انتهاء)";
    try {
      return new Date(dateStr).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
    } catch { return dateStr; }
  };

  return (
    <AppCard className="p-0 bg-surface-container-low border-outline-variant/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right text-xs">
          <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
            <tr>
              <th className="py-3 px-4 font-bold">كود الخصم</th>
              <th className="py-3 px-4 font-bold">قيمة الخصم</th>
              <th className="py-3 px-4 font-bold">الاستخدام</th>
              <th className="py-3 px-4 font-bold">فترة الصلاحية</th>
              <th className="py-3 px-4 font-bold">الباقات المشمولة</th>
              <th className="py-3 px-4 font-bold">الحالة</th>
              <th className="py-3 px-4 font-bold text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-primary tracking-wider bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30">{coupon.code}</span>
                    <button type="button" onClick={() => onCopyCode(coupon.code)} className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition cursor-pointer" title="نسخ الكود">
                      {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {coupon.descriptionAr && <p className="text-[11px] text-on-surface-variant mt-1">{coupon.descriptionAr}</p>}
                </td>

                <td className="py-3.5 px-4 font-bold text-on-surface">
                  {coupon.discountType === "PERCENTAGE" ? (
                    <span className="text-emerald-400 font-mono text-sm">{coupon.discountValue}% خصم</span>
                  ) : (
                    <span className="text-primary font-mono text-sm">{coupon.discountValue} ر.س خصم</span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-mono text-on-surface">
                    <Users className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span>{coupon.usedCount}</span><span className="text-on-surface-variant">/</span><span>{coupon.maxUses ?? "∞"}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-outline" /><span>إلى: {formatDate(coupon.validUntil)}</span></div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 flex-wrap max-w-xs">
                    {coupon.applicablePlanSlugs && coupon.applicablePlanSlugs.length > 0 ? (
                      coupon.applicablePlanSlugs.map((slug) => (
                        <span key={slug} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant border border-outline-variant/30">{slug}</span>
                      ))
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">جميع الباقات</span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <button type="button" disabled={togglingId === coupon.id} onClick={() => onToggle(coupon.id)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${coupon.isActive ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/30"}`}>
                    {togglingId === coupon.id ? "..." : coupon.isActive ? "مفعل" : "معطل"}
                  </button>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <button type="button" disabled={deletingId === coupon.id} onClick={() => onDelete(coupon.id, coupon.code)} className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50" title="حذف الكوبون" aria-label="حذف الكوبون">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-on-surface-variant text-xs">لا توجد أكواد خصم منشأة حالياً. انقر على "إنشاء كود خصم جديد" لإضافة قسيمة.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppCard>
  );
}
