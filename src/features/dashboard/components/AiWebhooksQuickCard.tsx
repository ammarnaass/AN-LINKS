"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Webhook, ArrowLeft, Bot, CheckCircle2 } from "lucide-react";

export function AiWebhooksQuickCard() {
  const [aiGenerations, setAiGenerations] = useState(12);
  const [webhookConfigured, setWebhookConfigured] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings/ai").then((r) => r.json()).catch(() => null),
      fetch("/api/settings/webhooks").then((r) => r.json()).catch(() => null),
    ]).then(([aiData, whData]) => {
      if (aiData?.success && aiData.data?.totalGenerations) {
        setAiGenerations(aiData.data.totalGenerations);
      }
      if (whData?.success && whData.data?.url) {
        setWebhookConfigured(true);
      }
    });
  }, []);

  return (
    <div className="bg-surface-container-low/90 rounded-2xl p-4 lg:p-5 border border-outline-variant/30 shadow-md hover:border-primary/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-on-surface">أدوات الذكاء الاصطناعي والأتمتة</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              2026 Ready
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            صياغة البايو والروابط بنموذج Gemini وربط الأحداث مع Make و Zapier
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-on-surface font-mono">{aiGenerations}</span>
            <span>توليد</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant">
            <Webhook className="w-3.5 h-3.5 text-secondary" />
            {webhookConfigured ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> متصل
              </span>
            ) : (
              <span className="text-on-surface-variant">غير مهيأ</span>
            )}
          </div>
        </div>

        <Link
          href="/dashboard/settings?tab=ai-webhooks"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow hover:opacity-90 transition shrink-0"
        >
          <span>الإعدادات والعدادات</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
