"use client";

import React from "react";

interface LinkInlineEditProps {
  editTitle: string;
  setEditTitle: (val: string) => void;
  editUrl: string;
  setEditUrl: (val: string) => void;
  error: string | null;
  onCancel: () => void;
  onSave: () => void;
}

export function LinkInlineEdit({
  editTitle,
  setEditTitle,
  editUrl,
  setEditUrl,
  error,
  onCancel,
  onSave,
}: LinkInlineEditProps) {
  return (
    <div className="rounded-xl p-4 bg-surface-container border border-primary/40 shadow-md space-y-3">
      {error && <p className="text-xs text-error">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="عنوان الرابط"
          className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface text-sm"
        />
        <input
          type="text"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          placeholder="https://..."
          dir="ltr"
          className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface text-sm text-right"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs text-on-surface-variant hover:text-on-surface transition"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition"
        >
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}
