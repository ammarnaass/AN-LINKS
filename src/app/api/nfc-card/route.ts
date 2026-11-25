import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import {
  getOrCreateUserNfcCard,
  updateUserNfcCard,
} from "@/features/nfc-card/services/nfc-card.service";

async function resolveSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const rawUser = session?.user as { id?: string; email?: string | null } | undefined;
  if (rawUser?.id) return rawUser.id;
  if (rawUser?.email) {
    const u = await prisma.user.findUnique({
      where: { email: rawUser.email },
      select: { id: true },
    });
    return u?.id || null;
  }
  return null;
}

export async function GET() {
  try {
    const userId = await resolveSessionUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }
    const card = await getOrCreateUserNfcCard(userId);
    return NextResponse.json({ success: true, card }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "تعذر جلب بيانات بطاقة NFC";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await resolveSessionUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const card = await updateUserNfcCard(userId, body);
    return NextResponse.json({
      success: true,
      message: "تم حفظ إعدادات وتصميم بطاقة NFC بنجاح",
      card,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل حفظ إعدادات البطاقة";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
