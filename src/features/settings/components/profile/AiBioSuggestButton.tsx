"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";

interface AiBioSuggestButtonProps {
  displayName?: string;
  currentBio?: string;
  onSuggest: (suggestedBio: string) => void;
}

export function AiBioSuggestButton({
  displayName,
  currentBio,
  onSuggest,
}: AiBioSuggestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setVariants([]);
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "bio_suggest",
          niche: displayName || "صانع محتوى محترف",
          currentBio,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.data) {
        if (data.data.bio) onSuggest(data.data.bio);
        if (Array.isArray(data.data.options) && data.data.options.length > 0) {
          setVariants(data.data.options);
          setIsOpen(true);
        }
      }
    } catch {
      // Graceful error fallback
    } finally {
      setLoading(false);
    }
  };

  const handlePickVariant = (text: string) => {
    onSuggest(text);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition disabled:opacity-50 cursor-pointer"
        title="توليد نبذة تعريفية احترافية مدعومة بنموذج Gemini"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        <span>صياغة بالذكاء الاصطناعي ✨</span>
      </button>

      {isOpen && variants.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-80 max-w-[90vw] p-3 rounded-2xl bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/30 shadow-2xl z-30 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant pb-1 border-b border-outline-variant/20">
            <span>اختر النبذة الأنسب لصفحتك:</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:text-on-surface text-xs"
            >
              ✕
            </button>
          </div>
          {variants.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePickVariant(v)}
              className="w-full text-right p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs leading-relaxed transition flex items-start gap-2 border border-outline-variant/20"
            >
              <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>{v}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
