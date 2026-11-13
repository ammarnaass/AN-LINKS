"use client";

import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink } from "lucide-react";
import { validateLinkInput } from "@/lib/dashboard-actions";

export interface LinkData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
}

interface LinkEditorProps {
  links: LinkData[];
  onLinksChange: (newLinks: LinkData[]) => void;
}

export function LinkEditor({ links, onLinksChange }: LinkEditorProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateLinkInput({ title: newTitle, url: newUrl });
    if (!validation.valid || !validation.normalizedUrl) {
      setError(validation.error || "البيانات المدخلة غير صحيحة");
      return;
    }

    const newLink: LinkData = {
      id: `temp-${Date.now()}`,
      title: validation.title!,
      url: validation.normalizedUrl,
      isActive: true,
      position: links.length,
    };

    onLinksChange([...links, newLink]);
    setNewTitle("");
    setNewUrl("");
  };

  const handleToggleActive = (id: string) => {
    onLinksChange(
      links.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l))
    );
  };

  const handleDelete = (id: string) => {
    onLinksChange(
      links
        .filter((l) => l.id !== id)
        .map((l, idx) => ({ ...l, position: idx }))
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const updated = [...links];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    onLinksChange(updated.map((item, idx) => ({ ...item, position: idx })));
  };

  return (
    <div className="space-y-6">
      {/* Add Link Form */}
      <form onSubmit={handleAddLink} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          <span>إضافة رابط جديد</span>
        </h3>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="عنوان الرابط (مثال: متجري)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="الرابط (مثال: mystore.com)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            dir="ltr"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
        >
          حفظ وإضافة
        </button>
      </form>

      {/* Links List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">روابطك الحالية ({links.length})</h3>

        {links.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 text-sm">
            لم تقم بإضافة أي روابط بعد. أضف أول رابط من النموذج أعلاه.
          </div>
        ) : (
          links.map((link, idx) => (
            <div
              key={link.id}
              className={`p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                link.isActive ? "bg-white border-gray-200 shadow-sm" : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm truncate">{link.title}</span>
                  {!link.isActive && (
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      مخفي
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate font-mono mt-0.5" dir="ltr">
                  {link.url}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  title="تحريك لأعلى"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === links.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  title="تحريك لأسفل"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Toggle Active */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(link.id)}
                  className={`p-1.5 rounded-lg transition ${
                    link.isActive ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-200"
                  }`}
                  title={link.isActive ? "إخفاء الرابط" : "إظهار الرابط"}
                >
                  {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="حذف الرابط"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
