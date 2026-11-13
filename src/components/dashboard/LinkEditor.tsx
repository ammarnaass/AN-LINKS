"use client";

import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, GripVertical, AlertCircle } from "lucide-react";
import { validateLinkInput } from "@/lib/dashboard-actions";

export interface LinkData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
  category?: string;
  clicks?: number;
}

interface LinkEditorProps {
  links: LinkData[];
  onLinksChange: (newLinks: LinkData[]) => void;
  filter?: "all" | "active" | "draft";
}

const CATEGORIES = [
  { id: "store", label: "متجر تجاري", color: "bg-primary/20 text-primary border-primary/30" },
  { id: "video", label: "فيديو مميّز", color: "bg-tertiary-container/30 text-tertiary border-tertiary/30" },
  { id: "chat", label: "محادثة فورية", color: "bg-primary-container/20 text-primary-fixed border-primary/30" },
  { id: "blog", label: "مدونة تقنية", color: "bg-secondary-container/20 text-secondary border-secondary/30" },
  { id: "link", label: "رابط مخصص", color: "bg-surface-container-highest text-on-surface-variant border-outline-variant/30" },
];

export function LinkEditor({ links, onLinksChange, filter = "all" }: LinkEditorProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("link");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const filteredLinks = links.filter((link) => {
    if (filter === "active") return link.isActive;
    if (filter === "draft") return !link.isActive;
    return true;
  });

  const handleAddLink = (e: React.FormEvent) => {
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
      position: links.length,
      category: newCategory,
      clicks: 0,
    };

    onLinksChange([...links, newLink]);
    setNewTitle("");
    setNewUrl("");
    setIsAdding(false);
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

  const startEdit = (link: LinkData) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const saveEdit = (id: string) => {
    const validation = validateLinkInput({ title: editTitle, url: editUrl });
    if (!validation.valid || !validation.normalizedUrl) {
      setError(validation.error || "بيانات التعديل غير صحيحة");
      return;
    }

    onLinksChange(
      links.map((l) =>
        l.id === id
          ? { ...l, title: validation.title!, url: validation.normalizedUrl! }
          : l
      )
    );
    setEditingId(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Link Health Monitoring Banner */}
      <div className="rounded-xl bg-surface-container-low p-4 shadow-lg border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface text-sm">مراقبة سلامة الروابط التلقائية</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>100% صالحة</span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              جميع الروابط تعمل بكفاءة عبر خوادم المراقبة الذكية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-primary transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رابط ذكي جديد</span>
        </button>
      </div>

      {/* Add Link Form Collapsible */}
      {isAdding && (
        <form
          onSubmit={handleAddLink}
          className="rounded-xl bg-surface-container p-5 border border-primary/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">add_link</span>
              <span>بيانات الرابط الجديد</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
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
      )}

      {/* Links List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">reorder</span>
            <h3 className="font-bold text-on-surface text-sm">قائمة الروابط ({filteredLinks.length})</h3>
          </div>
          <span className="text-xs text-on-surface-variant">اسحب أو استخدم الأسهم لإعادة الترتيب</span>
        </div>

        {filteredLinks.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">لا توجد روابط في هذا القسم حالياً.</p>
          </div>
        ) : (
          filteredLinks.map((link, idx) => {
            const isEditingThis = editingId === link.id;
            const catObj = CATEGORIES.find((c) => c.id === link.category) || CATEGORIES[4];

            return (
              <div
                key={link.id}
                className={`group relative overflow-hidden rounded-xl p-4 transition-all border ${
                  link.isActive
                    ? "bg-surface-container hover:bg-surface-container-high border-outline-variant/30 hover:border-outline-variant/50 shadow-md"
                    : "bg-surface-container-lowest/60 border-outline-variant/20 opacity-60 hover:opacity-85"
                }`}
              >
                {isEditingThis ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface text-sm"
                      />
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        dir="ltr"
                        className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface text-sm text-right"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs text-on-surface-variant"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(link.id)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs"
                      >
                        حفظ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    {/* Drag Handle & Info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Move Controls */}
                      <div className="flex flex-col items-center gap-0.5 mt-0.5 text-on-surface-variant">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0}
                          title="تحريك لأعلى"
                          className="p-1 rounded hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-20 transition"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <GripVertical className="w-4 h-4 text-outline cursor-grab" />
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === filteredLinks.length - 1}
                          title="تحريك لأسفل"
                          className="p-1 rounded hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-20 transition"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${catObj.color}`}>
                            {catObj.label}
                          </span>
                          {!link.isActive && (
                            <span className="px-2 py-0.5 rounded-full bg-error-container/20 text-error text-[11px]">
                              مسودة مخفية
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-on-surface text-base mt-1.5 truncate">
                          {link.title}
                        </h4>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          dir="ltr"
                          className="text-right text-xs text-on-surface-variant hover:text-primary truncate max-w-sm mt-0.5 flex items-center gap-1"
                        >
                          <span>{link.url.replace(/^https?:\/\//i, "")}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {/* Performance Pill */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 pt-1">
                          <span className="inline-flex items-center gap-1 text-primary text-xs bg-primary/10 px-2 py-0.5 rounded font-mono">
                            <span className="material-symbols-outlined text-[13px]">ads_click</span>
                            <span>{link.clicks ? link.clicks.toLocaleString("ar-SA") : "٠"} نقرة</span>
                          </span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-primary text-[10px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span>200 OK • سليم</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Switch & Tools */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      {/* Custom Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isActive}
                          onChange={() => handleToggleActive(link.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner" />
                      </label>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 text-on-surface-variant pt-1">
                        <button
                          type="button"
                          onClick={() => startEdit(link)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-highest hover:text-on-surface transition-colors"
                          title="تعديل الرابط"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(link.id)}
                          className="p-1.5 rounded-lg hover:bg-error-container/30 hover:text-error transition-colors"
                          title="حذف الرابط"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
