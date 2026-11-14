import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, toggleUserSuspension } from "@/features/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const body = await request.json();
    if (typeof body.isSuspended !== "boolean") {
      return NextResponse.json(
        { success: false, error: "يجب تحديد حالة الإيقاف بصيغة boolean (isSuspended)" },
        { status: 400 }
      );
    }

    const res = await toggleUserSuspension(id, body.isSuspended, guard.user.id);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: res.error }, { status: res.status });
    }

    return NextResponse.json(
      {
        success: true,
        message: body.isSuspended ? "تم إيقاف الحساب بنجاح" : "تم إلغاء إيقاف الحساب بنجاح",
        isSuspended: res.user!.isSuspended,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "طلب غير صالح" }, { status: 400 });
  }
}

