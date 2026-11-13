"use client";

import React from "react";
import { AlertTriangle, Download } from "lucide-react";

export function DangerZoneTab() {
  const handleDeleteAccount = () => {
    if (confirm("هل أنت متأكد تماماً من رغبتك في حذف الحساب نهائياً؟ هذا الإجراء لا يمكن الرجوع عنه.")) {
      alert("يرجى التواصل مع الدعم الفني لتأكيد الحذف النهائي لحسابك.");
    }
  };

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-error/30">
      <div className="flex items-center gap-3 text-error pb-3 border-b border-error/20">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-bold text-base">منطقة الإجراءات الحساسة والخطرة</h3>
          <p className="text-xs text-on-surface-variant">العمليات هنا نهائية ولا يمكن التراجع عنها لاحقاً</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-on-surface">تصدير كافة بيانات الحساب والروابط</h4>
            <p className="text-xs text-on-surface-variant">
              تنزيل ملف بصيغة JSON أو CSV يحتوي على كافة الروابط والإحصاءات وسجل الحساب.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>تصدير البيانات</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-error-container/10 border border-error/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-error">حذف الحساب نهائياً</h4>
            <p className="text-xs text-on-surface-variant">
              سيتم حذف صفحتك العامة وكافة الروابط والإحصاءات بشكل دائم من الخوادم.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-bold transition self-start sm:self-auto"
          >
            حذف الحساب نهائياً
          </button>
        </div>
      </div>
    </section>
  );
}

