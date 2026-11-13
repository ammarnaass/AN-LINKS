"use client";

import React from "react";

interface LinksFilterTabsProps {
  filter: "all" | "active" | "draft";
  onFilterChange: (f: "all" | "active" | "draft") => void;
  activeCount: number;
  draftCount: number;
}

export function LinksFilterTabs({
  filter,
  onFilterChange,
  activeCount,
  draftCount,
}: LinksFilterTabsProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 w-fit">
      <button
        type="button"
        onClick={() => onFilterChange("all")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
          filter === "all"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        الكل ({activeCount + draftCount})
      </button>

      <button
        type="button"
        onClick={() => onFilterChange("active")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
          filter === "active"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        مفعلة ({activeCount})
      </button>

      <button
        type="button"
        onClick={() => onFilterChange("draft")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
          filter === "draft"
            ? "bg-surface-container-high text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        مسودات ({draftCount})
      </button>
    </div>
  );
}

