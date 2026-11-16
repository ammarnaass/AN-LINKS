import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { sanitizeCustomBackground } from "@/features/appearance/utils/sanitizer";

const VALID_BUTTON_STYLES = new Set(["filled", "glass", "soft", "outline"]);
const VALID_BUTTON_SHADOWS = new Set(["none", "soft", "strong", "glow"]);
const VALID_BORDER_RADII = new Set(["rounded-none", "rounded-md", "rounded-xl", "rounded-full"]);
const VALID_FONTS = new Set(["Cairo", "Tajawal", "IBMPlex", "Almarai", "ReadexPro"]);
const VALID_BACKGROUND_TYPES = new Set(["THEME", "SOLID", "GRADIENT"]);
const VALID_SOCIAL_POSITIONS = new Set(["top", "bottom"]);

function validateProfileEnums(body: Record<string, unknown>): string | null {
  if (body.buttonStyle !== undefined && (typeof body.buttonStyle !== "string" || !VALID_BUTTON_STYLES.has(body.buttonStyle))) {
    return "قيمة نمط الزر غير صالحة";
  }
  if (body.buttonShadow !== undefined && (typeof body.buttonShadow !== "string" || !VALID_BUTTON_SHADOWS.has(body.buttonShadow))) {
    return "قيمة ظل الزر غير صالحة";
  }
  if (body.borderRadius !== undefined && (typeof body.borderRadius !== "string" || !VALID_BORDER_RADII.has(body.borderRadius))) {
    return "قيمة استدارة الحواف غير صالحة";
  }
  if (body.font !== undefined && (typeof body.font !== "string" || !VALID_FONTS.has(body.font))) {
    return "قيمة الخط غير صالحة";
  }
  if (body.backgroundType !== undefined && (typeof body.backgroundType !== "string" || !VALID_BACKGROUND_TYPES.has(body.backgroundType))) {
    return "قيمة نوع الخلفية غير صالحة";
  }
  if (body.socialPosition !== undefined && (typeof body.socialPosition !== "string" || !VALID_SOCIAL_POSITIONS.has(body.socialPosition))) {
    return "قيمة موضع روابط التواصل غير صالحة";
  }
  return null;
}

function validateAndExtractCustomBackground(bg: unknown): { value: string | null; error?: string } {
  if (bg === null || bg === "") {
    return { value: null };
  }
  if (typeof bg !== "string") {
    return { value: null, error: "قيمة الخلفية المخصصة يجب أن تكون نصية" };
  }
  const sanitized = sanitizeCustomBackground(bg);
  if (!sanitized) {
    return { value: null, error: "قيمة الخلفية المخصصة غير صالحة أو غير آمنة" };
  }
  return { value: sanitized };
}

function parseProfileUpdates(body: Record<string, unknown>, data: Record<string, unknown>): void {
  const textFields = ["displayName", "bio", "themeKey"] as const;
  for (const f of textFields) {
    if (typeof body[f] === "string") data[f] = (body[f] as string).trim();
  }
  const nullableFields = ["avatarUrl", "phone"] as const;
  for (const f of nullableFields) {
    if (typeof body[f] === "string") data[f] = (body[f] as string).trim() || null;
    else if (body[f] === null) data[f] = null;
  }
  const enumFields = ["buttonStyle", "buttonShadow", "borderRadius", "font", "backgroundType", "socialPosition"] as const;
  for (const f of enumFields) {
    if (typeof body[f] === "string") data[f] = body[f];
  }
  if (typeof body.accentColor === "string") data.accentColor = body.accentColor.trim();
  if (typeof body.seoIndexing === "boolean") data.seoIndexing = body.seoIndexing;
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;
}

function buildDefaultProfileData(userId: string, displayName: string, overrides: Record<string, unknown> = {}) {
  return {
    userId,
    displayName: (overrides.displayName as string) || displayName || "مستخدم جديد",
    bio: (overrides.bio as string) || "",
    avatarUrl: (overrides.avatarUrl as string) || null,
    phone: (overrides.phone as string) || null,
    seoIndexing: typeof overrides.seoIndexing === "boolean" ? overrides.seoIndexing : true,
    themeKey: (overrides.themeKey as string) || "layanDark",
    accentColor: (overrides.accentColor as string) || "#4edea3",
    buttonStyle: (overrides.buttonStyle as string) || "filled",
    buttonShadow: (overrides.buttonShadow as string) || "none",
    borderRadius: (overrides.borderRadius as string) || "rounded-xl",
    font: (overrides.font as string) || "Cairo",
    backgroundType: (overrides.backgroundType as string) || "THEME",
    customBackground: (overrides.customBackground as string) || null,
    socialPosition: (overrides.socialPosition as string) || "top",
    isPublished: typeof overrides.isPublished === "boolean" ? overrides.isPublished : true,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });
    }

    const profile = user.profile || (await prisma.profile.create({
      data: buildDefaultProfileData(user.id, user.username),
    }));

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب الملف الشخصي" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const enumError = validateProfileEnums(body);
    if (enumError) {
      return NextResponse.json({ success: false, error: enumError }, { status: 400 });
    }

    if (body.accentColor !== undefined && (typeof body.accentColor !== "string" || !/^#([0-9a-fA-F]{3,8})$/.test(body.accentColor.trim()))) {
      return NextResponse.json({ success: false, error: "قيمة لون التمييز غير صالحة" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (body.customBackground !== undefined) {
      const bgResult = validateAndExtractCustomBackground(body.customBackground);
      if (bgResult.error) {
        return NextResponse.json({ success: false, error: bgResult.error }, { status: 400 });
      }
      data.customBackground = bgResult.value;
    }

    parseProfileUpdates(body, data);

    const updated = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: data,
      create: buildDefaultProfileData(session.user.id, session.user.name || "مستخدم جديد", data),
    });

    return NextResponse.json({ success: true, profile: updated }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء حفظ التعديلات" }, { status: 500 });
  }
}
