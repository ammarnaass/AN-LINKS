"use client";

import React from "react";
import { AppInput } from "@/shared/ui";

export interface GatewayFeeData {
  feePercentage: number;
  feeFixed: number;
  supportedCurrencies: string;
}

export interface GatewayFeeSettingsProps {
  data: GatewayFeeData;
  onChange: <K extends keyof GatewayFeeData>(key: K, value: GatewayFeeData[K]) => void;
}

export function GatewayFeeSettings({ data, onChange }: GatewayFeeSettingsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label="نسبة العمولة (%)" type="number" step="0.01"
          value={data.feePercentage} onChange={(e) => onChange("feePercentage", Number(e.target.value))}
        />
        <AppInput
          label="رسوم ثابتة (SAR)" type="number" step="0.01"
          value={data.feeFixed} onChange={(e) => onChange("feeFixed", Number(e.target.value))}
        />
      </div>

      <AppInput
        label="العملات المدعومة (مفصولة بفواصل)" placeholder="SAR, USD, AED, KWD, EGP"
        value={data.supportedCurrencies} onChange={(e) => onChange("supportedCurrencies", e.target.value)}
      />
    </>
  );
}

export default GatewayFeeSettings;
