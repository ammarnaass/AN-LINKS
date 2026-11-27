import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { validateAiSettings, AiSettingsInput } from "@/features/settings/validators/ai-settings.validator";
import { getActiveSubscription } from "@/features/settings/server/subscription.service";

interface StoredAiPrefs extends AiSettingsInput {
  totalGenerations: number;
}

function parseAiPrefs(raw: unknown): StoredAiPrefs {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    tone: (typeof obj.tone === "string" ? obj.tone : "professional") as AiSettingsInput["tone"],
    niche: typeof obj.niche === "string" && obj.niche.trim() ? obj.niche : "صانع محتوى محترف",
    autoSuggestTitle: obj.autoSuggestTitle !== false,
    totalGenerations: typeof obj.totalGenerations === "number" ? obj.totalGenerations : 0,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const [profile, sub] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { aiPreferences: true },
      }),
      getActiveSubscription(session.user.id),
    ]);

    const current = parseAiPrefs(profile?.aiPreferences);
    const allowed = session.user.role === "ADMIN" || Boolean(sub.quotas.allowAiCopilot);

    return NextResponse.json({
      success: true,
      data: current,
      quota: {
        model: "Gemini 2.5 Flash",
        status: allowed ? "ACTIVE" : "LOCKED",
        allowed,
        tier: sub.plan.slug.toUpperCase(),
        planName: sub.plan.nameAr,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل جلب إعدادات الذكاء الاصطناعي";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const validation = validateAiSettings(body);
    if (!validation.valid || !validation.data) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { aiPreferences: true },
    });
    const prev = parseAiPrefs(existingProfile?.aiPreferences);
    const updated: StoredAiPrefs = {
      ...validation.data,
      totalGenerations: prev.totalGenerations,
    };

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: { aiPreferences: updated as object },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "تم حفظ تفضيلات وإعدادات الذكاء الاصطناعي بنجاح",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل حفظ إعدادات الذكاء الاصطناعي";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
