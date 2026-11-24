import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminEditLocationModal } from "@/features/admin/components/AdminEditLocationModal";
import { AdminUsersTab } from "@/features/admin/components/AdminUsersTab";
import { AdminUsersTable } from "@/features/admin/components/AdminUsersTable";
import { AdminUserItem } from "@/features/admin/types/admin.types";

const mockUsers: AdminUserItem[] = [
  {
    id: "user-admin-1",
    username: "sysadmin",
    displayName: "مدير النظام",
    email: "admin@anlinks.dev",
    role: "ADMIN",
    isSuspended: false,
    location: "الجزائر العاصمة، الجزائر",
    linksCount: 3,
    reportsCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-client-2",
    username: "faisal_client",
    displayName: "فيصل الشمري",
    email: "client@anlinks.dev",
    role: "USER",
    isSuspended: false,
    location: null,
    linksCount: 4,
    reportsCount: 0,
    createdAt: new Date().toISOString(),
  },
];

describe("Admin User Location & Residence Features", () => {
  it("renders AdminEditLocationModal when isOpen is true with location value", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminEditLocationModal, {
        isOpen: true,
        onClose: () => {},
        user: mockUsers[0],
        onSave: async () => {},
      })
    );

    expect(html).toContain("تعديل مكان الإقامة");
    expect(html).toContain("الجزائر العاصمة، الجزائر");
    expect(html).toContain("sysadmin");
  });

  it("returns null from AdminEditLocationModal when isOpen is false", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminEditLocationModal, {
        isOpen: false,
        onClose: () => {},
        user: mockUsers[0],
        onSave: async () => {},
      })
    );

    expect(html).toBe("");
  });

  it("renders location column and user location in AdminUsersTab", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminUsersTab, {
        users: mockUsers,
        onToggleSuspend: () => {},
        onToggleRole: () => {},
        onUpdateLocation: async () => {},
      })
    );

    expect(html).toContain("مكان الإقامة");
    expect(html).toContain("الجزائر العاصمة، الجزائر");
    expect(html).toContain("إضافة");
  });

  it("renders location column and user location in AdminUsersTable", () => {
    const html = renderToStaticMarkup(
      React.createElement(AdminUsersTable, {
        users: mockUsers,
        onToggleSuspend: () => {},
      })
    );

    expect(html).toContain("مكان الإقامة");
    expect(html).toContain("الجزائر العاصمة، الجزائر");
    expect(html).toContain("غير محدد");
  });
});
