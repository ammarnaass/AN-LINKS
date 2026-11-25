"use client";

import React from "react";
import { Calendar, Lock, ShieldAlert } from "lucide-react";
import { LinkData } from "../types/links.types";

interface LinkScheduleAndLockPanelProps {
  link: LinkData;
  onUpdate: (updated: LinkData) => void;
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const offsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
}

/**
 * Modular panel inside LinkCardItem allowing creators to configure
 * scheduled start/end dates, PIN protection, and +18 sensitive content warnings.
 */
export function LinkScheduleAndLockPanel({
  link,
  onUpdate,
}: LinkScheduleAndLockPanelProps) {
  return (
    <div className="mt-3 pt-3 border-t border-outline-variant/25 space-y-3 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-on-surface flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>بدء الظهور المجدول (اختياري)</span>
          </label>
          <input
            type="datetime-local"
            value={toDatetimeLocal(link.scheduledStart)}
            onChange={(e) =>
              onUpdate({
                ...link,
                scheduledStart: e.target.value ? new Date(e.target.value).toISOString() : null,
              })
            }
            dir="ltr"
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-on-surface flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>تاريخ الانتهاء التلقائي (اختياري)</span>
          </label>
          <input
            type="datetime-local"
            value={toDatetimeLocal(link.scheduledEnd)}
            onChange={(e) =>
              onUpdate({
                ...link,
                scheduledEnd: e.target.value ? new Date(e.target.value).toISOString() : null,
              })
            }
            dir="ltr"
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
        <div className="space-y-1">
          <label className="font-semibold text-on-surface flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>قفل برمز سري (PIN)</span>
          </label>
          <input
            type="text"
            maxLength={8}
            placeholder="مثال: 1234 (اتركه فارغاً للإلغاء)"
            value={link.pinCode || ""}
            onChange={(e) =>
              onUpdate({
                ...link,
                pinCode: e.target.value.trim() || null,
              })
            }
            dir="ltr"
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-mono"
          />
        </div>

        <label className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-lowest/60 border border-outline-variant/30 cursor-pointer mt-4 sm:mt-5">
          <span className="font-semibold text-on-surface flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>تحذير محتوى حساس (+18)</span>
          </span>
          <input
            type="checkbox"
            checked={Boolean(link.isSensitive)}
            onChange={(e) => onUpdate({ ...link, isSensitive: e.target.checked })}
            className="w-4 h-4 accent-primary rounded"
          />
        </label>
      </div>
    </div>
  );
}
