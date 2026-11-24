"use client";

import { useState, useEffect } from "react";
import { fetchProfileSettings, updateProfileSettings } from "../services/settings.client";
import { ProfileSettingsInput } from "../validators/settings.validator";

export function useSettingsProfile() {
  const [profile, setProfile] = useState<ProfileSettingsInput>({
    displayName: "",
    username: "",
    email: "",
    bio: "",
    phone: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProfileSettings()
      .then((res) => {
        if (mounted && res.data) {
          setProfile({
            displayName: res.data.displayName || "",
            username: res.data.username || "",
            email: res.data.email || "",
            bio: res.data.bio || "",
            phone: res.data.phone || "",
          });
          setAvatarUrl(res.data.avatarUrl || null);
        }
      })
      .catch((err) => {
        if (mounted) setStatusMessage({ type: "error", text: err.message });
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdate = async (input: ProfileSettingsInput) => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await updateProfileSettings(input);
      setProfile((prev) => ({ ...prev, ...res.data }));
      setStatusMessage({ type: "success", text: "تم حفظ بيانات الملف الشخصي بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل الحفظ";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    setProfile,
    avatarUrl,
    setAvatarUrl,
    isLoading,
    isSaving,
    statusMessage,
    handleUpdate,
  };
}
