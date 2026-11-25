import { NextResponse } from "next/server";
import { getPublicOAuthStatuses } from "@/features/admin/services/oauth-settings.service";

export async function GET() {
  try {
    const providers = await getPublicOAuthStatuses();
    return NextResponse.json(
      { success: true, providers },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      {
        success: true,
        providers: [
          { provider: "google", label: "Google", isEnabled: false },
          { provider: "facebook", label: "Facebook", isEnabled: false },
          { provider: "apple", label: "Apple", isEnabled: false },
        ],
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
