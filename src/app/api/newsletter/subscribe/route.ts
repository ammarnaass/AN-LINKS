import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = body.email;
    const name = body.name;

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال البريد الإلكتروني" },
        { status: 400 }
      );
    }

    const cleanEmail = rawEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "صيغة البريد الإلكتروني غير صالحة" },
        { status: 400 }
      );
    }

    // Associate platform subscribers with the primary system administrator account
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (!adminUser) {
      adminUser = await prisma.user.findFirst({
        select: { id: true },
      });
    }

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "خدمة النشرة غير مهيأة حالياً" },
        { status: 503 }
      );
    }

    await prisma.creatorSubscriber.upsert({
      where: {
        creatorId_email: {
          creatorId: adminUser.id,
          email: cleanEmail,
        },
      },
      update: {
        status: "ACTIVE",
        updatedAt: new Date(),
      },
      create: {
        creatorId: adminUser.id,
        email: cleanEmail,
        name: typeof name === "string" ? name.trim() : null,
        source: "landing_footer",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم انضمامك إلى النشرة البريدية الحصرية بنجاح! تفقد بريدك قريباً 🎉",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تسجيل الاشتراك في النشرة";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
