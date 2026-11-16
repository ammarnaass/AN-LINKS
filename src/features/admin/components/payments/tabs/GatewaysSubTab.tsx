"use client";

import React, { useState } from "react";
import { AdminGatewayDetails, UpdateGatewayInput } from "../../../types/admin.types";
import { GatewayConfigModal } from "../modals/GatewayConfigModal";
import { CreditCard, Globe } from "lucide-react";
import { GatewayCard } from "./gateways/GatewayCard";
import { GatewayCategorySection } from "./gateways/GatewayCategorySection";

export interface GatewaysSubTabProps {
  gateways: AdminGatewayDetails[];
  onToggleGateway: (id: string) => Promise<boolean>;
  onSaveConfig?: (input: UpdateGatewayInput) => Promise<boolean>;
  isSaving?: boolean;
  onOpenConfig?: (gateway: AdminGatewayDetails) => void;
}

export function GatewaysSubTab({
  gateways,
  onToggleGateway,
  onSaveConfig,
  isSaving = false,
  onOpenConfig,
}: GatewaysSubTabProps) {
  const [selectedGateway, setSelectedGateway] = useState<AdminGatewayDetails | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const isNational = (gw: AdminGatewayDetails) => {
    const c = gw.code?.toLowerCase();
    return (
      gw.category === "NATIONAL" || gw.category === "BNPL" || gw.category === "WALLET" ||
      ["mada", "stc_pay", "tamara", "tabby", "fawry", "apple_pay"].includes(c)
    );
  };

  const nationalGateways = gateways.filter((g) => isNational(g));
  const internationalGateways = gateways.filter((g) => !isNational(g));

  const handleOpenConfig = (gw: AdminGatewayDetails) => {
    if (onOpenConfig) onOpenConfig(gw);
    else { setSelectedGateway(gw); setIsConfigModalOpen(true); }
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await onToggleGateway(id);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8 font-cairo" dir="rtl">
      <GatewayCategorySection
        title="بوابات الدفع الوطنية (السعودية والخليج ومصر)"
        description="مدى، STC Pay، تمارا، تابي، فوري والدفع المباشر عبر المحافظ"
        icon={<CreditCard className="w-4 h-4" />}
        iconBgClass="bg-emerald-500/15 text-emerald-400"
        gateways={nationalGateways}
        togglingId={togglingId}
        onToggleGateway={handleToggle}
        onOpenConfig={handleOpenConfig}
      />

      <GatewayCategorySection
        title="بوابات الدفع العالمية والبطاقات"
        description="Stripe، فيزا/ماستركارد، PayPal والمدفوعات الدولية بالدولار واليورو"
        icon={<Globe className="w-4 h-4" />}
        iconBgClass="bg-primary/15 text-primary"
        gateways={internationalGateways}
        togglingId={togglingId}
        onToggleGateway={handleToggle}
        onOpenConfig={handleOpenConfig}
      />

      {!onOpenConfig && (
        <GatewayConfigModal
          isOpen={isConfigModalOpen}
          gateway={selectedGateway}
          onClose={() => { setIsConfigModalOpen(false); setSelectedGateway(null); }}
          onSave={onSaveConfig || (async () => true)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export { GatewayCard, GatewayCategorySection };
