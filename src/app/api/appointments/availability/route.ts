import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getCreatorAvailability,
  saveCreatorAvailability,
} from "@/features/appointments";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const rules = await getCreatorAvailability(session.user.id);
    return NextResponse.json({ success: true, availability: rules });
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
    if (!Array.isArray(body.rules)) {
      return NextResponse.json(
        { success: false, error: "قائمة أوقات العمل غير صالحة" },
        { status: 400 }
      );
    }

    const rules = await saveCreatorAvailability(session.user.id, body.rules);
    return NextResponse.json({ success: true, availability: rules });
  } catch (error) {
    console.error("Save availability error:", error);
    return NextResponse.json(
      { success: false, error: "فشل حفظ جدول أوقات العمل" },
      { status: 500 }
    );
  }
}
