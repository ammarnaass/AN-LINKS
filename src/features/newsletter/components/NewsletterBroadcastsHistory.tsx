"use client";

import React from "react";
import { History, Send, CheckCircle2 } from "lucide-react";
import { NewsletterBroadcastItem } from "../types/newsletter.types";

interface NewsletterBroadcastsHistoryProps {
  broadcasts: NewsletterBroadcastItem[];
  onOpenNewBroadcast: () => void;
}

export function NewsletterBroadcastsHistory({
  broadcasts,
  onOpenNewBroadcast,
}: NewsletterBroadcastsHistoryProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">
              سجل الحملات البريدية المرسلة
            </h4>
            <p className="text-[11px] text-on-surface-variant">
              الأرشيف الكامل للرسائل الجماعية التي أرسلتها لمشتركيك
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewBroadcast}
          className="px-3 py-1.5 rounded-xl bg-primary/15 text-primary text-xs font-bold hover:bg-primary/25 transition flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>حملة جديدة</span>
        </button>
      </div>

      {broadcasts.length === 0 ? (
        <div className="p-6 rounded-2xl bg-surface-container-lowest/50 border border-dashed border-outline-variant/30 text-center space-y-1.5">
          <Send className="w-5 h-5 text-on-surface-variant mx-auto opacity-50" />
          <p className="text-xs font-semibold text-on-surface-variant">
            لم ترسل أي حملات بريدية بعد
          </p>
          <p className="text-[11px] text-outline">
            اضغط على &ldquo;حملة جديدة&rdquo; للتواصل المباشر مع متابعيك وإرسال أحدث الأخبار والعروض.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-outline-variant/15 border border-outline-variant/20 rounded-2xl overflow-hidden bg-surface-container-lowest/50">
          {broadcasts.map((bc) => (
            <div
              key={bc.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-surface-container transition"
            >
              <div className="space-y-1 truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface truncate">
                    {bc.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>تم الإرسال</span>
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-1">
                  {bc.content}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-on-surface-variant shrink-0 self-end sm:self-center">
                <span className="font-medium text-[11px]">
                  {bc.sentCount.toLocaleString("ar-SA")} مستلم
                </span>
                <span className="text-[10px] text-outline">
                  {new Date(bc.sentAt || bc.createdAt).toLocaleDateString("ar-SA", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
