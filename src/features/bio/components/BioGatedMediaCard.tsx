"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock, Play, ExternalLink, ShieldCheck } from "lucide-react";

export interface BioGatedMediaCardProps {
  product: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    currency: string;
    fileUrl?: string | null;
  };
  username: string;
  onOpenCheckout?: (product: any) => void;
}

export function BioGatedMediaCard({
  product,
  username,
  onOpenCheckout,
}: BioGatedMediaCardProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local entitlement token
    const token = typeof window !== "undefined"
      ? localStorage.getItem(`anlinks_media_token_${product.id}`)
      : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch("/api/bio/unlock-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.unlocked) {
          setIsUnlocked(true);
          setMediaUrl(data.mediaUrl);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [product.id]);

  if (isLoading) {
    return (
      <div className="w-full p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/20 animate-pulse h-28" />
    );
  }

  if (isUnlocked) {
    return (
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-on-surface shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Unlock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 block">تم فك القفل بنجاح</span>
              <h4 className="text-sm font-bold text-on-surface">{product.title}</h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            مرخص لك
          </span>
        </div>

        {product.description && (
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            {product.description}
          </p>
        )}

        {mediaUrl && (
          <div className="mt-2">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-md"
            >
              <Play className="w-4 h-4" />
              مشاهدة وتحميل المحتوى الحصري
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-surface-container/80 border border-outline-variant/25 hover:border-primary/40 transition-all text-on-surface shadow-sm relative overflow-hidden group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                محتوى مقفل
              </span>
              <span className="text-xs font-extrabold text-primary">
                {product.price} {product.currency}
              </span>
            </div>
            <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              {product.title}
            </h4>
            {product.description && (
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between">
        <span className="text-[11px] text-on-surface-variant">
          يفتح فوراً بعد إتمام الدفع
        </span>
        <button
          type="button"
          onClick={() => onOpenCheckout?.(product)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <Lock className="w-3.5 h-3.5" />
          شراء وفتح المحتوى
        </button>
      </div>
    </div>
  );
}
