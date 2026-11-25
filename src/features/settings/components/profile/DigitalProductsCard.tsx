"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, Plus, Trash2, Heart } from "lucide-react";
import { AppButton } from "@/shared/ui";

interface CreatorProduct {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  productType: string;
  fileUrl?: string | null;
  isActive: boolean;
  salesCount: number;
}

/**
 * Creator Settings panel for publishing Digital Downloads and Tip Jar items on Bio pages.
 */
export function DigitalProductsCard() {
  const [products, setProducts] = useState<CreatorProduct[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("49");
  const [productType, setProductType] = useState<"DIGITAL" | "TIP">("DIGITAL");
  const [fileUrl, setFileUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: Number(price),
          productType,
          fileUrl: productType === "DIGITAL" ? fileUrl : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "تعذر إضافة المنتج");
        return;
      }
      setProducts((prev) => [data.product, ...prev]);
      setTitle("");
      setFileUrl("");
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-on-surface">المتجر الرقمي وصندوق الدعم (Tip Jar)</h3>
          <p className="text-xs text-on-surface-variant">
            بع كتبك الإلكترونية وقوالبك أو استقبل الدعم المالي المباشر من جمهورك
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value as "DIGITAL" | "TIP")}
          className="sm:col-span-3 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface"
        >
          <option value="DIGITAL">منتج رقمي (ملف/دورة)</option>
          <option value="TIP">دعم مالي (Tip Jar)</option>
        </select>

        <input
          type="text"
          required
          placeholder={productType === "TIP" ? "ادعمني بكوب قهوة ☕" : "عنوان المنتج الرقمي..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="sm:col-span-4 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface"
        />

        <input
          type="number"
          min={1}
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="السعر (SAR)"
          className="sm:col-span-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-mono"
        />

        {productType === "DIGITAL" && (
          <input
            type="url"
            placeholder="رابط تحميل الملف (https://...)"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            dir="ltr"
            className="sm:col-span-9 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface"
          />
        )}

        <div className={productType === "DIGITAL" ? "sm:col-span-3" : "sm:col-span-3"}>
          <AppButton
            type="submit"
            variant="primary"
            size="sm"
            fullWidth
            isLoading={isSaving}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            إضافة للمتجر
          </AppButton>
        </div>
      </form>

      {error && <p className="text-xs text-error font-medium">{error}</p>}

      {products.length > 0 && (
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-lowest/60 border border-white/5 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {p.productType === "TIP" ? (
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                )}
                <span className="font-bold text-on-surface truncate">{p.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-mono text-[11px]">
                  {p.price} {p.currency}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  ({p.salesCount} عملية)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition"
                title="حذف المنتج"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
