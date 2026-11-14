import { Metadata } from "next";
import { LandingPageClient } from "@/features/landing";

export const metadata: Metadata = {
  title: "AN LINKS | المنصة العربية الأولى لصفحات الروابط والـ Bio",
  description:
    "اجمع كل روابطك وقنواتك ومتجرك في صفحة واحدة احترافية وسريعة، وضعها في خانة النبذة على شبكات التواصل.",
  openGraph: {
    title: "AN LINKS | المنصة العربية الأولى لصفحات الروابط والـ Bio",
    description:
      "اجمع كل روابطك وقنواتك ومتجرك في صفحة واحدة احترافية وسريعة، وضعها في خانة النبذة على شبكات التواصل.",
    siteName: "AN LINKS",
    locale: "ar_AR",
    type: "website",
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
