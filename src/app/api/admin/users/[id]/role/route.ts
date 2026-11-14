import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { toggleUserRole } from "@/features/admin/services/admin.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const body = await request.json();
    if (body.role !== "ADMIN" && body.role !== "USER") {
      return NextResponse.json(
        { success: false, error: "يجب تحديد الرتبة: ADMIN أو USER" },
        { status: 400 }
      );
    }

    const res = await toggleUserRole(id, body.role, guard.user.id);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: res.error }, { status: res.status });
    }

    return NextResponse.json(
      {
        success: true,
        message: body.role === "ADMIN" ? "تمت ترقية المستخدم إلى مدير بنجاح" : "تم تحويل المستخدم إلى عميل",
        user: res.user,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
