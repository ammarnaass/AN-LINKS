import { signIn } from "next-auth/react";
import { RegistrationInput } from "../types/auth.types";

export interface RegisterResponse {
  ok: boolean;
  errors?: string[];
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export async function registerAccount(formData: RegistrationInput): Promise<RegisterResponse> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, errors: data.errors || ["فشل إنشاء الحساب"] };
    }

    return { ok: true, user: data.user };
  } catch {
    return { ok: false, errors: ["حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى"] };
  }
}

export async function loginWithCredentials(email: string, password: string) {
  return signIn("credentials", {
    redirect: false,
    email,
    password,
  });
}
