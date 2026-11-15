import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  updatePlatform,
  deletePlatform,
} from "@/features/admin/server/admin-links.service";
import { PlatformUpsertInput } from "@/features/admin/types/admin.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const { id } = await params;
    const body: Partial<PlatformUpsertInput> = await request.json();

    const platform = await updatePlatform(id, body);
    return NextResponse.json({ success: true, platform });
  } catch (error) {
    console.error("Admin platform PATCH error:", error);
    const message = error instanceof Error ? error.message : "فشل تعديل المنصة";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const { id } = await params;
    await deletePlatform(id);
    return NextResponse.json({ success: true, message: "تم حذف المنصة بنجاح", id });
  } catch (error) {
    console.error("Admin platform DELETE error:", error);
    const message = error instanceof Error ? error.message : "فشل حذف المنصة";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

