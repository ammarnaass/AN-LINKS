"use client";

import { useState, useEffect } from "react";
import {
  changeAccountPassword,
  fetchTwoFactorStatus,
  setupTwoFactorAuth,
  verifyTwoFactorAuth,
  disableTwoFactorAuth,
} from "../services/settings.client";

export function useSettingsSecurity() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(true);
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2FA modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setupData, setSetupData] = useState<{
    qrCodeDataUrl: string;
    secret: string;
    backupCodes: string[];
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchTwoFactorStatus()
      .then((res) => {
        if (mounted && res.data) setIs2FAEnabled(res.data.isEnabled);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIs2FALoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    setStatusMessage(null);
    try {
      await changeAccountPassword(
        passwordState.currentPassword,
        passwordState.newPassword,
        passwordState.confirmPassword
      );
      setStatusMessage({ type: "success", text: "تم تحديث كلمة المرور بنجاح" });
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل تغيير كلمة المرور";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const start2FASetup = async () => {
    try {
      const data = await setupTwoFactorAuth();
      setSetupData(data);
      setIsModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر بدء الإعداد";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  const confirm2FA = async (token: string) => {
    await verifyTwoFactorAuth(token);
    setIs2FAEnabled(true);
    setIsModalOpen(false);
    setStatusMessage({ type: "success", text: "تم تفعيل المصادقة الثنائية بنجاح" });
  };

  const disable2FA = async (password: string) => {
    await disableTwoFactorAuth(password);
    setIs2FAEnabled(false);
    setStatusMessage({ type: "success", text: "تم تعطيل المصادقة الثنائية" });
  };

  return {
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
  };
}
