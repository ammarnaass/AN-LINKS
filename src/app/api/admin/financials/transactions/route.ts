import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getAdminTransactions } from "@/features/admin/server/admin-financials.service";

export async function GET(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const statusParam = searchParams.get("status");
  const gatewayParam = searchParams.get("gateway");

  const page = pageParam ? parseInt(pageParam, 10) : undefined;
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const status = statusParam || undefined;
  const gateway = gatewayParam || undefined;

  try {
    const result = await getAdminTransactions({
      page,
      limit,
      status,
      gateway,
    });

    return NextResponse.json({ success: true, data: result, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل جلب المعاملات والفواتير المالية";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
