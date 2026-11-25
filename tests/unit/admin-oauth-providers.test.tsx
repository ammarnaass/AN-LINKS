import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import {
  getAdminOAuthProviders,
  updateOAuthProviderConfig,
  getActiveRuntimeOAuthConfigs,
  invalidateOAuthProviderCache,
} from "@/features/admin/services/oauth-settings.service";
import { buildDynamicAuthOptions } from "@/features/auth/server/auth.options";
import { GET as adminOAuthGet, PUT as adminOAuthPut } from "@/app/api/admin/auth-providers/route";
import { GET as publicOAuthStatusGet } from "@/app/api/auth/oauth-status/route";
import { SocialOAuthButtons } from "@/features/auth/components/GoogleAuthButton";
import { AdminSidebarNavList } from "@/features/admin/components/sidebar/AdminSidebarNavList";
import { AdminAuthProvidersTab } from "@/features/admin/components/AdminAuthProvidersTab";
import { prisma } from "@/shared/db";
import * as adminGuard from "@/features/admin/server/admin.guard";

describe("Admin OAuth Providers (Google, Facebook, Apple) Suite", () => {
  const TEST_ENC_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const origEncKey = process.env.PAYMENT_ENCRYPTION_KEY;

  beforeEach(async () => {
    process.env.PAYMENT_ENCRYPTION_KEY = process.env.PAYMENT_ENCRYPTION_KEY || TEST_ENC_KEY;
    invalidateOAuthProviderCache();
    await prisma.oAuthProviderConfig.deleteMany({
      where: { provider: { in: ["google", "facebook", "apple"] } },
    });
  });

  afterAll(async () => {
    await prisma.oAuthProviderConfig.deleteMany({
      where: { provider: { in: ["google", "facebook", "apple"] } },
    });
    if (origEncKey) {
      process.env.PAYMENT_ENCRYPTION_KEY = origEncKey;
    }
    await prisma.$disconnect();
  });

  it("encrypts clientSecret with AES-256-GCM, masks GET output, and preserves secret on toggle", async () => {
    await updateOAuthProviderConfig({
      provider: "google",
      isEnabled: true,
      clientId: "google-client-123.apps.googleusercontent.com",
      clientSecret: "GOCSPX-super-secret-value-9876",
    });

    const dbRow = await prisma.oAuthProviderConfig.findUnique({ where: { provider: "google" } });
    expect(dbRow).not.toBeNull();
    expect(dbRow?.clientSecretEncrypted).toBeTruthy();
    expect(dbRow?.clientSecretEncrypted).not.toContain("super-secret-value");

    const maskedList = await getAdminOAuthProviders();
    const googleDto = maskedList.find((p) => p.provider === "google");
    expect(googleDto?.isEnabled).toBe(true);
    expect(googleDto?.hasSecret).toBe(true);
    expect(googleDto?.secretPreview).toContain("9876");
    expect(googleDto?.secretPreview).not.toContain("super-secret");

    // Disable without re-sending secret -> encrypted secret stays preserved
    await updateOAuthProviderConfig({
      provider: "google",
      isEnabled: false,
      clientId: "google-client-123.apps.googleusercontent.com",
    });
    const afterToggle = await getAdminOAuthProviders();
    expect(afterToggle.find((p) => p.provider === "google")?.hasSecret).toBe(true);
  });

  it("rejects enabling a provider without clientId and clientSecret", async () => {
    await expect(
      updateOAuthProviderConfig({
        provider: "facebook",
        isEnabled: true,
        clientId: "",
        clientSecret: "",
      })
    ).rejects.toThrow(/Client ID/);
  });

  it("loads enabled Google, Facebook, and Apple providers dynamically into NextAuth options", async () => {
    await updateOAuthProviderConfig({
      provider: "facebook",
      isEnabled: true,
      clientId: "fb-app-id-111",
      clientSecret: "fb-secret-222",
    });
    await updateOAuthProviderConfig({
      provider: "apple",
      isEnabled: true,
      clientId: "dev.anlinks.signin",
      clientSecret: "apple-jwt-secret-333",
      extraConfig: { teamId: "TEAM123", keyId: "KEY456" },
    });

    const runtime = await getActiveRuntimeOAuthConfigs();
    expect(runtime.map((r) => r.provider)).toEqual(["facebook", "apple"]);

    const options = await buildDynamicAuthOptions();
    const providerIds = options.providers.map((p) => p.id);
    expect(providerIds).toContain("facebook");
    expect(providerIds).toContain("apple");
    expect(providerIds).toContain("credentials");
  });

  it("enforces admin RBAC guard on /api/admin/auth-providers GET and PUT", async () => {
    vi.spyOn(adminGuard, "requireAdminSession").mockResolvedValueOnce({
      authorized: false,
      response: new Response(JSON.stringify({ success: false }), { status: 403 }) as never,
    });

    const forbidden = await adminOAuthGet();
    expect(forbidden.status).toBe(403);

    vi.spyOn(adminGuard, "requireAdminSession").mockResolvedValue({
      authorized: true,
      user: {
        id: "admin_test_id",
        username: "admin",
        role: "ADMIN",
      },
    });

    const putReq = new NextRequest("http://localhost:3000/api/admin/auth-providers", {
      method: "PUT",
      body: JSON.stringify({
        provider: "google",
        isEnabled: true,
        clientId: "g-id",
        clientSecret: "g-sec-1234",
      }),
    });
    const putRes = await adminOAuthPut(putReq);
    expect(putRes.status).toBe(200);
    const json = await putRes.json();
    expect(json.success).toBe(true);
    expect(json.providers).toHaveLength(3);
  });

  it("renders OAuth Settings link in AdminSidebarNavList and mounts AdminAuthProvidersTab", () => {
    const sidebarHtml = renderToStaticMarkup(
      <AdminSidebarNavList
        activeTab="auth_providers"
        onTabChange={vi.fn()}
        isCollapsedView={false}
      />
    );
    expect(sidebarHtml).toContain("إعدادات الدخول (OAuth)");

    const tabHtml = renderToStaticMarkup(<AdminAuthProvidersTab />);
    expect(tabHtml).toContain("animate-pulse");
  });

  it("exposes safe public oauth-status and always renders Google, Facebook, and Apple in auth UI", async () => {
    const res = await publicOAuthStatusGet();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.providers.map((p: { provider: string }) => p.provider)).toEqual([
      "google",
      "facebook",
      "apple",
    ]);

    const loginButtonsHtml = renderToStaticMarkup(<SocialOAuthButtons mode="login" />);
    expect(loginButtonsHtml).toContain("Google");
    expect(loginButtonsHtml).toContain("Facebook");
    expect(loginButtonsHtml).toContain("Apple");
    expect(loginButtonsHtml).toContain("بانتظار التفعيل");

    const registerButtonsHtml = renderToStaticMarkup(<SocialOAuthButtons mode="register" />);
    expect(registerButtonsHtml).toContain("التسجيل عبر Google");
    expect(registerButtonsHtml).toContain("التسجيل عبر Facebook");
    expect(registerButtonsHtml).toContain("التسجيل عبر Apple");
  });
});
