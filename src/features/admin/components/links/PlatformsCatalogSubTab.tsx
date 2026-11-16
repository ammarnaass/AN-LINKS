"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PlatformDTO } from "@/features/links/types/links.types";
import { AppCard, AppButton } from "@/shared/ui";
import { Plus, RefreshCw } from "lucide-react";
import { PlatformModal } from "./PlatformModal";
import { PlatformsTable } from "./PlatformsTable";

export function PlatformsCatalogSubTab() {
  const [platforms, setPlatforms] = useState<PlatformDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<PlatformDTO | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchPlatforms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/platforms");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل جلب قائمة المنصات");
      }
      setPlatforms(data.platforms || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const handleToggleEnable = async (platform: PlatformDTO) => {
    setActionLoadingId(platform.id);
    try {
      const nextEnabled = !platform.isEnabled;
      const res = await fetch(`/api/admin/platforms/${platform.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: nextEnabled }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تحديث حالة المنصة");
      }
      setPlatforms((prev) =>
        prev.map((p) => (p.id === platform.id ? { ...p, isEnabled: nextEnabled } : p))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "فشل التحديث");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (platform: PlatformDTO) => {
    if (!window.confirm(`هل أنت متأكد من حذف منصة "${platform.nameAr}"؟`)) {
      return;
    }
    setActionLoadingId(platform.id);
    try {
      const res = await fetch(`/api/admin/platforms/${platform.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حذف المنصة");
      }
      setPlatforms((prev) => prev.filter((p) => p.id !== platform.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "فشل حذف المنصة");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaved = (saved: PlatformDTO) => {
    setPlatforms((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      if (exists) {
        return prev.map((p) => (p.id === saved.id ? saved : p));
      }
      return [...prev, saved];
    });
  };

  return (
    <div className="space-y-4 font-cairo" dir="rtl">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface">
            دليل المنصات المعتمدة ({platforms.length})
          </h2>
          <p className="text-xs text-on-surface-variant">
            إدارة المنصات المدعومة وأنماط التحقق التلقائي والألوان والأيقونات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AppButton
            variant="ghost"
            size="sm"
            onClick={fetchPlatforms}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          >
            تحديث
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingPlatform(null);
              setModalOpen(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            إضافة منصة جديدة
          </AppButton>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 text-error border border-error/20 text-xs">
          {error}
        </div>
      )}

      {/* Platforms Table Card */}
      <AppCard className="p-0 overflow-hidden border border-outline-variant/30">
        <PlatformsTable
          platforms={platforms}
          isLoading={isLoading}
          actionLoadingId={actionLoadingId}
          onToggleEnable={handleToggleEnable}
          onEdit={(p) => {
            setEditingPlatform(p);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </AppCard>

      <PlatformModal
        isOpen={modalOpen}
        platform={editingPlatform}
        onClose={() => {
          setModalOpen(false);
          setEditingPlatform(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}
