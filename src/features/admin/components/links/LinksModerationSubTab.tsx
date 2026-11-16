"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLinkItem } from "@/features/admin/types/admin.types";
import { PlatformDTO } from "@/features/links/types/links.types";
import { AppCard, AppButton, AppInput } from "@/shared/ui";
import { Search, RefreshCw } from "lucide-react";
import { LinksModerationTable } from "./LinksModerationTable";

export function LinksModerationSubTab() {
  const [links, setLinks] = useState<AdminLinkItem[]>([]);
  const [platforms, setPlatforms] = useState<PlatformDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformId, setPlatformId] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetch("/api/platforms")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.platforms) setPlatforms(d.platforms);
      })
      .catch(() => {});
  }, []);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = new URLSearchParams();
      if (searchQuery.trim()) p.set("search", searchQuery.trim());
      if (platformId !== "all") p.set("platformId", platformId);
      if (status !== "all") p.set("status", status);
      p.set("page", page.toString());
      p.set("limit", "15");

      const res = await fetch(`/api/admin/links?${p.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLinks(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch admin links:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, platformId, status, page]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleUpdateLink = async (
    id: string,
    patch: { isActive?: boolean; isPinned?: boolean; isArchived?: boolean }
  ) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLinks((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
        );
      } else {
        alert(data.error || "فشل تحديث الرابط");
      }
    } catch {
      alert("حدث خطأ أثناء تحديث الرابط");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 font-cairo" dir="rtl">
      {/* Search & Filters */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-on-surface">
              الإشراف على الروابط ومراجعتها ({total.toLocaleString("ar-SA")})
            </h2>
            <p className="text-xs text-on-surface-variant">
              فحص روابط المستخدمين، إدارة التفعيل، التثبيت، والأرشفة
            </p>
          </div>
          <AppButton
            variant="ghost"
            size="sm"
            onClick={fetchLinks}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          >
            تحديث
          </AppButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-outline-variant/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearchQuery(search);
            }}
            className="sm:col-span-2 flex items-center gap-1.5"
          >
            <AppInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالعنوان، الرابط، أو صانع المحتوى..."
              className="text-xs"
            />
            <AppButton type="submit" size="sm" variant="primary">
              <Search className="w-3.5 h-3.5" />
            </AppButton>
          </form>

          <select
            value={platformId}
            onChange={(e) => {
              setPlatformId(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="all">جميع المنصات</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameAr} ({p.nameEn})
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشطة فقط</option>
            <option value="inactive">معطلة</option>
            <option value="pinned">مثبتة</option>
            <option value="archived">مؤرشفة</option>
          </select>
        </div>
      </div>

      {/* Links Table Card */}
      <AppCard className="p-0 overflow-hidden border border-outline-variant/30">
        <LinksModerationTable
          links={links}
          isLoading={isLoading}
          actionLoadingId={actionLoadingId}
          onUpdateLink={handleUpdateLink}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </AppCard>
    </div>
  );
}
