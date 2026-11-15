import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { updateAdminLink } from "@/features/admin/server/admin-links.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const { id } = await params;
    const body: { isActive?: boolean; isPinned?: boolean; isArchived?: boolean } =
      await request.json();

    const link = await updateAdminLink(id, body);
    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error("Admin link PATCH error:", error);
    const message = error instanceof Error ? error.message : "فشل تعديل حالة الرابط";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

