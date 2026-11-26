"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Users, Send, ArrowLeft, TrendingUp } from "lucide-react";

export function NewsletterDashboardCard() {
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings/subscribers")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.subscribers)) {
          setSubscribersCount(json.subscribers.length);
        }
      })
      .catch(() => {});

    fetch("/api/settings/newsletter")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.newsletter) {
          setNewsletterEnabled(json.newsletter.newsletterEnabled !== false);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-surface-container-low/90 rounded-2xl p-4 lg:p-5 border border-outline-variant/30 shadow-md hover:border-primary/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <Mail className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-on-surface">إدارة النشرة البريدية والمشتركين</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                newsletterEnabled
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {newsletterEnabled ? "مفعلة في صفحة البايو" : "غير مفعلة"}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            اجمع المشتركين وأرسل حملات تسويقية مباشرة لجمهورك
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-on-surface font-mono">{subscribersCount}</span>
            <span>مشترك نشط</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold font-mono">100%</span>
            <span>جاهزية</span>
          </div>
        </div>

        <Link
          href="/dashboard/newsletter"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow hover:opacity-90 transition shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>فتح الاستوديو وإرسال حملة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
