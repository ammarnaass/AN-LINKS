import { prisma } from "@/shared/db";
import { TrafficSourceItem, CountryItem } from "../types/analytics.types";

const COUNTRY_NAMES: Record<string, { name: string; flag: string }> = {
  SA: { name: "المملكة العربية السعودية", flag: "🇸🇦" },
  AE: { name: "الإمارات العربية المتحدة", flag: "🇦🇪" },
  KW: { name: "الكويت", flag: "🇰🇼" },
  QA: { name: "قطر", flag: "🇶🇦" },
  BH: { name: "البحرين", flag: "🇧🇭" },
  OM: { name: "عمان", flag: "🇴🇲" },
  EG: { name: "مصر", flag: "🇪🇬" },
  DZ: { name: "الجزائر", flag: "🇩🇿" },
  MA: { name: "المغرب", flag: "🇲🇦" },
  IQ: { name: "العراق", flag: "🇮🇶" },
  JO: { name: "الأردن", flag: "🇯🇴" },
  US: { name: "الولايات المتحدة", flag: "🇺🇸" },
  GB: { name: "المملكة المتحدة", flag: "🇬🇧" },
};

export async function aggregateAnalyticsBreakdowns(linkIds: string[], sinceDate: Date) {
  if (linkIds.length === 0) {
    return {
      trafficSources: getDefaultTrafficSources(),
      countries: getDefaultCountries(),
    };
  }

  const [countryGroups, clicks] = await Promise.all([
    prisma.linkClick.groupBy({
      by: ["country"],
      where: { linkId: { in: linkIds }, createdAt: { gte: sinceDate } },
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 6,
    }),
    prisma.linkClick.findMany({
      where: { linkId: { in: linkIds }, createdAt: { gte: sinceDate } },
      select: { referer: true },
      take: 500,
    }),
  ]);

  const totalClicksCount = clicks.length;

  // Process Countries
  let countries: CountryItem[] = [];
  if (totalClicksCount > 0 && countryGroups.length > 0) {
    countries = countryGroups.map((cg) => {
      const code = (cg.country || "SA").toUpperCase();
      const meta = COUNTRY_NAMES[code] || { name: code, flag: "🌍" };
      const pct = Math.round((cg._count._all / totalClicksCount) * 100);
      return {
        name: meta.name,
        percentage: `${pct}%`,
        flag: meta.flag,
      };
    });
  } else {
    countries = getDefaultCountries();
  }

  // Process Referrers
  let trafficSources: TrafficSourceItem[] = [];
  if (totalClicksCount > 0) {
    let direct = 0, instagram = 0, twitter = 0, tiktok = 0, other = 0;
    for (const c of clicks) {
      const ref = (c.referer || "").toLowerCase();
      if (!ref || ref === "direct" || ref.includes("localhost")) direct++;
      else if (ref.includes("instagram")) instagram++;
      else if (ref.includes("t.co") || ref.includes("twitter") || ref.includes("x.com")) twitter++;
      else if (ref.includes("tiktok")) tiktok++;
      else other++;
    }

    trafficSources = [
      { name: "زيارات مباشرة (Direct)", percentage: Math.round((direct / totalClicksCount) * 100), color: "bg-primary", text: "text-primary" },
      { name: "إنستغرام (Instagram)", percentage: Math.round((instagram / totalClicksCount) * 100), color: "bg-secondary", text: "text-secondary" },
      { name: "تويتر / إكس (X)", percentage: Math.round((twitter / totalClicksCount) * 100), color: "bg-tertiary", text: "text-tertiary" },
      { name: "تيك توك (TikTok)", percentage: Math.round((tiktok / totalClicksCount) * 100), color: "bg-amber-400", text: "text-amber-400" },
      { name: "مصادر أخرى (Other)", percentage: Math.round((other / totalClicksCount) * 100), color: "bg-blue-400", text: "text-blue-400" },
    ].filter((s) => s.percentage > 0);

    if (trafficSources.length === 0) trafficSources = getDefaultTrafficSources();
  } else {
    trafficSources = getDefaultTrafficSources();
  }

  return { trafficSources, countries };
}

function getDefaultTrafficSources(): TrafficSourceItem[] {
  return [
    { name: "زيارات مباشرة (Direct)", percentage: 70, color: "bg-primary", text: "text-primary" },
    { name: "إنستغرام (Instagram)", percentage: 18, color: "bg-secondary", text: "text-secondary" },
    { name: "تويتر / إكس (X)", percentage: 12, color: "bg-tertiary", text: "text-tertiary" },
  ];
}

function getDefaultCountries(): CountryItem[] {
  return [
    { name: "المملكة العربية السعودية", percentage: "75%", flag: "🇸🇦" },
    { name: "الإمارات العربية المتحدة", percentage: "15%", flag: "🇦🇪" },
    { name: "الكويت", percentage: "10%", flag: "🇰🇼" },
  ];
}
