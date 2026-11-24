import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { updateUserLocation } from "@/features/admin/server/admin-user-location.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const body = await request.json();
    const location = typeof body.location === "string" ? body.location : null;

    const res = await updateUserLocation(id, location);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: res.error }, { status: res.status });
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث الموقع الجغرافي للمستخدم بنجاح",
        location: res.location,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "طلب غير صالح" }, { status: 400 });
  }
}
