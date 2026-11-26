import { describe, it, expect, vi, beforeEach } from "vitest";
import { authOptions, verifyPassword } from "@/features/auth/server/auth.options";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { toggleUserSuspension } from "@/features/admin/services/admin.service";
import { prisma } from "@/shared/db";
import { getServerSession } from "next-auth";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

interface NextAuthCredentialsProvider {
  options: {
    authorize: (cred: { email?: string; password?: string }) => Promise<{
      id: string;
      email: string;
      username: string;
      role: string;
    }>;
  };
}

describe("Authentication & RBAC Integration Workflows", () => {
  const provider = authOptions.providers[0] as unknown as NextAuthCredentialsProvider;

  beforeEach(async () => {
    vi.clearAllMocks();
    await prisma.user.updateMany({
      where: { email: "admin@anlinks.dev" },
      data: { isSuspended: false, role: "ADMIN" },
    });
    await prisma.user.updateMany({
      where: { email: "client@anlinks.dev" },
      data: { isSuspended: false, role: "USER" },
    });
  });

  it("should authenticate System Admin and assign ADMIN role", async () => {
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@anlinks.dev" },
      include: { profile: true },
    });

    expect(adminUser).toBeDefined();
    expect(adminUser?.role).toBe("ADMIN");
    expect(adminUser?.username).toBe("sysadmin");

    const isValid = await verifyPassword("Admin@123456", adminUser!.passwordHash!);
    expect(isValid).toBe(true);

    const authResult = await provider.options.authorize({
      email: "admin@anlinks.dev",
      password: "Admin@123456",
    });

    expect(authResult.id).toBe(adminUser!.id);
    expect(authResult.role).toBe("ADMIN");
    expect(authResult.username).toBe("sysadmin");
  });

  it("should authenticate Client and assign USER role", async () => {
    const clientUser = await prisma.user.findUnique({
      where: { email: "client@anlinks.dev" },
      include: { profile: true },
    });

    expect(clientUser).toBeDefined();
    expect(clientUser?.role).toBe("USER");
    expect(clientUser?.username).toBe("faisal_client");

    const authResult = await provider.options.authorize({
      email: "client@anlinks.dev",
      password: "Client@123456",
    });

    expect(authResult.id).toBe(clientUser!.id);
    expect(authResult.role).toBe("USER");
  });

  it("should reject login with wrong password", async () => {
    await expect(
      provider.options.authorize({
        email: "client@anlinks.dev",
        password: "WrongPassword999!",
      })
    ).rejects.toThrow("بيانات الاعتماد غير صحيحة");
  });

  it("should block unauthenticated access to admin endpoints with 401", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const guardResult = await requireAdminSession();
    expect(guardResult.authorized).toBe(false);
    if (!guardResult.authorized) {
      expect(guardResult.response.status).toBe(401);
      const json = await guardResult.response.json();
      expect(json.error).toContain("غير مصرح");
    }
  });

  it("should block regular client from admin endpoints with 403 Forbidden", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: {
        id: "client-id",
        email: "client@anlinks.dev",
        username: "faisal_client",
        role: "USER",
      },
      expires: "9999",
    });

    const guardResult = await requireAdminSession();
    expect(guardResult.authorized).toBe(false);
    if (!guardResult.authorized) {
      expect(guardResult.response.status).toBe(403);
      const json = await guardResult.response.json();
      expect(json.error).toContain("صلاحية الوصول");
    }
  });

  it("should allow admin access to operator endpoints", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: {
        id: "admin-id",
        email: "admin@anlinks.dev",
        username: "sysadmin",
        role: "ADMIN",
      },
      expires: "9999",
    });

    const guardResult = await requireAdminSession();
    expect(guardResult.authorized).toBe(true);
    if (guardResult.authorized) {
      expect(guardResult.user.role).toBe("ADMIN");
      expect(guardResult.user.username).toBe("sysadmin");
    }
  });

  it("should prevent admin from self-suspension (Self-Suspension Guard)", async () => {
    const admin = await prisma.user.findUnique({ where: { username: "sysadmin" } });
    expect(admin).toBeDefined();

    const res = await toggleUserSuspension(admin!.id, true, admin!.id);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
    expect(res.error).toContain("لا يمكن للمشغّل إيقاف حسابه الشخصي");
  });
});
