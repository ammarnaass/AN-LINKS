"use client";

import React, { useState } from "react";
import { Check, Clock, Save, ShieldCheck } from "lucide-react";
import { AvailabilityRuleInput } from "../types/appointments.types";

interface AvailabilityRulesTabProps {
  initialRules: AvailabilityRuleInput[];
  onSave: (rules: AvailabilityRuleInput[]) => Promise<void>;
}

const DAY_NAMES = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export function AvailabilityRulesTab({ initialRules, onSave }: AvailabilityRulesTabProps) {
  const [rules, setRules] = useState<AvailabilityRuleInput[]>(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const existing = initialRules.find((r) => r.dayOfWeek === i);
      return (
        existing || {
          dayOfWeek: i,
          startTime: "09:00",
          endTime: "17:00",
          slotMinutes: 30,
          isActive: i < 5,
        }
      );
    });
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateRule = (dayIndex: number, field: keyof AvailabilityRuleInput, value: unknown) => {
    setRules((prev) =>
      prev.map((r) => (r.dayOfWeek === dayIndex ? { ...r, [field]: value } : r))
    );
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(rules);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-on-surface">جدول التوفر وساعات العمل الأسبوعية</h4>
          <p className="text-xs text-on-surface-variant">
            حدد الأيام المتاحة وساعات البدء والانتهاء لحساب الفترات الزمنية المتاحة تلقائياً.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all self-start sm:self-auto shadow-sm"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-on-primary" /> تم الحفظ بنجاح
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {isSaving ? "جاري الحفظ..." : "حفظ جدول العمل"}
            </>
          )}
        </button>
      </div>

      <div className="bg-surface-container/40 rounded-2xl border border-outline-variant/20 divide-y divide-outline-variant/15 overflow-hidden">
        {rules.map((rule) => {
          const dayName = DAY_NAMES[rule.dayOfWeek];
          return (
            <div
              key={rule.dayOfWeek}
              className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                rule.isActive ? "bg-transparent" : "bg-surface-container-low/40 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`day-${rule.dayOfWeek}`}
                  checked={rule.isActive}
                  onChange={(e) => updateRule(rule.dayOfWeek, "isActive", e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
                />
                <label
                  htmlFor={`day-${rule.dayOfWeek}`}
                  className="text-xs sm:text-sm font-bold text-on-surface cursor-pointer select-none"
                >
                  {dayName}
                </label>
              </div>

              {rule.isActive ? (
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> من:
                  </span>
                  <input
                    type="time"
                    value={rule.startTime}
                    onChange={(e) => updateRule(rule.dayOfWeek, "startTime", e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-mono"
                  />
                  <span className="text-on-surface-variant">إلى:</span>
                  <input
                    type="time"
                    value={rule.endTime}
                    onChange={(e) => updateRule(rule.dayOfWeek, "endTime", e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-mono"
                  />
                  <span className="text-on-surface-variant mr-2">فترة الحجز:</span>
                  <select
                    value={rule.slotMinutes}
                    onChange={(e) => updateRule(rule.dayOfWeek, "slotMinutes", Number(e.target.value))}
                    className="px-2 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs"
                  >
                    <option value={15}>15 د</option>
                    <option value={30}>30 د</option>
                    <option value={45}>45 د</option>
                    <option value={60}>60 د</option>
                  </select>
                </div>
              ) : (
                <span className="text-xs text-on-surface-variant/70 italic">يوم عطلة (مغلق)</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>تعتمد الجدولة توقيت مكة المكرمة (GMT+3) ويتم حساب الفترات الحرة بدقة ذرية لمنع أي حجز مزدوج.</span>
      </div>
    </div>
  );
}
