"use client";

import React from "react";
import { AiCopilotSettingsCard } from "./ai/AiCopilotSettingsCard";
import { CreatorWebhooksCard } from "./profile/CreatorWebhooksCard";

export function AiAndWebhooksTab() {
  return (
    <section className="space-y-6">
      <AiCopilotSettingsCard />
      <CreatorWebhooksCard />
    </section>
  );
}
