import { describe, it, expect } from "vitest";
import { getLandingContent, getLandingTemplates } from "@/features/landing/constants/i18n";
import { SUPPORTED_LOCALES, Locale } from "@/shared/i18n";

describe("Landing Page Multilingual i18n System", () => {
  const locales: Locale[] = ["ar", "en", "fr"];

  locales.forEach((locale) => {
    describe(`Locale: ${locale}`, () => {
      it(`should return full valid landing content for ${locale}`, () => {
        const content = getLandingContent(locale);
        expect(content).toBeDefined();

        // Partners
        expect(content.partners.tag).toBeTruthy();
        expect(content.partners.items.length).toBeGreaterThanOrEqual(6);

        // Phone Mockup
        expect(content.phoneMockup.analyticsTitle).toBeTruthy();
        expect(content.phoneMockup.sentinelTitle).toBeTruthy();
        expect(content.phoneMockup.saleTitle).toBeTruthy();
        expect(content.phoneMockup.creatorName).toBeTruthy();
        expect(content.phoneMockup.videoTitle).toBeTruthy();
        expect(content.phoneMockup.productTitle).toBeTruthy();
        expect(content.phoneMockup.podcastTitle).toBeTruthy();
        expect(content.phoneMockup.newsletterTitle).toBeTruthy();

        // Hero Proof
        expect(content.heroProof.available).toBeTruthy();
        expect(content.heroProof.creatorsCount).toBeTruthy();
        expect(content.heroProof.rating).toBeTruthy();
        expect(content.heroProof.noCard).toBeTruthy();

        // Features
        expect(content.features.tag).toBeTruthy();
        expect(content.features.title).toBeTruthy();
        expect(content.features.sentinel.title).toBeTruthy();
        expect(content.features.typography.title).toBeTruthy();
        expect(content.features.analytics.title).toBeTruthy();
        expect(content.features.commerce.title).toBeTruthy();
        expect(content.features.qr.title).toBeTruthy();

        // How It Works
        expect(content.howItWorks.steps).toHaveLength(3);
        content.howItWorks.steps.forEach((step) => {
          expect(step.title).toBeTruthy();
          expect(step.desc).toBeTruthy();
        });

        // Pricing
        expect(content.pricing.tiers).toHaveLength(3);
        const tierIds = content.pricing.tiers.map((t) => t.id);
        expect(tierIds).toEqual(["free", "pro", "business"]);
        content.pricing.tiers.forEach((t) => {
          expect(t.name).toBeTruthy();
          expect(t.subtitle).toBeTruthy();
          expect(t.ctaText).toBeTruthy();
          expect(t.features.length).toBeGreaterThan(0);
        });

        // Testimonials
        expect(content.testimonials.items).toHaveLength(3);
        content.testimonials.items.forEach((t) => {
          expect(t.name).toBeTruthy();
          expect(t.role).toBeTruthy();
          expect(t.quote).toBeTruthy();
        });

        // FAQ
        expect(content.faq.items).toHaveLength(4);
        content.faq.items.forEach((f) => {
          expect(f.question).toBeTruthy();
          expect(f.answer).toBeTruthy();
        });

        // Giant CTA
        expect(content.giantCta.title).toBeTruthy();
        expect(content.giantCta.button).toBeTruthy();

        // Footer
        expect(content.footer.description).toBeTruthy();
        expect(content.footer.features).toBeTruthy();
        expect(content.footer.pricing).toBeTruthy();
        expect(content.footer.rights).toContain("AN LINKS");
        expect(content.footer.status).toBeTruthy();
      });

      it(`should return localized template gallery for ${locale}`, () => {
        const gallery = getLandingTemplates(locale);
        expect(gallery).toBeDefined();
        expect(gallery.templates).toHaveLength(4);
        const categories = gallery.templates.map((t) => t.category);
        expect(categories).toEqual(["creator", "store", "podcast", "writer"]);
        gallery.templates.forEach((tmpl) => {
          expect(tmpl.categoryName).toBeTruthy();
          expect(tmpl.creatorName).toBeTruthy();
          expect(tmpl.bio).toBeTruthy();
          expect(tmpl.links.length).toBeGreaterThanOrEqual(3);
        });
      });
    });
  });

  it("should have distinct content across Arabic, English, and French", () => {
    const ar = getLandingContent("ar");
    const en = getLandingContent("en");
    const fr = getLandingContent("fr");

    // Features title comparison
    expect(ar.features.title).not.toEqual(en.features.title);
    expect(en.features.title).not.toEqual(fr.features.title);

    // Hero proof comparison
    expect(ar.heroProof.available).not.toEqual(en.heroProof.available);

    // Pricing name comparison
    expect(ar.pricing.tiers[0].name).not.toEqual(en.pricing.tiers[0].name);

    // Footer copyright comparison
    expect(ar.footer.rights).not.toEqual(en.footer.rights);
  });
});
