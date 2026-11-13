import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/tracking-service";

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent");
  await recordPageView(username, userAgent, request.headers);

  return NextResponse.json({ success: true });
}
