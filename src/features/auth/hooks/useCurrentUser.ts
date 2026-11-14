"use client";

import { useState, useEffect } from "react";
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

const STORAGE_KEY = "an_auth_session";
let memoryUser: CurrentUserData | null = null;

export function clearAuthCache(): void {
  memoryUser = null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage access errors
    }
  }
}

export function setAuthCache(user: CurrentUserData): void {
  memoryUser = user;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage access errors
    }
  }
}

export function getCachedAuthUser(): CurrentUserData | null {
  if (memoryUser) return memoryUser;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryUser = JSON.parse(raw);
        return memoryUser;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function useCurrentUser(): CurrentUserResult {
  try {
    const [cachedUser, setCachedUser] = useState<CurrentUserData | null>(() => getCachedAuthUser());

    useEffect(() => {
      const cached = getCachedAuthUser();
      if (cached) setCachedUser(cached);
    }, []);

    const session = useSession();
    const liveUser = (session.data?.user as CurrentUserData) || null;
    const isLiveAuth = session.status === "authenticated";
    const isLoading = session.status === "loading";

    useEffect(() => {
      if (isLiveAuth && liveUser) {
        setAuthCache(liveUser);
        setCachedUser(liveUser);
      } else if (session.status === "unauthenticated") {
        clearAuthCache();
        setCachedUser(null);
      }
    }, [isLiveAuth, liveUser, session.status]);

    const activeUser = liveUser || cachedUser || memoryUser;
    const isAuthenticated = isLiveAuth || Boolean(activeUser);
    const role = activeUser?.role || "USER";
    const isAdmin = role === "ADMIN";

    return {
      session: session.data,
      user: activeUser,
      isAuthenticated,
      isLoading: isLoading && !activeUser,
      role,
      isAdmin,
    };
  } catch {
    const activeUser = memoryUser;
    const isAuthenticated = Boolean(activeUser);
    const role = activeUser?.role || "USER";
    return {
      session: null,
      user: activeUser,
      isAuthenticated,
      isLoading: false,
      role,
      isAdmin: role === "ADMIN",
    };
  }
}
