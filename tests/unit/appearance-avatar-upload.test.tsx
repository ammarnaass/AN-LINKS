import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AvatarUploadField } from "@/features/appearance/components/AvatarUploadField";

describe("AvatarUploadField Component Tests", () => {
  it("should render placeholder initial letter when avatarUrl is null or undefined", () => {
    const html = renderToStaticMarkup(
      <AvatarUploadField
        displayName="فيصل الشمري"
        avatarUrl={null}
        onAvatarChange={vi.fn()}
      />
    );

    expect(html).toContain("ف");
    expect(html).toContain("رفع صورة جديدة");
    expect(html).toContain("رابط صورة");
    expect(html).not.toContain("إزالة");
  });

  it("should render img tag with provided avatarUrl and remove button", () => {
    const testUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
    const html = renderToStaticMarkup(
      <AvatarUploadField
        displayName="سارة أحمد"
        avatarUrl={testUrl}
        onAvatarChange={vi.fn()}
      />
    );

    expect(html).toContain(`<img src="${testUrl}"`);
    expect(html).toContain("سارة أحمد");
    expect(html).toContain("إزالة");
  });

  it("should include file input accepting PNG, JPEG, and WebP", () => {
    const html = renderToStaticMarkup(
      <AvatarUploadField
        displayName="مدير النظام"
        avatarUrl={null}
        onAvatarChange={vi.fn()}
      />
    );

    expect(html).toContain('type="file"');
    expect(html).toContain('accept="image/png,image/jpeg,image/webp"');
  });
});
