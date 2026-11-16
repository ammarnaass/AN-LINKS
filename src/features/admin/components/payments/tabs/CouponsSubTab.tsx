"use client";

import React, { useState } from "react";
import { AdminCouponItem, CreateCouponInput } from "../../../types/admin.types";
import { AppButton } from "@/shared/ui";
import { CouponEditorModal } from "../modals/CouponEditorModal";
import { Plus } from "lucide-react";
import { CouponsTable } from "./coupons/CouponsTable";

export interface CouponsSubTabProps {
  coupons: AdminCouponItem[];
  availablePlanSlugs?: Array<{ slug: string; nameAr: string }>;
  onCreateCoupon: (input: CreateCouponInput) => Promise<boolean>;
  onToggleCoupon: (id: string) => Promise<boolean>;
  onDeleteCoupon: (id: string) => Promise<boolean>;
  isSaving?: boolean;
  onOpenCreateCoupon?: () => void;
}

export function CouponsSubTab({
  coupons,
  availablePlanSlugs,
  onCreateCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  isSaving = false,
  onOpenCreateCoupon,
}: CouponsSubTabProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    if (onOpenCreateCoupon) onOpenCreateCoupon();
    else setIsCreateModalOpen(true);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await onToggleCoupon(id);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف كود الخصم "${code}"؟`)) {
      setDeletingId(id);
      try {
        await onDeleteCoupon(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">إدارة أكواد الخصم والعروض الترويجية</h3>
          <p className="text-xs text-on-surface-variant">إنشاء قسائم تخفيض بنسبة مئوية أو مبالغ ثابتة وضبط فترات الصلاحية وحدود الاستخدام</p>
        </div>
        <AppButton variant="primary" size="sm" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          إنشاء كود خصم جديد
        </AppButton>
      </div>

      <CouponsTable
        coupons={coupons}
        copiedCode={copiedCode}
        onCopyCode={handleCopyCode}
        togglingId={togglingId}
        onToggle={handleToggle}
        deletingId={deletingId}
        onDelete={handleDelete}
      />

      {!onOpenCreateCoupon && (
        <CouponEditorModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={onCreateCoupon}
          availablePlanSlugs={availablePlanSlugs}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export { CouponsTable };
