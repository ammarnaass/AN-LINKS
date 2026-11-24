import { ProfileSettingsInput } from "../validators/settings.validator";

export async function fetchProfileSettings() {
  const res = await fetch("/api/settings/profile");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "فشل جلب بيانات الملف الشخصي");
  }
  return res.json();
}

export async function updateProfileSettings(input: ProfileSettingsInput) {
  const res = await fetch("/api/settings/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "فشل تحديث بيانات الملف الشخصي");
  }
  return res.json();
}

export async function changeAccountPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  const res = await fetch("/api/settings/security/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.message || "فشل تغيير كلمة المرور");
  }
  return data;
}

export async function fetchTwoFactorStatus() {
  const res = await fetch("/api/settings/security/2fa");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "فشل جلب حالة التحقق الثنائي");
  }
  return res.json();
}

export async function setupTwoFactorAuth() {
  const res = await fetch("/api/settings/security/2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "setup" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || "فشل بدء إعداد المصادقة الثنائية");
  }
  return data.data;
}

export async function verifyTwoFactorAuth(token: string) {
  const res = await fetch("/api/settings/security/2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || "رمز التحقق غير صحيح");
  }
  return data;
}

export async function disableTwoFactorAuth(password: string) {
  const res = await fetch("/api/settings/security/2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "disable", password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || "كلمة المرور غير صحيحة");
  }
  return data;
}
