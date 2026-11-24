"use client";

import React, { useState } from "react";
import { AlertTriangle, Download, FileSpreadsheet, FileJson } from "lucide-react";

export function DangerZoneTab() {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: "json" | "csv") => {
    setIsExporting(format);
    window.location.href = `/api/settings/export?format=${format}`;
    setTimeout(() => setIsExporting(null), 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm("هل أنت متأكد تماماً من رغبتك في حذف الحساب نهائياً؟ هذا الإجراء لا يمكن الرجوع عنه.")) {
      alert("تم استلام طلبك. حفاظاً على أمان بياناتك، سيتم مراجعة الطلب من قِبل إدارة الأمان خلال 24 ساعة.");
    }
  };

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-error/30">
      <div className="flex items-center gap-3 text-error pb-3 border-b border-error/20">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-bold text-base">منطقة الإجراءات الحساسة والخطرة</h3>
          <p className="text-xs text-on-surface-variant">العمليات هنا نهائية وتتعلق بحفظ وتصدير أو إنهاء بياناتك</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Data Portability (PDPL & GDPR) */}
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-on-surface">تصدير كافة بيانات الحساب والروابط (Data Portability)</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              تنزيل نسخة احتياطية رسمية مطابقة لمعايير خصوصية البيانات تشمل كافة الروابط، الحسابات، والإحصاءات.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleExport("json")}
              disabled={isExporting !== null}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition flex items-center gap-2 border border-outline-variant/30"
              title="تصدير كملف JSON كامل"
            >
              <FileJson className="w-4 h-4 text-primary" />
              <span>{isExporting === "json" ? "جاري التجهيز..." : "JSON"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport("csv")}
              disabled={isExporting !== null}
              className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition flex items-center gap-2 border border-outline-variant/30"
              title="تصدير كملف إكسل CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{isExporting === "csv" ? "جاري التجهيز..." : "CSV (Excel)"}</span>
            </button>
          </div>
        </div>

        {/* Account Deletion */}
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

