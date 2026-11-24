import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { validateSettingsProfile } from "@/features/settings/validators/settings.validator";
import { ProfileCard } from "@/features/bio/components/ProfileCard";
import { PhoneScreenContent } from "@/shared/ui/phone/PhoneScreenContent";

describe("Profile Location (Country & City of Residence) Feature", () => {
  it("validates ProfileSettingsInput containing location correctly", () => {
    const valid = validateSettingsProfile({
      displayName: "فتحي القشطي",
      email: "fathi@anlinks.dev",
      username: "fathi_cars",
      location: "ولاية الوادي، الجزائر",
    });
    expect(valid.valid).toBe(true);
  });

  it("renders ProfileCard with dynamic location badge and MapPin icon when location is provided", () => {
    const html = renderToStaticMarkup(
      React.createElement(ProfileCard, {
        displayName: "فتحي القشطي",
        username: "fathi",
        location: "ولاية الوادي، الجزائر",
        bio: "معرض سيارات",
      })
    );

    expect(html).toContain("ولاية الوادي، الجزائر");
    expect(html).toContain("lucide-map-pin");
  });

  it("does NOT render any hardcoded location when location is not provided", () => {
    const html = renderToStaticMarkup(
      React.createElement(ProfileCard, {
        displayName: "صانع محتوى",
        username: "creator",
      })
    );

    expect(html).not.toContain("المملكة العربية السعودية");
    expect(html).not.toContain("lucide-map-pin");
  });

  it("renders location inside PhoneScreenContent in live phone preview mockup", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "عمار الناص",
        username: "ammar",
        location: "طرابلس، ليبيا",
        links: [],
      })
    );

    expect(html).toContain("طرابلس، ليبيا");
    expect(html).toContain("lucide-map-pin");
  });
});
