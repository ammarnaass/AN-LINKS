import { Locale } from "@/shared/i18n";
import { LandingI18nContent } from "./types";
import { landingAr } from "./landing-ar";
import { landingEn } from "./landing-en";
import { landingFr } from "./landing-fr";
import { templatesAr, templatesEn, templatesFr, LocalizedTemplateGallery } from "./landing-templates-data";

export function getLandingContent(locale: Locale): LandingI18nContent {
  switch (locale) {
    case "en":
      return landingEn;
    case "fr":
      return landingFr;
    case "ar":
    default:
      return landingAr;
  }
}

export function getLandingTemplates(locale: Locale): LocalizedTemplateGallery {
  switch (locale) {
    case "en":
      return templatesEn;
    case "fr":
      return templatesFr;
    case "ar":
    default:
      return templatesAr;
  }
}

export * from "./types";
export * from "./landing-ar";
export * from "./landing-en";
export * from "./landing-fr";
export * from "./landing-pricing-tiers";
export * from "./landing-testimonials-data";
export * from "./landing-templates-data";
