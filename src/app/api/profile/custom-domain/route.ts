import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getUserCustomDomain,
  setCustomDomain,
  verifyCustomDomain,
  removeCustomDomain,
} from "@/features/domains";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const domainData = await getUserCustomDomain(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        customDomain: domainData?.customDomain || null,
        domainVerified: domainData?.domainVerified || false,
        verificationToken: domainData?.domainVerificationToken || null,
        domainVerifiedAt: domainData?.domainVerifiedAt || null,
        instructions: {
          cname: {
            type: "CNAME",
            name: "@ (أو النطاق الفرعي)",
            target: "cname.anlinks.dev",
          },
          txt: {
            type: "TXT",
            name: "@",
            value: domainData?.domainVerificationToken
              ? `anlinks-verification=${domainData.domainVerificationToken}`
              : null,
          },
        },
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "فشل جلب إعدادات النطاق المخصص";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ success: false, error: "اسم النطاق مطلوب" }, { status: 400 });
    }

    const result = await setCustomDomain(session.user.id, domain);

    return NextResponse.json({
      success: true,
      message: "تم حفظ النطاق بنجاح، يُرجى إضافة سجلات DNS للتحقق",
      data: result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "فشل حفظ النطاق المخصص";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const result = await verifyCustomDomain(session.user.id);

    if (result.verified) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: "تم التحقق من النطاق وتفعيله بنجاح!",
        data: result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: result.reason || "لم يكتمل انتشار سجلات DNS بعد. قد يستغرق ذلك بضع دقائق.",
      },
      { status: 422 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "فشل التحقق من النطاق";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    await removeCustomDomain(session.user.id);

    return NextResponse.json({
      success: true,
      message: "تم إزالة النطاق المخصص بنجاح",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "فشل إزالة النطاق المخصص";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
