"use client";

import React, { useState } from "react";
import { ShoppingBag, Heart, CheckCircle2, Download, Loader2 } from "lucide-react";
import { DigitalProductItem } from "../types/bio.types";

interface BioDigitalStoreCardProps {
  username: string;
  products: DigitalProductItem[];
  accentColor?: string | null;
  isPreview?: boolean;
}

/**
 * Interactive Digital Products & Tip Jar storefront embedded cleanly on creator Bio pages.
 */
export function BioDigitalStoreCard({
  username,
  products,
  accentColor = "#4edea3",
  isPreview = false,
}: BioDigitalStoreCardProps) {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    productId: string;
    message: string;
    deliveryUrl?: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!products || products.length === 0) return null;

  const effectiveAccent = accentColor || "#4edea3";

  const handleCheckout = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    setError(null);

    if (isPreview) {
      setReceipt({ productId, message: "وضع المعاينة: تمت المحاكاة بنجاح!" });
      setActiveProductId(null);
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch(`/api/bio/${encodeURIComponent(username)}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, buyerEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "تعذر إتمام العملية");
        return;
      }
      setReceipt({
        productId,
        message: data.message,
        deliveryUrl: data.deliveryUrl,
      });
      setActiveProductId(null);
      setBuyerEmail("");
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full my-3 space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5" style={{ color: effectiveAccent }} />
          <span>المتجر الرقمي والدعم المباشر</span>
        </span>
      </div>

      {products.map((product) => {
        const isTip = product.productType === "TIP";
        const isBuying = activeProductId === product.id;
        const itemReceipt = receipt?.productId === product.id ? receipt : null;

        return (
          <div
            key={product.id}
            className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/50 backdrop-blur-md shadow-lg space-y-3 text-right"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${effectiveAccent}20`, color: effectiveAccent }}
                >
                  {isTip ? <Heart className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">{product.title}</h4>
                  {product.description && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setActiveProductId(isBuying ? null : product.id);
                }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-950 shrink-0 shadow-sm hover:brightness-110 transition"
                style={{ backgroundColor: effectiveAccent }}
              >
                {product.price} {product.currency}
              </button>
            </div>

            {isBuying && (
              <form onSubmit={(e) => handleCheckout(e, product.id)} className="flex gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="أدخل بريدك لاستلام الإيصال والملف..."
                  className="flex-1 bg-surface-container-lowest/85 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary flex items-center gap-1 shrink-0"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>{isTip ? "ادعم" : "شراء"}</span>}
                </button>
              </form>
            )}

            {isBuying && error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}

            {itemReceipt && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{itemReceipt.message}</span>
                </span>
                {itemReceipt.deliveryUrl && (
                  <a
                    href={itemReceipt.deliveryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3 h-3" />
                    <span>تحميل</span>
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
