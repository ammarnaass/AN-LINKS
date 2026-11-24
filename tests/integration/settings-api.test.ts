import { describe, it, expect, vi } from "vitest";
import { GET as getProfile, PUT as putProfile } from "@/app/api/settings/profile/route";
import { POST as postPassword } from "@/app/api/settings/security/password/route";
import { GET as get2FA, POST as post2FA } from "@/app/api/settings/security/2fa/route";
import { GET as getPayouts, POST as postPayouts } from "@/app/api/settings/payouts/route";
import { GET as getSubscription, POST as postSubscription } from "@/app/api/settings/subscription/route";
import { NextRequest } from "next/server";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}));

describe("Settings API Endpoints - Unauthorized Access Protection", () => {
  it("should return 401 on GET /api/settings/profile when unauthorized", async () => {
    const res = await getProfile();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("should return 401 on PUT /api/settings/profile when unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/settings/profile", {
      method: "PUT",
      body: JSON.stringify({ displayName: "Test", email: "test@example.com", username: "testuser" }),
    });
    const res = await putProfile(req);
    expect(res.status).toBe(401);
  });

  it("should return 401 on POST /api/settings/security/password when unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/settings/security/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "123", newPassword: "456", confirmPassword: "456" }),
    });
    const res = await postPassword(req);
    expect(res.status).toBe(401);
  });

  it("should return 401 on GET & POST /api/settings/security/2fa when unauthorized", async () => {
    const getRes = await get2FA();
    expect(getRes.status).toBe(401);

    const postReq = new NextRequest("http://localhost:3000/api/settings/security/2fa", {
      method: "POST",
      body: JSON.stringify({ action: "setup" }),
    });
    const postRes = await post2FA(postReq);
    expect(postRes.status).toBe(401);
  });

  it("should return 401 on GET & POST /api/settings/payouts when unauthorized", async () => {
    const getRes = await getPayouts();
    expect(getRes.status).toBe(401);

    const postReq = new NextRequest("http://localhost:3000/api/settings/payouts", {
      method: "POST",
      body: JSON.stringify({ action: "withdraw", amount: 100 }),
    });
    const postRes = await postPayouts(postReq);
    expect(postRes.status).toBe(401);
  });

  it("should return 401 on GET & POST /api/settings/subscription when unauthorized", async () => {
    const getRes = await getSubscription();
    expect(getRes.status).toBe(401);

    const postReq = new NextRequest("http://localhost:3000/api/settings/subscription", {
      method: "POST",
      body: JSON.stringify({ action: "cancel" }),
    });
    const postRes = await postSubscription(postReq);
    expect(postRes.status).toBe(401);
  });
});
