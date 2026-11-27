"use client";

import React, { useState, useEffect } from "react";
import { Check, Clock, Save, Globe } from "lucide-react";
import {
  AvailabilityRuleInput,
  AvailabilityExceptionItem,
} from "../types/appointments.types";
import { SUPPORTED_TIMEZONES } from "../utils/timezone";
import { AvailabilityExceptionsCard } from "./AvailabilityExceptionsCard";

interface AvailabilityRulesTabProps {
  initialRules: AvailabilityRuleInput[];
  initialTimezone: string;
  exceptions: AvailabilityExceptionItem[];
  onSave: (rules: AvailabilityRuleInput[], timezone: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function normalizeRules(input: AvailabilityRuleInput[]): AvailabilityRuleInput[] {
  return Array.from({ length: 7 }, (_, i) => {
    const existing = input.find((r) => r.dayOfWeek === i);
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
}

export function AvailabilityRulesTab({
  initialRules,
  initialTimezone,
  exceptions,
  onSave,
  onRefresh,
}: AvailabilityRulesTabProps) {
  const [rules, setRules] = useState<AvailabilityRuleInput[]>(() => normalizeRules(initialRules));
  const [timezone, setTimezone] = useState(initialTimezone || "Asia/Riyadh");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setRules(normalizeRules(initialRules));
  }, [initialRules]);

  useEffect(() => {
    if (initialTimezone) setTimezone(initialTimezone);
  }, [initialTimezone]);

  const updateRule = (dayIndex: number, field: keyof AvailabilityRuleInput, value: unknown) => {
    setRules((prev) =>
      prev.map((r) => (r.dayOfWeek === dayIndex ? { ...r, [field]: value } : r))
    );
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(rules, timezone);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-on-surface">جدول ساعات العمل والمنطقة الزمنية</h4>
          <p className="text-xs text-on-surface-variant">
            يُحوّل النظام تلقائياً ساعات عملك لأي زائر حول العالم مع احترام التوقيت الصيفي والشتوي.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-transparent text-on-surface font-medium focus:outline-none"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-surface-container">
                  {tz.labelAr}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> تم الحفظ
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {isSaving ? "جاري الحفظ..." : "حفظ الجدول"}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-surface-container/40 rounded-2xl border border-outline-variant/25 divide-y divide-outline-variant/15 overflow-hidden">
        {rules.map((rule) => (
          <div
            key={rule.dayOfWeek}
            className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              rule.isActive ? "" : "bg-surface-container-low/40 opacity-70"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`day-${rule.dayOfWeek}`}
                checked={rule.isActive}
                onChange={(e) => updateRule(rule.dayOfWeek, "isActive", e.target.checked)}
                className="w-4 h-4 rounded text-primary border-outline-variant"
              />
              <label
                htmlFor={`day-${rule.dayOfWeek}`}
                className="text-xs sm:text-sm font-bold text-on-surface cursor-pointer"
              >
                {DAY_NAMES[rule.dayOfWeek]}
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
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface font-mono"
                />
                <span className="text-on-surface-variant">إلى:</span>
                <input
                  type="time"
                  value={rule.endTime}
                  onChange={(e) => updateRule(rule.dayOfWeek, "endTime", e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface font-mono"
                />
                <span className="text-on-surface-variant mr-1">فاصل:</span>
                <select
                  value={rule.slotMinutes}
                  onChange={(e) => updateRule(rule.dayOfWeek, "slotMinutes", Number(e.target.value))}
                  className="px-2 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface"
                >
                  <option value={15}>15 د</option>
                  <option value={30}>30 د</option>
                  <option value={45}>45 د</option>
                  <option value={60}>60 د</option>
                </select>
              </div>
            ) : (
              <span className="text-xs text-on-surface-variant/70 italic">مغلق (يوم راحة)</span>
            )}
          </div>
        ))}
      </div>

      <AvailabilityExceptionsCard exceptions={exceptions} onRefresh={onRefresh} />
    </div>
  );
}
