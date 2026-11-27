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
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "عنوان الخدمة مطلوب" },
        { status: 400 }
      );
    }

    const duration = Number(body.durationMinutes) || 30;
    if (duration <= 0 || duration > 480) {
      return NextResponse.json(
        { success: false, error: "مدة الخدمة غير صالحة" },
        { status: 400 }
      );
    }

    const service = await createCreatorService(session.user.id, {
      title: body.title,
      description: body.description,
      durationMinutes: duration,
      price: Number(body.price) || 0,
      currency: body.currency || "SAR",
      isActive: body.isActive !== false,
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { success: false, error: "فشل إنشاء باقة الخدمة" },
      { status: 500 }
    );
  }
}
