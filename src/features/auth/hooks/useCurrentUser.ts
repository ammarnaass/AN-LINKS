"use client";

import { useSession } from "next-auth/react";

export interface CurrentUserData {
  id?: string;
  username?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface CurrentUserResult {
  session: unknown;
  user: CurrentUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string;
  isAdmin: boolean;
}

export function useCurrentUser(): CurrentUserResult {
  try {
    const session = useSession();
    const user = (session.data?.user as CurrentUserData) || null;
    const isAuthenticated = session.status === "authenticated";
    const isLoading = session.status === "loading";
    const role = user?.role || "USER";
    const isAdmin = role === "ADMIN";

    return {
      session: session.data,
      user,
      isAuthenticated,
      isLoading,
      role,
      isAdmin,
    };
  } catch {
    return {
      session: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      role: "USER",
      isAdmin: false,
    };
  }
}

