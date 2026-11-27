import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import { assertSafeWebhookUrl } from "@/features/webhooks/validators/webhooks.validator";

interface CopilotRequestBody {
  mode: "bio_suggest" | "link_suggest";
  niche?: string;
  url?: string;
  currentBio?: string;
}

async function readUserAiPrefs(userId: string): Promise<{ tone?: string; niche?: string }> {
  try {
    const p = await prisma.profile?.findUnique?.({
      where: { userId },
      select: { aiPreferences: true },
    });
    const raw = p?.aiPreferences;
    if (raw && typeof raw === "object") return raw as { tone?: string; niche?: string };
  } catch {
    // Profile optional in unit test mocks
  }
  return {};
}

async function recordAiGeneration(userId: string) {
  try {
    if (!prisma.profile?.findUnique || !prisma.profile?.update) return;
    const p = await prisma.profile.findUnique({
      where: { userId },
      select: { aiPreferences: true },
    });
    if (!p) return;
    const prev = (p.aiPreferences && typeof p.aiPreferences === "object"
      ? p.aiPreferences
      : {}) as Record<string, unknown>;
    const count = typeof prev.totalGenerations === "number" ? prev.totalGenerations + 1 : 1;
    await prisma.profile.update({
      where: { userId },
      data: { aiPreferences: { ...prev, totalGenerations: count } as object },
    });
  } catch {
    // Best-effort counter update
  }
}

async function extractOpenGraphMetadata(targetUrl: string): Promise<{ title?: string; description?: string }> {
  if (process.env.NODE_ENV === "test") return {};
  const ssrf = await assertSafeWebhookUrl(targetUrl);
  if (!ssrf.ok) return {};
  try {
    const res = await fetch(targetUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(2500),
      headers: { "User-Agent": "ANLinks-MetadataBot/1.0" },
    });
    if (!res.ok) return {};
    const html = (await res.text()).slice(0, 48_000);
    const ogTitle =
      html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{2,140})["']/i)?.[1] ||
      html.match(/<title[^>]*>([^<]{2,140})<\/title>/i)?.[1];
    const ogDesc =
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{2,220})["']/i)?.[1] ||
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{2,220})["']/i)?.[1];
    return { title: ogTitle?.trim(), description: ogDesc?.trim() };
  } catch {
    return {};
  }
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

    if (userRole !== "ADMIN") {
      const activeSub = await prisma.userSubscription.findFirst({
        where: { userId, status: { in: ["ACTIVE", "TRIAL"] } },
        include: { plan: { include: { quotas: true } } },
      });

      const isAllowed = activeSub?.plan?.quotas?.allowAiCopilot ?? false;
      if (!isAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: "ميزة مساعد الذكاء الاصطناعي مخصصة لباقات المبدعين والمحترفين والوكالات. يرجى ترقية حسابك للاستفادة منها.",
          },
          { status: 403 }
        );
      }
    }

    const body: CopilotRequestBody = await req.json().catch(() => ({ mode: "bio_suggest" }));
    const { mode, niche, url } = body;
    const savedPrefs = await readUserAiPrefs(userId);
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (mode === "bio_suggest") {
      const cleanNiche = (niche || savedPrefs.niche || "صناعة المحتوى والأعمال").trim();
      const toneHint = savedPrefs.tone || "professional";

      if (apiKey) {
        try {
          const prompt = `أنت خبير تسويق لصفحات البايو الشخصية (Bio Link). بنبرة ${toneHint}، اقترح 3 نصوص نبذة تعريفية (Bio) قصيرة وجذابة باللغة العربية لشخص يعمل في: "${cleanNiche}". كل نبذة 15 إلى 25 كلمة مع إيموجي مناسب. أعد النتيجة كـ JSON مصفوفة نصوص فقط: ["نص 1", "نص 2", "نص 3"].`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              signal: AbortSignal.timeout(5000),
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
                await recordAiGeneration(userId);
                return NextResponse.json({
                  success: true,
                  suggestions: parsed,
                  data: { bio: parsed[0], options: parsed },
                });
              }
            }
          }
        } catch (e) {
          console.error("Gemini bio generate error, using fallback:", e);
        }
      }

      const fallbackSuggestions = [
        `✨ شغوف بـ ${cleanNiche} | أشارككم أحدث التجارب والأفكار العملية لتحقيق نتائج استثنائية.`,
        `🚀 خبير ومستشار في ${cleanNiche} | أساعدك على بناء حضورك الرقمي وتطوير مهاراتك خطوة بخطوة.`,
        `💡 صانع محتوى في مجالات ${cleanNiche} | مرحباً بك في مساحتي، تصفح روابطي وأحدث مشروعاتي بالأسفل 👇`,
      ];
      await recordAiGeneration(userId);
      return NextResponse.json({
        success: true,
        suggestions: fallbackSuggestions,
        data: { bio: fallbackSuggestions[0], options: fallbackSuggestions },
      });
    }

    if (mode === "link_suggest") {
      const rawUrl = (url || "").trim();
      const targetUrl = rawUrl.toLowerCase();

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

      if (rawUrl) {
        const og = await extractOpenGraphMetadata(rawUrl);
        if (og.title) title = og.title;
        if (og.description) description = og.description;
      }

      await recordAiGeneration(userId);
      return NextResponse.json({
        success: true,
        title,
        suggestedIcon,
        description,
        data: { title, suggestedIcon, description },
      });
    }

    return NextResponse.json({ success: false, error: "وضع غير مدعوم" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ أثناء معالجة الطلب";
    console.error("AI Copilot handler error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
