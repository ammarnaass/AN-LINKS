"use client";

import React, { useState } from "react";
import { AdminSubscriptionPlanItem, UpsertPlanInput } from "../../../types/admin.types";
import { PlanEditorModal } from "../modals/PlanEditorModal";
import { PlanPricingCard } from "./plans/PlanPricingCard";
import { PlansCycleHeader } from "./plans/PlansCycleHeader";

export interface PlansSubTabProps {
  plans: AdminSubscriptionPlanItem[];
  onSavePlan: (input: UpsertPlanInput) => Promise<boolean>;
  onDeletePlan: (id: string) => Promise<boolean>;
  isSaving?: boolean;
  onOpenCreatePlan?: () => void;
  onOpenEditPlan?: (plan: AdminSubscriptionPlanItem) => void;
}

export function PlansSubTab({
  plans,
  onSavePlan,
  onDeletePlan,
  isSaving = false,
  onOpenCreatePlan,
  onOpenEditPlan,
}: PlansSubTabProps) {
  const [cycle, setCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [selectedPlan, setSelectedPlan] = useState<AdminSubscriptionPlanItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateNew = () => {
    if (onOpenCreatePlan) onOpenCreatePlan();
    else { setSelectedPlan(null); setIsModalOpen(true); }
  };

  const handleEdit = (plan: AdminSubscriptionPlanItem) => {
    if (onOpenEditPlan) onOpenEditPlan(plan);
    else { setSelectedPlan(plan); setIsModalOpen(true); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف أو أرشفة باقة "${name}"؟`)) {
      setDeletingId(id);
      try {
        await onDeletePlan(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      <PlansCycleHeader cycle={cycle} onCycleChange={setCycle} onCreateNew={handleCreateNew} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <PlanPricingCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            isDeleting={deletingId === plan.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!onOpenCreatePlan && !onOpenEditPlan && (
        <PlanEditorModal
          isOpen={isModalOpen}
          plan={selectedPlan}
          onClose={() => { setIsModalOpen(false); setSelectedPlan(null); }}
          onSave={onSavePlan}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export { PlanPricingCard, PlansCycleHeader };
