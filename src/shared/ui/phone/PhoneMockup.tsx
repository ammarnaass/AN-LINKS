import React from "react";
import { PhoneChassis, PhoneFinish } from "./PhoneChassis";
import { PhoneDynamicIsland } from "./PhoneDynamicIsland";
import { PhoneScreenContent, PhoneScreenContentProps } from "./PhoneScreenContent";
import { PhoneWebviewIframe } from "./PhoneWebviewIframe";
import { PhoneBrowserBar } from "./PhoneBrowserBar";
import { FloatingMetricCards } from "./FloatingMetricCards";

export type PhonePreviewMode = "simulator" | "webview";

export interface PhoneMockupProps extends PhoneScreenContentProps {
  showFloatingCards?: boolean;
  finish?: PhoneFinish;
  mode?: PhonePreviewMode;
  refreshKey?: number;
  showBrowserBar?: boolean;
  className?: string;
}

export function PhoneMockup({
  showFloatingCards = true,
  finish = "titanium",
  mode = "simulator",
  refreshKey = 0,
  showBrowserBar = true,
  className = "",
  ...screenProps
}: PhoneMockupProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {showFloatingCards && <FloatingMetricCards />}

      <PhoneChassis finish={finish}>
        <div className="absolute top-0 inset-x-0 z-20 pointer-events-none">
          <PhoneDynamicIsland />
        </div>

        {mode === "webview" && screenProps.username ? (
          <PhoneWebviewIframe
            username={screenProps.username}
            refreshKey={refreshKey}
          />
        ) : (
          <PhoneScreenContent {...screenProps} />
        )}

        {showBrowserBar && (
          <PhoneBrowserBar
            username={screenProps.username || "creator"}
          />
        )}
      </PhoneChassis>
    </div>
  );
}

export * from "./PhoneChassis";
export * from "./PhoneDynamicIsland";
export * from "./PhoneScreenContent";
export * from "./PhoneBrowserBar";
export * from "./PhoneInteractiveLink";
export * from "./PhoneWebviewIframe";
export * from "./FloatingMetricCards";
