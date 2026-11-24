"use client";

import React from "react";
import { useSettingsSecurity } from "../hooks/useSettingsSecurity";
import { SecurityTwoFactorCard } from "./security/SecurityTwoFactorCard";
import { SecurityPasswordForm } from "./security/SecurityPasswordForm";
import { SecuritySessionsList } from "./security/SecuritySessionsList";
import { TwoFactorModal } from "./security/TwoFactorModal";

export function SecurityTab() {
  const {
    is2FAEnabled,
    is2FALoading,
    passwordState,
    setPasswordState,
    isSubmittingPassword,
    statusMessage,
    handlePasswordSubmit,
    isModalOpen,
    setIsModalOpen,
    setupData,
    start2FASetup,
    confirm2FA,
    disable2FA,
  } = useSettingsSecurity();

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex">
          <SecurityTwoFactorCard
            isEnabled={is2FAEnabled}
            isLoading={is2FALoading}
            onStartSetup={start2FASetup}
            onDisable={disable2FA}
          />
        </div>
        <div className="lg:col-span-6 flex">
          <SecurityPasswordForm
            passwordState={passwordState as unknown as { currentPassword: ""; newPassword: ""; confirmPassword: "" }}
            setPasswordState={setPasswordState}
            onSubmit={handlePasswordSubmit}
            isSubmitting={isSubmittingPassword}
            statusMessage={statusMessage}
          />
        </div>
      </div>

      <SecuritySessionsList />

      {setupData && (
        <TwoFactorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          qrCodeDataUrl={setupData.qrCodeDataUrl}
          secret={setupData.secret}
          backupCodes={setupData.backupCodes}
          onConfirm={confirm2FA}
        />
      )}
    </section>
  );
}
