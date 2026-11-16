"use client";

import React from "react";
import {
  AdminGatewayDetails,
  AdminSubscriptionPlanItem,
  AdminCurrencyItem,
  UpdateGatewayInput,
  UpsertPlanInput,
  CreateCouponInput,
  UpdateCurrencyInput,
} from "../../types/admin.types";
import { GatewayConfigModal } from "./modals/GatewayConfigModal";
import { PlanEditorModal } from "./modals/PlanEditorModal";
import { CouponEditorModal } from "./modals/CouponEditorModal";
import { CurrencyRateModal } from "./modals/CurrencyRateModal";

export interface FinancialsModalsManagerProps {
  gatewayModalState: { isOpen: boolean; gateway: AdminGatewayDetails | null };
  onCloseGatewayModal: () => void;
  onUpdateGatewayConfig: (input: UpdateGatewayInput) => Promise<boolean>;

  planModalState: { isOpen: boolean; plan: AdminSubscriptionPlanItem | null };
  onClosePlanModal: () => void;
  onSavePlan: (input: UpsertPlanInput) => Promise<boolean>;

  couponModalOpen: boolean;
  onCloseCouponModal: () => void;
  onCreateCoupon: (input: CreateCouponInput) => Promise<boolean>;
  availablePlanSlugs: Array<{ slug: string; nameAr: string }>;

  currencyModalState: { isOpen: boolean; currency: AdminCurrencyItem | null };
  onCloseCurrencyModal: () => void;
  onSaveCurrency: (code: string, input: UpdateCurrencyInput) => Promise<boolean>;

  isSaving?: boolean;
}

export function FinancialsModalsManager({
  gatewayModalState,
  onCloseGatewayModal,
  onUpdateGatewayConfig,
  planModalState,
  onClosePlanModal,
  onSavePlan,
  couponModalOpen,
  onCloseCouponModal,
  onCreateCoupon,
  availablePlanSlugs,
  currencyModalState,
  onCloseCurrencyModal,
  onSaveCurrency,
  isSaving = false,
}: FinancialsModalsManagerProps) {
  return (
    <>
      <GatewayConfigModal
        isOpen={gatewayModalState.isOpen}
        gateway={gatewayModalState.gateway}
        onClose={onCloseGatewayModal}
        onSave={onUpdateGatewayConfig}
        isSaving={isSaving}
      />
      <PlanEditorModal
        isOpen={planModalState.isOpen}
        plan={planModalState.plan}
        onClose={onClosePlanModal}
        onSave={onSavePlan}
        isSaving={isSaving}
      />
      <CouponEditorModal
        isOpen={couponModalOpen}
        onClose={onCloseCouponModal}
        onSave={onCreateCoupon}
        availablePlanSlugs={availablePlanSlugs}
        isSaving={isSaving}
      />
      <CurrencyRateModal
        isOpen={currencyModalState.isOpen}
        currency={currencyModalState.currency}
        onClose={onCloseCurrencyModal}
        onSave={onSaveCurrency}
        isSaving={isSaving}
      />
    </>
  );
}
