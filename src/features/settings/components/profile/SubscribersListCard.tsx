"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Download, Users, ExternalLink } from "lucide-react";
import { AppButton } from "@/shared/ui";

interface SubscriberItem {
  id: string;
  email: string;
  name?: string | null;
  source?: string | null;
  createdAt: string;
}

/**
 * Displays the creator's collected Bio newsletter leads and provides 1-click CSV export.
 */
export function SubscribersListCard() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/subscribers")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.subscribers)) {
          setSubscribers(data.subscribers);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleExportCsv = () => {
    window.open("/api/settings/subscribers?format=csv", "_blank");
  };

  return (
    <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span>مشتركو النشرة البريدية</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary">
                {subscribers.length}
              </span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              قائمة جهات الاتصال المجمّعة مباشرة من بطاقة الاشتراك في صفحتك العامة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/settings?tab=newsletter"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition"
          >
            <span>استوديو النشرة المتقدم</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={subscribers.length === 0}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            تصدير CSV
          </AppButton>
        </div>
      </div>

      {isLoading ? (
        <div className="h-24 rounded-2xl bg-surface-container-high/40 animate-pulse" />
      ) : subscribers.length === 0 ? (
        <div className="p-6 rounded-2xl bg-surface-container-lowest/50 border border-dashed border-outline-variant/30 text-center space-y-1.5">
          <Mail className="w-5 h-5 text-on-surface-variant mx-auto opacity-60" />
          <p className="text-xs font-semibold text-on-surface-variant">
            لا يوجد مشتركون مسجلون بعد
          </p>
          <p className="text-[11px] text-outline">
            عندما يشترك زوار صفحتك في نموذج النشرة البريدية، ستظهر بياناتهم هنا ويمكنك تصديرها.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container-high/60 text-on-surface-variant">
              <tr>
                <th className="py-2.5 px-4 font-semibold">البريد الإلكتروني</th>
                <th className="py-2.5 px-4 font-semibold">الاسم</th>
                <th className="py-2.5 px-4 font-semibold">تاريخ الاشتراك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.slice(0, 10).map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 font-mono text-on-surface" dir="ltr">
                    {sub.email}
                  </td>
                  <td className="py-2.5 px-4 text-on-surface-variant">
                    {sub.name || "—"}
                  </td>
                  <td className="py-2.5 px-4 text-on-surface-variant">
                    {new Date(sub.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
