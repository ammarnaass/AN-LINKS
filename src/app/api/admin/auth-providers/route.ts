import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAdminOAuthProviders,
  updateOAuthProviderConfig,
  isValidOAuthProvider,
} from "@/features/admin/services/oauth-settings.service";
import { prisma } from "@/shared/db";

/**
 * Lists masked OAuth provider settings (Google, Facebook, Apple) for System Admins.
 */
export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const providers = await getAdminOAuthProviders();
  return NextResponse.json({ success: true, providers }, { status: 200 });
}

/**
 * Updates and encrypts OAuth provider credentials for Google, Facebook, or Apple.
 */
export async function PUT(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body = await request.json().catch(() => ({}));
    const provider = typeof body.provider === "string" ? body.provider.trim().toLowerCase() : "";

    if (!isValidOAuthProvider(provider)) {
      return NextResponse.json(
        { success: false, error: "مزود المصادقة غير صالح" },
        { status: 400 }
      );
    }

    const providers = await updateOAuthProviderConfig({
      provider,
      isEnabled: Boolean(body.isEnabled),
      clientId: typeof body.clientId === "string" ? body.clientId : undefined,
      clientSecret: typeof body.clientSecret === "string" ? body.clientSecret : undefined,
      extraConfig:
        body.extraConfig && typeof body.extraConfig === "object" ? body.extraConfig : undefined,
    });

    await prisma.securityAuditLog
      .create({
        data: {
          userId: guard.user.id,
          eventType: "ADMIN_OAUTH_PROVIDER_UPDATE",
          details: { provider, isEnabled: Boolean(body.isEnabled) },
        },
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      message: "تم حفظ إعدادات الدخول وتشفير المفاتيح بنجاح",
      providers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل حفظ إعدادات المزود";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
