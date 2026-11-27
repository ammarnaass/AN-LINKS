import { describe, it, expect } from "vitest";
import { getServerAuthStatus } from "@/features/auth/server/session-guard";
import { vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from "next-auth";

describe("Admin Role Strictly Enforced RBAC Suite", () => {
  it("does NOT elevate hardcoded admin@anlinks.dev email when session role is USER", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: {
        id: "admin-1",
        email: "admin@anlinks.dev",
        username: "sysadmin",
        role: "USER",
      },
    });

    const status = await getServerAuthStatus();
    expect(status.isAuthenticated).toBe(true);
    expect(status.isAdmin).toBe(false);
    expect(status.user?.role).toBe("USER");
  });

  it("recognizes verified ADMIN role cleanly", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: {
        id: "admin-1",
        email: "admin@anlinks.dev",
        username: "sysadmin",
        role: "ADMIN",
      },
    });

    const status = await getServerAuthStatus();
    expect(status.isAuthenticated).toBe(true);
    expect(status.isAdmin).toBe(true);
    expect(status.user?.role).toBe("ADMIN");
  });

  it("recognizes standard user as non-admin", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: {
        id: "user-1",
        email: "normal@example.com",
        username: "normaluser",
        role: "USER",
      },
    });

    const status = await getServerAuthStatus();
    expect(status.isAuthenticated).toBe(true);
    expect(status.isAdmin).toBe(false);
    expect(status.user?.role).toBe("USER");
  });
});
