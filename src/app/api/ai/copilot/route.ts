import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";

interface CopilotRequestBody {
  mode: "bio_suggest" | "link_suggest";
  niche?: string;
  url?: string;
  currentBio?: string;
}

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, "ai_copilot", {
      maxAttempts: 10,
      windowMs: 60 * 1000,
    });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول لاستخدام الذكاء الاصطناعي" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // Check plan quotas if not system admin
    if (userRole !== "ADMIN") {
      const activeSub = await prisma.userSubscription.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: { include: { quotas: true } } },
      });

      const isAllowed = activeSub?.plan?.quotas?.allowAiCopilot ?? false;
      if (!isAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: "ميزة مساعد الذكاء الاصطناعي مخصصة لباقات Pro و VIP. يرجى ترقية حسابك للاستفادة منها.",
          },
          { status: 403 }
        );
      }
    }

    const body: CopilotRequestBody = await req.json().catch(() => ({ mode: "bio_suggest" }));
    const { mode, niche, url } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (mode === "bio_suggest") {
      const cleanNiche = (niche || "صناعة المحتوى والأعمال").trim();

      if (apiKey) {
        try {
          const prompt = `أنت خبير تسويق لصفحات البايو الشخصية (Bio Link). اقترح 3 نصوص نبذة تعريفية (Bio) قصيرة، احترافية، وجذابة باللغة العربية لشخص يعمل في: "${cleanNiche}". يجب أن تكون كل نبذة في حدود 15 إلى 25 كلمة وبها إيموجي ملائم. أعد النتيجة كـ JSON مصفوفة نصوص فقط: ["نص 1", "نص 2", "نص 3"].`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" },
              }),
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              const parsed = JSON.parse(textResponse);
              if (Array.isArray(parsed) && parsed.length >= 3) {
                return NextResponse.json({ success: true, suggestions: parsed });
              }
            }
          }
        } catch (e) {
          console.error("Gemini bio generate error, using fallback:", e);
        }
      }

      // Contextual High-Quality Arabic Fallback
      return NextResponse.json({
        success: true,
        suggestions: [
          `✨ شغوف بـ ${cleanNiche} | أشارككم أحدث التجارب والأفكار العملية لتحقيق نتائج استثنائية.`,
          `🚀 خبير ومستشار في ${cleanNiche} | أساعدك على بناء حضورك الرقمي وتطوير مهاراتك خطوة بخطوة.`,
          `💡 صانع محتوى في مجالات ${cleanNiche} | مرحباً بك في مساحتي، تصفح روابطي وأحدث مشروعاتي بالأسفل 👇`,
        ],
      });
    }

    if (mode === "link_suggest") {
      const targetUrl = (url || "").trim().toLowerCase();

      let title = "رابط جديد ومميز";
      let suggestedIcon = "ExternalLink";
      let description = "اضغط للاطلاع على التفاصيل الكاملة";

      if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
        title = "شاهد أحدث الفيديوهات على قناتي";
        suggestedIcon = "Youtube";
        description = "محتوى مرئي حصري ودروس أسبوعية";
      } else if (targetUrl.includes("instagram.com")) {
        title = "تابع يومياتي وأحدث كواليسي";
        suggestedIcon = "Instagram";
        description = "ستوريات وتغطيات مباشرة";
      } else if (targetUrl.includes("twitter.com") || targetUrl.includes("x.com")) {
        title = "حسابي الرسمي على منصة X";
        suggestedIcon = "Twitter";
        description = "نقاشات مهنية وتغريدات يومية";
      } else if (targetUrl.includes("tiktok.com")) {
        title = "مقاطع قصيرة ومفيدة على تيك توك";
        suggestedIcon = "Video";
        description = "فيديوهات سريعة ونصائح دقيقة";
      } else if (targetUrl.includes("salla.sa") || targetUrl.includes("zid.sa") || targetUrl.includes("store")) {
        title = "متجري الإلكتروني لطلب المنتجات";
        suggestedIcon = "ShoppingBag";
        description = "شحن سريع وعروض وتخفيضات حصرية";
      } else if (targetUrl.includes("podcasts") || targetUrl.includes("spotify.com")) {
        title = "استمع إلى بودكاست أسبوعي ملهم";
        suggestedIcon = "Mic";
        description = "حوارات مع رواد الأعمال والمتخصصين";
      }

      return NextResponse.json({
        success: true,
        title,
        suggestedIcon,
        description,
      });
    }

    return NextResponse.json({ success: false, error: "وضع غير مدعوم" }, { status: 400 });
  } catch (err: any) {
    console.error("AI Copilot handler error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "حدث خطأ أثناء معالجة الطلب" },
      { status: 500 }
    );
  }
}
