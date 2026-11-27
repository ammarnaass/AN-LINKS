import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getCreatorServices,
  createCreatorService,
} from "@/features/appointments";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }
    const services = await getCreatorServices(session.user.id);
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب باقات الخدمات" },
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
    const service = await createCreatorService(session.user.id, {
      title: body.title,
      description: body.description,
      durationMinutes: Number(body.durationMinutes) || 30,
      price: Number(body.price) || 0,
      currency: body.currency || "SAR",
      meetingType: body.meetingType || "ONLINE",
      meetingLocation: body.meetingLocation,
      bufferMinutes: body.bufferMinutes !== undefined ? Number(body.bufferMinutes) : 10,
      intakePrompt: body.intakePrompt,
      isActive: body.isActive !== false,
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل إنشاء باقة الخدمة";
    if (msg.startsWith("QUOTA_")) {
      return NextResponse.json(
        { success: false, error: msg.replace(/^QUOTA_[A-Z_]+:\s*/, "") },
        { status: 403 }
      );
    }
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
