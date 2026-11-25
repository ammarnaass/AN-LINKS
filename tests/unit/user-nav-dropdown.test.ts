import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { UserNavDropdown, UserNavMenu } from "@/features/auth";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("UserNavDropdown Component & Session Reactive State", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login action button when user is unauthenticated", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));
    expect(html).toContain('href="/login"');
    expect(html).toContain("تسجيل الدخول");
  });

  it("should render loading skeleton when session is loading", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));
    expect(html).toContain("animate-pulse");
  });

  it("should render avatar and username when user is authenticated as client", () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "client-1",
          name: "فيصل العميل",
          username: "faisal_client",
          email: "client@anlinks.dev",
          role: "USER",
        },
      },
      status: "authenticated",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));
    expect(html).toContain("فيصل العميل");
    expect(html).toContain("@faisal_client");
    expect(html).not.toContain("مدير النظام (Admin)");
  });

  it("should display admin shield badge on trigger when role is ADMIN", () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "admin-1",
          name: "مدير النظام",
          username: "sysadmin",
          email: "admin@anlinks.dev",
          role: "ADMIN",
        },
      },
      status: "authenticated",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));
    expect(html).toContain("مدير النظام");
    expect(html).toContain("@sysadmin");
    expect(html).toContain('title="مدير النظام"');
  });

  it("should render UserNavMenu with NFC studio, settings, and profile preview links", () => {
    const html = renderToStaticMarkup(
      React.createElement(UserNavMenu, {
        user: {
          name: "فيصل",
          username: "faisal_creator",
          email: "faisal@anlinks.dev",
        },
        isAdmin: true,
        onClose: vi.fn(),
      })
    );

    expect(html).toContain("فيصل");
    expect(html).toContain("faisal@anlinks.dev");
    expect(html).toContain("مدير النظام (Admin)");
    expect(html).toContain('href="/admin"');
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('href="/dashboard/appearance"');
    expect(html).toContain('href="/dashboard/nfc-card"');
    expect(html).toContain("بطاقة NFC والباركود");
    expect(html).toContain('href="/dashboard/analytics"');
    expect(html).toContain('href="/dashboard/settings"');
    expect(html).toContain('href="/faisal_creator"');
    expect(html).toContain("تسجيل الخروج");
  });
});

