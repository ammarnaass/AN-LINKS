import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getCreatorAvailabilityConfig,
  saveCreatorAvailability,
  addCreatorAvailabilityException,
  deleteCreatorAvailabilityException,
} from "@/features/appointments";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const config = await getCreatorAvailabilityConfig(session.user.id);
    return NextResponse.json({ success: true, ...config });
  } catch (error) {
    console.error("Fetch availability error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب جدول أوقات العمل" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();

    if (body.action === "add_exception") {
      const exception = await addCreatorAvailabilityException(
        session.user.id,
        body.date,
        body.reason
      );
      return NextResponse.json({ success: true, exception }, { status: 201 });
    }

    if (!Array.isArray(body.rules)) {
      return NextResponse.json(
        { success: false, error: "قائمة أوقات العمل غير صالحة" },
        { status: 400 }
      );
    }

    const rules = await saveCreatorAvailability(
      session.user.id,
      body.rules,
      body.timezone
    );
    return NextResponse.json({ success: true, availability: rules });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل حفظ جدول أوقات العمل";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const exceptionId = new URL(req.url).searchParams.get("exceptionId");
    if (!exceptionId) {
      return NextResponse.json({ success: false, error: "معرف العطلة مطلوب" }, { status: 400 });
    }

    await deleteCreatorAvailabilityException(session.user.id, exceptionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete exception error:", error);
    return NextResponse.json(
      { success: false, error: "فشل حذف تاريخ الإجازة" },
      { status: 500 }
    );
  }
}
