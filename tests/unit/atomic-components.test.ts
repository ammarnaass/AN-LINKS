import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AppButton,
  AppInput,
  AppBadge,
  AppCard,
  BentoTile,
  ThemePreviewSwatch,
  FloatingMetricCard,
} from "@/shared/ui";

describe("Atomic UI Components Suite (SSR Node Compatibility)", () => {
  it("should render AppButton with primary variant and loading spinner", () => {
    const htmlNormal = renderToStaticMarkup(
      React.createElement(AppButton, { variant: "primary", size: "md" }, "ابدأ مجاناً")
    );
    expect(htmlNormal).toContain("ابدأ مجاناً");
    expect(htmlNormal).toContain("bg-primary");

    const htmlLoading = renderToStaticMarkup(
      React.createElement(AppButton, { isLoading: true }, "جاري الإرسال")
    );
    expect(htmlLoading).toContain("animate-spin");
    expect(htmlLoading).toContain("disabled");
  });

  it("should render AppInput with label, placeholder, and error state", () => {
    const html = renderToStaticMarkup(
      React.createElement(AppInput, {
        label: "البريد الإلكتروني",
        placeholder: "name@example.com",
        error: "صيغة البريد غير صحيحة",
      })
    );
    expect(html).toContain("البريد الإلكتروني");
    expect(html).toContain("name@example.com");
    expect(html).toContain("صيغة البريد غير صحيحة");
    expect(html).toContain("border-error");
  });

  it("should render AppBadge with variants and live animated pulse dot", () => {
    const htmlLive = renderToStaticMarkup(
      React.createElement(AppBadge, { variant: "live", dot: true }, "متاح الآن")
    );
    expect(htmlLive).toContain("متاح الآن");
    expect(htmlLive).toContain("animate-ping");

    const htmlSuccess = renderToStaticMarkup(
      React.createElement(AppBadge, { variant: "success" }, "مكتمل")
    );
    expect(htmlSuccess).toContain("text-emerald-400");
  });

  it("should render AppCard with elevated and glass variants", () => {
    const htmlGlass = renderToStaticMarkup(
      React.createElement(AppCard, { variant: "glass", glowColor: "primary" }, "محتوى البطاقة")
    );
    expect(htmlGlass).toContain("backdrop-blur-xl");
    expect(htmlGlass).toContain("محتوى البطاقة");
  });

  it("should render BentoTile with title, description, and badge", () => {
    const htmlBento = renderToStaticMarkup(
      React.createElement(BentoTile, {
        title: "حارس صحة الروابط",
        description: "فحص مستمر 24/7 مع إشعار واتساب الفوري",
        badge: "جديد",
        colSpan: 2,
      })
    );
    expect(htmlBento).toContain("حارس صحة الروابط");
    expect(htmlBento).toContain("فحص مستمر 24/7");
    expect(htmlBento).toContain("جديد");
    expect(htmlBento).toContain("lg:col-span-2");
  });

  it("should render ThemePreviewSwatch with color pill and active indicator", () => {
    const htmlActive = renderToStaticMarkup(
      React.createElement(ThemePreviewSwatch, {
        themeKey: "layanDark",
        nameAr: "ليان بانتو الليلي",
        primaryColor: "#4edea3",
        surfaceColor: "#0f131c",
        accentColor: "#10b981",
        isActive: true,
        onSelect: () => {},
      })
    );
    expect(htmlActive).toContain("ليان بانتو الليلي");
    expect(htmlActive).toContain("border-primary");

    const htmlInactive = renderToStaticMarkup(
      React.createElement(ThemePreviewSwatch, {
        themeKey: "rawabetLight",
        nameAr: "روابط المشرق",
        primaryColor: "#006948",
        surfaceColor: "#faf8ff",
        accentColor: "#00855d",
        isActive: false,
        onSelect: () => {},
      })
    );
    expect(htmlInactive).toContain("روابط المشرق");
    expect(htmlInactive).not.toContain("ring-primary");
  });

  it("should render FloatingMetricCard with delta and title", () => {
    const html = renderToStaticMarkup(
      React.createElement(FloatingMetricCard, {
        title: "إجمالي الزيارات",
        value: "+14,280",
        delta: "+28.4%",
        deltaType: "positive",
        icon: React.createElement("span", null, "Icon"),
        positionClasses: "top-0 right-0",
      })
    );
    expect(html).toContain("إجمالي الزيارات");
    expect(html).toContain("+14,280");
    expect(html).toContain("+28.4%");
    expect(html).toContain("text-primary");
  });
});

