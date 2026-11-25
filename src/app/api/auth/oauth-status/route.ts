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
          { provider: "google", label: "Google", isEnabled: false, showWhenDisabled: true },
          { provider: "facebook", label: "Facebook", isEnabled: false, showWhenDisabled: true },
          { provider: "apple", label: "Apple", isEnabled: false, showWhenDisabled: true },
        ],
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
