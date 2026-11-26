"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AiLinkSuggestButtonProps {
  url: string;
  onSuggest: (suggestedTitle: string) => void;
}

export function AiLinkSuggestButton({ url, onSuggest }: AiLinkSuggestButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!url || !url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "link_suggest", url: url.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.data?.title) {
        onSuggest(data.data.title);
      }
    } catch {
      // Fallback gracefully on network error
    } finally {
      setLoading(false);
    }
  };

  if (!url || url.trim().length < 4) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleSuggest}
      disabled={loading}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
      title="اقتراح عنوان ذكي للرابط بالذكاء الاصطناعي"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3 text-primary" />
      )}
      <span>اقتراح ذكي بالـ AI ✨</span>
    </button>
  );
}
