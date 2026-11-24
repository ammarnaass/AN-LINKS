"use client";

import React, { useState, useEffect } from "react";
import { AdminUserItem } from "../types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { MapPin, X, Check } from "lucide-react";

export interface AdminEditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserItem | null;
  onSave: (userId: string, location: string | null) => Promise<void> | void;
}

export function AdminEditLocationModal({
  isOpen,
  onClose,
  user,
  onSave,
}: AdminEditLocationModalProps) {
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLocation(user.location || "");
      setError(null);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(user.id, location.trim() || null);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل حفظ الموقع الجغرافي";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-cairo"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">تعديل مكان الإقامة</h3>
              <p className="text-[11px] text-on-surface-variant font-mono" dir="ltr">
                @{user.username} ({user.displayName})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              الدولة والمدينة (مكان السكن الحالي)
            </label>
            <AppInput
              placeholder="مثال: الجزائر العاصمة، الجزائر أو الرياض، السعودية"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              startAdornment={<MapPin className="w-4 h-4 text-red-400" />}
              autoFocus
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              يظهر هذا الموقع كشارة جغرافية موثقة في صفحة الروابط العامة (`/{user.username}`).
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              إلغاء
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              حفظ التعديل
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
