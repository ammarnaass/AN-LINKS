import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { verifyUnsubscribeSignature } from "@/lib/html-escape";

interface RouteParams {
  params: Promise<{ username: string }>;
}

async function handleUnsubscribe(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const { username } = await params;
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";
  const sig = request.nextUrl.searchParams.get("sig")?.trim() || "";

  if (!username || !email || !sig) {
    return NextResponse.json(
      { success: false, error: "رابط إلغاء الاشتراك غير مكتمل" },
      { status: 400 }
    );
  }

  const creator = await prisma.user.findUnique({
    where: { username: username.toLowerCase().trim() },
    select: { id: true, profile: { select: { displayName: true } } },
  });

  if (!creator || !verifyUnsubscribeSignature(creator.id, email, sig)) {
    return NextResponse.json(
      { success: false, error: "توقيع إلغاء الاشتراك غير صالح أو منتهي" },
      { status: 403 }
    );
  }

  await prisma.creatorSubscriber.updateMany({
    where: { creatorId: creator.id, email },
    data: { status: "UNSUBSCRIBED" },
  });

  if (request.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json({
      success: true,
      message: "تم إلغاء اشتراكك في النشرة البريدية بنجاح.",
    });
  }

  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><body style="font-family:sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;"><div style="max-width:440px;padding:32px;background:#1e293b;border-radius:16px;text-align:center;"><h2>تم إلغاء الاشتراك</h2><p style="color:#cbd5e1;">لن تصلك رسائل بريدية مستقبلية من هذه القائمة عبر AN LINKS.</p></div></body></html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: NextRequest, context: RouteParams) {
  return handleUnsubscribe(request, context);
}

export async function POST(request: NextRequest, context: RouteParams) {
  return handleUnsubscribe(request, context);
}
