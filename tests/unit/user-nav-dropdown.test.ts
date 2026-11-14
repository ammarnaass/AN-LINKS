import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { UserNavDropdown } from "@/features/auth";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("UserNavDropdown Component & Session Reactive State", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing (null) when user is unauthenticated", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));
    expect(html).toBe("");
  });

  it("should render nothing (null) when session is loading", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    const html = renderToStaticMarkup(React.createElement(UserNavDropdown));
    expect(html).toBe("");
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
});

