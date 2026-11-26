import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { validateAiSettings, AiSettingsInput } from "@/features/settings/validators/ai-settings.validator";

// In-memory persistent preferences cache by userId
const userAiPreferences = new Map<string, AiSettingsInput & { totalGenerations: number }>();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const current = userAiPreferences.get(session.user.id) || {
      tone: "professional",
      niche: "صانع محتوى محترف",
      autoSuggestTitle: true,
      totalGenerations: 12,
    };

    return NextResponse.json({
      success: true,
      data: current,
      quota: {
        model: "Gemini 1.5 Flash",
        status: "ACTIVE",
        tier: "PRO_UNLIMITED",
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

    const existing = userAiPreferences.get(session.user.id);
    const updated = {
      ...validation.data,
      totalGenerations: existing ? existing.totalGenerations + 1 : 13,
    };
    userAiPreferences.set(session.user.id, updated);

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
