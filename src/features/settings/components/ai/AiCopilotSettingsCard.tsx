"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Bot, Check, Loader2, Play } from "lucide-react";
import { ALLOWED_AI_TONES, AiTone } from "../../validators/ai-settings.validator";

const TONE_LABELS: Record<AiTone, string> = {
  professional: "احترافي ومحفز",
  creative: "إبداعي وجريء",
  direct: "مباشر وموجز",
  technical: "تقني ودقيق",
};

export function AiCopilotSettingsCard() {
  const [tone, setTone] = useState<AiTone>("professional");
  const [niche, setNiche] = useState("صانع محتوى محترف");
  const [autoSuggestTitle, setAutoSuggestTitle] = useState(true);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [quotaInfo, setQuotaInfo] = useState<{ model: string; allowed: boolean; planName: string }>({
    model: "Gemini 2.5 Flash",
    allowed: false,
    planName: "الباقة الحالية",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Playground state
  const [testInput, setTestInput] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/ai")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setTone(json.data.tone || "professional");
          setNiche(json.data.niche || "صانع محتوى محترف");
          setAutoSuggestTitle(json.data.autoSuggestTitle !== false);
          setTotalGenerations(json.data.totalGenerations ?? 0);
        }
        if (json.quota) {
          setQuotaInfo({
            model: json.quota.model || "Gemini 2.5 Flash",
            allowed: Boolean(json.quota.allowed),
            planName: json.quota.planName || "الباقة الحالية",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, niche, autoSuggestTitle }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: json.message });
      } else {
        setMessage({ type: "error", text: json.error || "فشل الحفظ" });
      }
    } catch {
      setMessage({ type: "error", text: "حدث خطأ أثناء الاتصال بالخادم" });
    } finally {
      setSaving(false);
    }
  };

  const handlePlaygroundTest = async () => {
    if (!testInput.trim()) return;
    setPlaygroundLoading(true);
    setTestResult(null);
    try {
      const isUrl = testInput.startsWith("http://") || testInput.startsWith("https://");
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isUrl
            ? { mode: "link_suggest", url: testInput.trim() }
            : { mode: "bio_suggest", niche: testInput.trim() }
        ),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(
          data.data?.title ||
            data.data?.bio ||
            data.title ||
            data.suggestions?.[0] ||
            "تم التوليد بنجاح"
        );
        setTotalGenerations((prev) => prev + 1);
      } else {
        setTestResult(data.error || "تعذر تشغيل المساعد في باقتك الحالية");
      }
    } catch {
      setTestResult("تعذر الاتصال بنموذج الذكاء الاصطناعي");
    } finally {
      setPlaygroundLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-outline-variant/30">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">مساعد الذكاء الاصطناعي (AI Copilot)</h3>
            <p className="text-xs text-on-surface-variant">تخصيص النبرة وصياغة الروابط والبايو بنموذج {quotaInfo.model}</p>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
        <div className="space-y-1">
          <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span>إجمالي التوليدات</span>
          </span>
          <p className="text-base font-bold text-on-surface font-mono">{totalGenerations} طلب</p>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] text-on-surface-variant font-medium">نموذج الذكاء الاصطناعي</span>
          <p className="text-sm font-bold text-primary font-mono">{quotaInfo.model}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] text-on-surface-variant font-medium">حالة الحصة</span>
          <p className={`text-sm font-bold ${quotaInfo.allowed ? "text-emerald-400" : "text-amber-400"}`}>
            {quotaInfo.allowed ? `مفعل (${quotaInfo.planName})` : `يتطلب ترقية (${quotaInfo.planName})`}
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${message.type === "success" ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-on-surface-variant">نبرة صياغة المحتوى المفضلة (Tone):</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ALLOWED_AI_TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  tone === t ? "bg-primary text-on-primary border-primary shadow-sm" : "bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high"
                }`}
              >
                <span>{TONE_LABELS[t]}</span>
                {tone === t && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">مجال صناعة المحتوى الافتراضي (Niche):</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        <label className="flex items-center gap-2 p-3 rounded-xl bg-surface-container border border-outline-variant/20 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={autoSuggestTitle}
            onChange={(e) => setAutoSuggestTitle(e.target.checked)}
            className="rounded text-primary focus:ring-primary/40"
          />
          <span className="text-on-surface font-medium">تفعيل الاقتراح التلقائي لعنوان الرابط عند إضافته</span>
        </label>

        {/* Live Playground */}
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/30 space-y-2">
          <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-primary" /> مختبر الذكاء الاصطناعي التجريبي (Live Tester)
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="اكتب فكرة أو الصق رابطاً لتجربة اقتراح الـ AI..."
              className="flex-1 bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs text-on-surface outline-none"
            />
            <button
              type="button"
              onClick={handlePlaygroundTest}
              disabled={playgroundLoading || !testInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
            >
              {playgroundLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "جرّب"}
            </button>
          </div>
          {testResult && (
            <div className="p-2.5 rounded-lg bg-surface-container-high border border-primary/20 text-xs text-primary font-medium">
              💡 النتيجة: {testResult}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-outline-variant/20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow hover:opacity-90 disabled:opacity-50 transition"
          >
            {saving ? "جاري الحفظ..." : "حفظ تفضيلات الـ AI"}
          </button>
        </div>
      </form>
    </div>
  );
}
