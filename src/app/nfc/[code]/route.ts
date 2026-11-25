import { NextRequest, NextResponse } from "next/server";
import { resolveNfcScan } from "@/features/nfc-card/services/nfc-card.service";
import { recordPageView } from "@/lib/tracking-service";

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = await params;
  const srcParam = request.nextUrl.searchParams.get("src");
  const source = srcParam === "qr" ? "qr" : "nfc";

  const resolution = await resolveNfcScan(code, source);

  if (resolution.status === "NOT_FOUND") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (resolution.status === "DISABLED") {
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>البطاقة متوقفة مؤقتاً</title></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#090d16;color:#f8fafc;font-family:system-ui,sans-serif;padding:24px"><div style="max-width:420px;text-align:center;background:#111827;border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:32px"><h1 style="font-size:20px;margin:0 0 10px">بطاقة NFC متوقفة مؤقتاً</h1><p style="font-size:14px;color:#94a3b8;line-height:1.7;margin:0 0 20px">قام مالك البطاقة (${resolution.cardTitle}) بإيقاف توجيه هذه البطاقة حالياً.</p><a href="/" style="display:inline-block;padding:10px 20px;border-radius:12px;background:#10b981;color:#052e16;font-weight:700;text-decoration:none;font-size:13px">العودة إلى AN LINKS</a></div></body></html>`;
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  await recordPageView(
    resolution.username,
    request.headers.get("user-agent"),
    request.headers
  ).catch(() => {});

  if (resolution.status === "VCARD") {
    return new NextResponse(resolution.vcf, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${resolution.filename}"`,
      },
    });
  }

  return NextResponse.redirect(resolution.url, 302);
}
