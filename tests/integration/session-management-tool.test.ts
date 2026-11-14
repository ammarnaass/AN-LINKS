import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/shared/db";
import {
  recordSession,
  getUserActiveSessions,
  revokeUserSession,
  getAllPlatformSessions,
  adminRevokeSession,
} from "@/features/auth/server/session.service";
import { GET as getUserSessions } from "@/app/api/auth/sessions/route";
import { DELETE as deleteUserSession } from "@/app/api/auth/sessions/[id]/route";
import { GET as getAdminSessions } from "@/app/api/admin/sessions/route";
import { DELETE as deleteAdminSession } from "@/app/api/admin/sessions/[id]/route";
import { NextRequest } from "next/server";
import * as nextAuth from "next-auth";

vi.mock("next-auth", async () => {
  const actual = await vi.importActual<typeof nextAuth>("next-auth");
  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});

describe("Session Management Tool (Task 4)", () => {
  let user1: { id: string; email: string; username: string };
  let adminUser: { id: string; email: string; username: string };

  beforeEach(async () => {
    vi.clearAllMocks();

    user1 = await prisma.user.upsert({
      where: { email: "session_user1@anlinks.dev" },
      update: {},
      create: {
        email: "session_user1@anlinks.dev",
        username: "session_user1",
        role: "USER",
      },
    });

    adminUser = await prisma.user.upsert({
      where: { email: "session_admin@anlinks.dev" },
      update: {},
      create: {
        email: "session_admin@anlinks.dev",
        username: "session_admin",
        role: "ADMIN",
      },
    });
  });

  it("1. should record session and parse user agent", async () => {
    const token = `token_${Date.now()}`;
    await recordSession(
      user1.id,
      token,
      "192.168.1.50",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"
    );

    const sessions = await getUserActiveSessions(user1.id, token);
    expect(sessions.length).toBeGreaterThan(0);
    const session = sessions.find((s) => s.sessionToken === token);
    expect(session).toBeDefined();
    expect(session?.deviceType).toBe("mobile");
    expect(session?.os).toContain("iOS");
    expect(session?.browser).toBe("Safari");
    expect(session?.isCurrent).toBe(true);
  });

  it("2. should allow user to revoke own session", async () => {
    const token = `revokable_${Date.now()}`;
    await recordSession(user1.id, token, "127.0.0.1", "Mozilla/5.0 (X11; Linux x86_64)");

    const sessionsBefore = await getUserActiveSessions(user1.id);
    const target = sessionsBefore.find((s) => s.sessionToken === token);
    expect(target).toBeDefined();

    const revoked = await revokeUserSession(target!.id, user1.id);
    expect(revoked).toBe(true);

    const sessionsAfter = await getUserActiveSessions(user1.id);
    expect(sessionsAfter.some((s) => s.id === target!.id)).toBe(false);
  });

  it("3. should handle user sessions route GET and DELETE", async () => {
    const token = `route_token_${Date.now()}`;
    await recordSession(user1.id, token, "10.0.0.1", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: user1.id, email: user1.email, name: "مستخدم", username: user1.username, role: "USER", sessionToken: token },
    });

    const getReq = new NextRequest("http://localhost:3000/api/auth/sessions");
    const getRes = await getUserSessions(getReq);
    const getData = await getRes.json();
    expect(getRes.status).toBe(200);
    expect(getData.sessions.length).toBeGreaterThan(0);

    const currentSession = getData.sessions.find((s: { sessionToken: string }) => s.sessionToken === token);
    expect(currentSession).toBeDefined();

    // Delete session
    const delReq = new NextRequest(`http://localhost:3000/api/auth/sessions/${currentSession.id}`, { method: "DELETE" });
    const delRes = await deleteUserSession(delReq, { params: Promise.resolve({ id: currentSession.id }) });
    expect(delRes.status).toBe(200);
  });

  it("4. should allow admin to view all sessions and revoke any session", async () => {
    vi.mocked(nextAuth.getServerSession).mockResolvedValue({
      user: { id: adminUser.id, email: adminUser.email, name: "مدير", username: adminUser.username, role: "ADMIN" },
    });

    const token = `admin_audit_${Date.now()}`;
    await recordSession(user1.id, token, "1.1.1.1", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");

    const adminGetRes = await getAdminSessions();
    const adminGetData = await adminGetRes.json();
    expect(adminGetRes.status).toBe(200);
    expect(adminGetData.success).toBe(true);
    expect(Array.isArray(adminGetData.sessions)).toBe(true);

    const targetSession = adminGetData.sessions.find((s: { sessionToken: string }) => s.sessionToken === token);
    expect(targetSession).toBeDefined();

    // Admin revoke
    const delReq = new NextRequest(`http://localhost:3000/api/admin/sessions/${targetSession.id}`, { method: "DELETE" });
    const delRes = await deleteAdminSession(delReq, { params: Promise.resolve({ id: targetSession.id }) });
    expect(delRes.status).toBe(200);
  });
});

