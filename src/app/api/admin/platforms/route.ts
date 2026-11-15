import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAdminPlatforms,
  createPlatform,
} from "@/features/admin/server/admin-links.service";
import { PlatformUpsertInput } from "@/features/admin/types/admin.types";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const platforms = await getAdminPlatforms();
    return NextResponse.json({ success: true, platforms });
  } catch (error) {
    console.error("Admin platforms GET error:", error);
    return NextResponse.json(
      { success: false, error: "فشل استرجاع دليل المنصات" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body: PlatformUpsertInput = await request.json();

    if (!body.slug?.trim() || !body.nameAr?.trim() || !body.nameEn?.trim()) {
      return NextResponse.json(
        { success: false, error: "رمز المنصة واسمها بالعربية والإنجليزية حقول مطلوبة" },
        { status: 400 }
      );
    }

    const platform = await createPlatform(body);
    return NextResponse.json({ success: true, platform }, { status: 201 });
  } catch (error) {
    console.error("Admin platform POST error:", error);
    const message = error instanceof Error ? error.message : "فشل إنشاء المنصة";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

