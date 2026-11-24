"use client";

import React, { useState } from "react";
import { LinkData } from "../types/links.types";
import { LinkHealthBanner } from "./LinkHealthBanner";
import { AddLinkForm } from "./AddLinkForm";
import { LinkCardItem } from "./LinkCardItem";
import { reorderLinkItems } from "../validators/link.validator";

interface LinkEditorProps {
  links: LinkData[];
  onLinksChange: (newLinks: LinkData[]) => void;
  onAddLink?: (input: { title: string; url: string; platformId?: string | null; category?: string }) => Promise<LinkData | void>;
  onUpdateLink?: (id: string, updated: Partial<LinkData>) => Promise<void>;
  onDeleteLink?: (id: string) => Promise<void>;
  filter?: "all" | "active" | "draft";
}

export function LinkEditor({
  links,
  onLinksChange,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  filter = "all",
}: LinkEditorProps) {
  const [isAdding, setIsAdding] = useState(false);

  const filteredLinks = links.filter((link) => {
    if (filter === "active") return link.isActive;
    if (filter === "draft") return !link.isActive;
    return true;
  });

  const handleAdd = async (newLink: LinkData) => {
    if (onAddLink) {
      await onAddLink({
        title: newLink.title,
        url: newLink.url,
        platformId: newLink.platformId,
        category: newLink.category,
      });
    } else {
      onLinksChange([...links, newLink]);
    }
    setIsAdding(false);
  };

  const handleUpdate = async (updated: LinkData) => {
    if (onUpdateLink) {
      await onUpdateLink(updated.id, updated);
    }
    onLinksChange(links.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDelete = async (id: string) => {
    if (onDeleteLink) {
      await onDeleteLink(id);
    }
    onLinksChange(
      links
        .filter((l) => l.id !== id)
        .map((l, idx) => ({ ...l, position: idx }))
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = reorderLinkItems(links, index, targetIndex);
    onLinksChange(reordered);
  };

  return (
    <div className="space-y-4">
      <LinkHealthBanner
        isAdding={isAdding}
        onToggleAdd={() => setIsAdding(!isAdding)}
        links={links}
      />

      {isAdding && (
        <AddLinkForm
          existingCount={links.length}
          onAdd={handleAdd}
          onCancel={() => setIsAdding(false)}
        />
      )}

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
          filteredLinks.map((link, idx) => (
            <LinkCardItem
              key={link.id}
              link={link}
              index={idx}
              totalCount={filteredLinks.length}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))
        )}
      </div>
    </div>
  );
}

