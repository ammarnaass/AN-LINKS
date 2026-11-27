import { getServerSession } from "next-auth";
import { authOptions } from "./auth.options";
import { prisma } from "@/shared/db";
import { touchSession } from "./session.service";

export interface AuthUser {
  id: string;
  username: string;
  email?: string | null;
  name?: string | null;
  role: string;
  image?: string | null;
  sessionToken?: string;
}

export interface AuthStatusResult {
  isAuthenticated: boolean;
  isRegistered: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  sessionToken: string | null;
}

/**
 * Resolves current authentication status on the server.
 * Verifies active session token against database to ensure session is not revoked.
 */
export async function getServerAuthStatus(): Promise<AuthStatusResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        isAuthenticated: false,
        isRegistered: false,
        isAdmin: false,
        user: null,
        sessionToken: null,
      };
    }

    const user = session.user as unknown as AuthUser;
    const sessionToken = (user as unknown as { sessionToken?: string }).sessionToken || null;

    if (sessionToken) {
      const dbSession = await prisma.userSession.findUnique({
        where: { sessionToken },
        select: { isActive: true },
      });

      if (!dbSession || !dbSession.isActive) {
        return {
          isAuthenticated: false,
          isRegistered: false,
          isAdmin: false,
          user: null,
          sessionToken: null,
        };
      }

      // Non-blocking heartbeat update
      touchSession(sessionToken).catch(() => {});
    }

    const isSystemAdmin = user.role === "ADMIN";
    return {
      isAuthenticated: true,
      isRegistered: true,
      isAdmin: isSystemAdmin,
      user,
      sessionToken,
    };
  } catch {
    return {
      isAuthenticated: false,
      isRegistered: false,
      isAdmin: false,
      user: null,
      sessionToken: null,
    };
  }
}

/**
 * Asserts user is authenticated and session is active.
 * Throws 401 Unauthorized Error if unauthenticated.
 */
export async function requireAuth(): Promise<AuthUser> {
  const status = await getServerAuthStatus();
  if (!status.isAuthenticated || !status.user) {
    throw new Error("UNAUTHORIZED");
  }
  return status.user;
}

/**
 * Asserts user has ADMIN role.
 * Throws 403 Forbidden Error if not an administrator.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
