import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateReportInput } from "@/lib/report-validator";
import { truncateIp } from "@/lib/bot-detector";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateReportInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const rawIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "";
    const reporterIp = truncateIp(rawIp);

    await prisma.report.create({
      data: {
        username: validation.username!,
        reason: validation.reason!,
        details: validation.details,
        reporterIp,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "شكراً لتعاونك، تم استلام البلاغ وسيتم مراجعته من قِبل الفريق.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Report submission error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إرسال البلاغ. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
