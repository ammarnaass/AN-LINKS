import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/features/auth/server/auth.options";

export interface AdminGuardSuccess {
  authorized: true;
  user: {
    id: string;
    username: string;
    role: string;
    email?: string | null;
  };
}

export interface AdminGuardFailure {
  authorized: false;
  response: NextResponse;
}

export type AdminGuardResult = AdminGuardSuccess | AdminGuardFailure;

export async function requireAdminSession(): Promise<AdminGuardResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "غير مصرح، يرجى تسجيل الدخول أولاً" },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "ليس لديك صلاحية الوصول إلى لوحة المشغّل" },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: session.user,
  };
}

