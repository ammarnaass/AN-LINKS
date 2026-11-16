import React from "react";
import { AdminGatewayDetails } from "../../../../types/admin.types";
import { GatewayCard } from "./GatewayCard";

export interface GatewayCategorySectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  gateways: AdminGatewayDetails[];
  togglingId: string | null;
  onToggleGateway: (id: string) => void;
  onOpenConfig: (gw: AdminGatewayDetails) => void;
}

export function GatewayCategorySection({
  title, description, icon, iconBgClass, gateways, togglingId, onToggleGateway, onOpenConfig,
}: GatewayCategorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgClass}`}>{icon}</div>
          <div>
            <h3 className="text-base font-bold text-on-surface">{title}</h3>
            <p className="text-xs text-on-surface-variant">{description}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-on-surface-variant">{gateways.length} بوابات</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gateways.map((gw) => (
          <GatewayCard
            key={gw.id}
            gateway={gw}
            isToggling={togglingId === gw.id}
            onToggle={onToggleGateway}
            onOpenConfig={onOpenConfig}
          />
        ))}
      </div>
    </div>
  );
}
