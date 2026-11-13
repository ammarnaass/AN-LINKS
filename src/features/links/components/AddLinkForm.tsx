"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { CATEGORIES } from "../constants/categories";
import { validateLinkInput } from "../validators/link.validator";
import { LinkData } from "../types/links.types";

interface AddLinkFormProps {
  onAdd: (newLink: LinkData) => void;
  onCancel: () => void;
  existingCount: number;
}

export function AddLinkForm({ onAdd, onCancel, existingCount }: AddLinkFormProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("link");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateLinkInput({ title: newTitle, url: newUrl });
    if (!validation.valid || !validation.normalizedUrl) {
      setError(validation.error || "البيانات المدخلة غير صحيحة");
      return;
    }

    const newLink: LinkData = {
      id: `link-${Date.now()}`,
      title: validation.title!,
      url: validation.normalizedUrl,
      isActive: true,
      position: existingCount,
      category: newCategory,
      clicks: 0,
    };

    onAdd(newLink);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-surface-container p-5 border border-primary/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">add_link</span>
          <span>بيانات الرابط الجديد</span>
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-on-surface-variant hover:text-on-surface"
        >
          إلغاء
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error-container/20 border border-error/40 text-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            عنوان الرابط
          </label>
          <input
            type="text"
            placeholder="مثال: متجري الإلكتروني للعطور"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            الرابط أو المعرّف
          </label>
          <input
            type="text"
            placeholder="store.example.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            dir="ltr"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
          نوع أو تصنيف الرابط
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setNewCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                newCategory === cat.id
                  ? `${cat.color} ring-1 ring-primary`
                  : "bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-sm shadow-md hover:bg-primary transition-all"
        >
          حفظ الرابط ونشره
        </button>
      </div>
    </form>
  );
}

