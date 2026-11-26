import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  getServerAuthStatus,
  requireAuth,
  requireAdmin,
} from "@/features/auth/server/session-guard";
import { revokeAllOtherSessions } from "@/features/auth/server/session.service";
import { BioOwnerBar } from "@/features/bio/components/BioOwnerBar";
import { setAuthCache, clearAuthCache } from "@/features/auth/hooks/useCurrentUser";

// Mock next-auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

// Mock shared db
vi.mock("@/shared/db", () => ({
  prisma: {
    userSession: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { prisma } from "@/shared/db";

describe("Session Guard & Auth State Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearAuthCache();
  });

  describe("Server Session Guard (getServerAuthStatus, requireAuth, requireAdmin)", () => {
    it("returns unauthenticated when no session is present", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const status = await getServerAuthStatus();
      expect(status.isAuthenticated).toBe(false);
      expect(status.isRegistered).toBe(false);
      expect(status.user).toBeNull();
    });

    it("returns authenticated when session is valid and active in DB", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "u123",
          username: "sami_creator",
          role: "USER",
          sessionToken: "tok_abc_123",
        },
      } as unknown as any);

      vi.mocked(prisma.userSession.findUnique).mockResolvedValueOnce({
        isActive: true,
      } as any);

      const status = await getServerAuthStatus();
      expect(status.isAuthenticated).toBe(true);
      expect(status.isRegistered).toBe(true);
      expect(status.isAdmin).toBe(false);
      expect(status.user?.username).toBe("sami_creator");
    });

    it("rejects session if token was revoked in database", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "u123",
          username: "sami_creator",
          role: "USER",
          sessionToken: "tok_revoked",
        },
      } as unknown as any);

      vi.mocked(prisma.userSession.findUnique).mockResolvedValueOnce({
        isActive: false,
      } as any);

      const status = await getServerAuthStatus();
      expect(status.isAuthenticated).toBe(false);
      expect(status.isRegistered).toBe(false);
      expect(status.user).toBeNull();
    });

    it("throws UNAUTHORIZED on requireAuth when not logged in", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);
      await expect(requireAuth()).rejects.toThrow("UNAUTHORIZED");
    });

    it("throws FORBIDDEN on requireAdmin when role is not ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "u1", username: "creator", role: "USER", sessionToken: "tok1" },
      } as unknown as any);
      vi.mocked(prisma.userSession.findUnique).mockResolvedValueOnce({ isActive: true } as any);

      await expect(requireAdmin()).rejects.toThrow("FORBIDDEN");
    });

    it("passes requireAdmin when user role is ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "u_admin", username: "admin_user", role: "ADMIN", sessionToken: "tok_admin" },
      } as unknown as any);
      vi.mocked(prisma.userSession.findUnique).mockResolvedValueOnce({ isActive: true } as any);

      const user = await requireAdmin();
      expect(user.role).toBe("ADMIN");
      expect(user.username).toBe("admin_user");
    });
  });

  describe("revokeAllOtherSessions Service", () => {
    it("revokes all active sessions except current token", async () => {
      vi.mocked(prisma.userSession.updateMany).mockResolvedValueOnce({ count: 3 } as any);

      const count = await revokeAllOtherSessions("u123", "current_token_active");
      expect(count).toBe(3);
      expect(prisma.userSession.updateMany).toHaveBeenCalledWith({
        where: {
          userId: "u123",
          isActive: true,
          sessionToken: { not: "current_token_active" },
        },
        data: { isActive: false },
      });
    });
  });

  describe("BioOwnerBar Detection", () => {
    it("renders owner control bar when visitor is the profile owner", () => {
      setAuthCache({
        id: "u1",
        username: "faisal_tech",
        role: "USER",
        name: "فيصل",
      });

      vi.mocked(useSession).mockReturnValue({
        data: {
          user: { username: "faisal_tech", role: "USER" },
        },
        status: "authenticated",
      } as any);

      const html = renderToStaticMarkup(<BioOwnerBar username="faisal_tech" />);
      expect(html).toContain("أنت تتصفح صفحتك الشخصية");
      expect(html).toContain('href="/dashboard"');
      expect(html).toContain('href="/dashboard/appearance"');
      expect(html).toContain('href="/dashboard/analytics"');
    });

    it("returns null when visitor is guest or viewing someone else profile", () => {
      vi.mocked(useSession).mockReturnValue({
        data: null,
        status: "unauthenticated",
      } as any);

      const html = renderToStaticMarkup(<BioOwnerBar username="faisal_tech" />);
      expect(html).toBe("");
    });
  });
});
