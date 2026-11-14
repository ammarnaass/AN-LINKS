import React from "react";
import { PhoneChassis } from "./PhoneChassis";
import { PhoneDynamicIsland } from "./PhoneDynamicIsland";
import { PhoneScreenContent, PhoneScreenContentProps } from "./PhoneScreenContent";
import { FloatingMetricCards } from "./FloatingMetricCards";

export interface PhoneMockupProps extends PhoneScreenContentProps {
  showFloatingCards?: boolean;
  className?: string;
}

export function PhoneMockup({
  showFloatingCards = true,
  className = "",
  ...screenProps
}: PhoneMockupProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {showFloatingCards && <FloatingMetricCards />}

      <PhoneChassis>
        <PhoneDynamicIsland />
        <PhoneScreenContent {...screenProps} />
      </PhoneChassis>
    </div>
  );
}

export * from "./PhoneChassis";
export * from "./PhoneDynamicIsland";
export * from "./PhoneScreenContent";
export * from "./FloatingMetricCards";

