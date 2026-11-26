"use client";

import React, { useState, useEffect } from "react";
import { Webhook, Send, Key, Copy, Check, Trash2, RefreshCw } from "lucide-react";

interface WebhookDeliveryLog {
  id: string;
  event: string;
  status: string;
  responseCode: number | null;
  attempts: number;
}

const AVAILABLE_EVENTS = [
  { id: "lead.collected", label: "جمع بيانات مشترك جديد (Lead)" },
  { id: "order.completed", label: "شراء منتج رقمي (Order Paid)" },
  { id: "booking.confirmed", label: "تأكيد حجز استشارة (Booking Confirmed)" },
];

export function CreatorWebhooksCard() {
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["lead.collected", "order.completed"]);
  const [secret, setSecret] = useState<string>("");
  const [, setDeliveries] = useState<WebhookDeliveryLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchWebhook();
  }, []);

  const fetchWebhook = async () => {
    try {
      const res = await fetch("/api/settings/webhooks");
      const json = await res.json();
      if (json.success && json.data) {
        setUrl(json.data.url || "");
        setEvents(json.data.events || []);
        setSecret(json.data.secretEncrypted || "");
        setDeliveries(json.data.deliveries || []);
      }
    } catch {
      // ignore network errors on load
    }
  };

  const handleToggleEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, events }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: json.message || "تم حفظ إعدادات الويب بنجاح" });
        if (json.data?.secretEncrypted) setSecret(json.data.secretEncrypted);
      } else {
        setMessage({ type: "error", text: json.error || "فشل حفظ إعدادات الويب" });
      }
    } catch {
      setMessage({ type: "error", text: "خطأ في الاتصال بالخادم" });
    } finally {
      setSaving(false);
    }
  };

  const handlePing = async () => {
    setPinging(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ping" }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: json.message });
        fetchWebhook();
      } else {
        setMessage({ type: "error", text: json.error || "فشل إرسال التجربة" });
      }
    } catch {
      setMessage({ type: "error", text: "فشل الاتصال بالخادم لإرسال الاختبار" });
    } finally {
      setPinging(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف تكوين خطاف الويب؟")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      const json = await res.json();
      if (json.success) {
        setUrl("");
        setSecret("");
        setDeliveries([]);
        setMessage({ type: "success", text: "تم حذف خطاف الويب" });
      }
    } catch {
      setMessage({ type: "error", text: "تعذر الحذف" });
    } finally {
      setSaving(false);
    }
  };

  const copySecret = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-outline-variant/30">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Webhook className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">خطافات الويب الخارجية (Webhooks)</h3>
            <p className="text-xs text-on-surface-variant">ربط فوري لأحداث صفحتك مع Make أو Zapier أو n8n بتوقيع HMAC-SHA256</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${message.type === "success" ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">عنوان الرابط الخارجي (Webhook Endpoint URL)</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://hook.eu1.make.com/..."
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-on-surface-variant">الأحداث المشترك بها (Events Trigger):</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {AVAILABLE_EVENTS.map((ev) => (
              <label key={ev.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 cursor-pointer hover:bg-surface-container-high transition text-xs">
                <input
                  type="checkbox"
                  checked={events.includes(ev.id)}
                  onChange={() => handleToggleEvent(ev.id)}
                  className="rounded text-primary focus:ring-primary/40"
                />
                <span className="text-on-surface font-medium">{ev.label}</span>
              </label>
            ))}
          </div>
        </div>

        {secret && (
          <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-primary" /> مفتاح التوقيع المشفر (HMAC Secret)
              </span>
              <button type="button" onClick={copySecret} className="text-primary hover:underline flex items-center gap-1 font-bold">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "تم النسخ" : "نسخ المفتاح"}</span>
              </button>
            </div>
            <code className="block text-[11px] font-mono text-on-surface-variant break-all" dir="ltr">
              {secret}
            </code>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow hover:opacity-90 disabled:opacity-50 transition"
            >
              {saving ? "جاري الحفظ..." : "حفظ التفعيل"}
            </button>
            {url && (
              <button
                type="button"
                onClick={handlePing}
                disabled={pinging || saving}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs hover:bg-surface-container-highest disabled:opacity-50 transition flex items-center gap-1.5 border border-outline-variant/30"
              >
                {pinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-primary" />}
                <span>إرسال تجربة فحص (Ping)</span>
              </button>
            )}
          </div>
          {secret && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-xl transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
