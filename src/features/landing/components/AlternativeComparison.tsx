import React from "react";
import { GLOBAL_ALTERNATIVES_COMPARISON } from "../constants/features-data";
import { Sparkles, Trophy } from "lucide-react";

export function AlternativeComparison() {
  return (
    <section className="py-20 max-w-5xl mx-auto px-4">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>المقارنة الحقيقية</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface">
          لماذا يفضل المبدعون العرب منصة «روابط» على البدائل العالمية؟
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          فارق شاسع في تجربة الاستخدام، سرعة التصفح، والملائمة الحقيقية لاحتياجات صناع المحتوى ورواد الأعمال في الشرق الأوسط.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-surface-container/50 shadow-2xl">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-surface-container-high text-xs sm:text-sm text-on-surface">
              <th className="py-4 px-6 font-bold w-1/3">المعيار والميزة</th>
              <th className="py-4 px-4 font-bold text-center text-primary bg-primary/10 w-1/3">
                <span className="flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>منصة روابط (Rawabet)</span>
                </span>
              </th>
              <th className="py-4 px-4 font-bold text-center text-on-surface-variant w-1/6">Linktree</th>
              <th className="py-4 px-4 font-bold text-center text-on-surface-variant w-1/6">Beacons</th>
            </tr>
          </thead>
          <tbody>
            {GLOBAL_ALTERNATIVES_COMPARISON.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/[0.02] text-xs transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-on-surface">{row.feature}</td>
                <td className="py-4 px-4 text-center font-bold text-primary bg-primary/[0.04]">
                  {row.rawabet}
                </td>
                <td className="py-4 px-4 text-center text-on-surface-variant">{row.linktree}</td>
                <td className="py-4 px-4 text-center text-on-surface-variant">{row.beacons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
