import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AdminSidebarPullHandle,
  AdminSidebarPullHandleProps,
} from "@/features/admin/components/AdminSidebarPullHandle";

const clientInternals =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

/**
 * Harness to execute React function components with hook support (useRef) in Node environment.
 */
function renderComponentInstance(
  Comp: (props: AdminSidebarPullHandleProps) => React.JSX.Element | null,
  props: AdminSidebarPullHandleProps
): React.JSX.Element | null {
  const refs: Array<{ current: unknown }> = [];
  let refIndex = 0;
  const prevDispatcher = clientInternals ? clientInternals.H : null;

  if (clientInternals) {
    clientInternals.H = {
      useRef: (initialValue: unknown) => {
        const index = refIndex++;
        if (refs.length <= index) {
          refs[index] = { current: initialValue };
        }
        return refs[index];
      },
      useCallback: <F extends Function>(cb: F) => cb,
      useMemo: <T,>(cb: () => T) => cb(),
    };
  }

  try {
    refIndex = 0;
    return Comp(props);
  } finally {
    if (clientInternals) {
      clientInternals.H = prevDispatcher;
    }
  }
}

describe("AdminSidebarPullHandle Component", () => {
  const onOpenMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Static Rendering (SSR & DOM markup)", () => {
    it("should render nothing (null / empty string) when isOpen is true", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebarPullHandle, {
          isOpen: true,
          onOpen: onOpenMock,
        })
      );
      expect(html).toBe("");
    });

    it("should render pull handle element when isOpen is false with expected attributes", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebarPullHandle, {
          isOpen: false,
          onOpen: onOpenMock,
        })
      );

      expect(html).toContain('role="button"');
      expect(html).toContain('tabindex="0"');
      expect(html).toContain('aria-label="فتح القائمة الجانبية"');
      expect(html).toContain('fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden');
      expect(html).toContain("bg-primary text-on-primary");
      expect(html).toContain("w-6 h-14");
      expect(html).toContain("rounded-l-xl");
      expect(html).toContain("hover:w-7");
      // ChevronLeft icon SVG output
      expect(html).toContain("<svg");
      expect(html).toContain("lucide-chevron-left");
    });

    it("should merge custom className when provided", () => {
      const html = renderToStaticMarkup(
        React.createElement(AdminSidebarPullHandle, {
          isOpen: false,
          onOpen: onOpenMock,
          className: "custom-mobile-trigger shadow-2xl",
        })
      );

      expect(html).toContain("custom-mobile-trigger");
      expect(html).toContain("shadow-2xl");
      expect(html).toContain("fixed right-0");
    });
  });

  describe("Interactive Click and Keyboard Navigation", () => {
    it("should invoke onOpen when handle is clicked", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      expect(element).not.toBeNull();
      element?.props.onClick?.();
      expect(onOpenMock).toHaveBeenCalledTimes(1);
    });

    it("should invoke onOpen and prevent default when Enter key is pressed", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      const preventDefault = vi.fn();
      element?.props.onKeyDown?.({
        key: "Enter",
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(preventDefault).toHaveBeenCalled();
      expect(onOpenMock).toHaveBeenCalledTimes(1);
    });

    it("should invoke onOpen and prevent default when Space key is pressed", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      const preventDefaultSpace = vi.fn();
      element?.props.onKeyDown?.({
        key: " ",
        preventDefault: preventDefaultSpace,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(preventDefaultSpace).toHaveBeenCalled();
      expect(onOpenMock).toHaveBeenCalledTimes(1);

      const preventDefaultSpacebar = vi.fn();
      element?.props.onKeyDown?.({
        key: "Spacebar",
        preventDefault: preventDefaultSpacebar,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(preventDefaultSpacebar).toHaveBeenCalled();
      expect(onOpenMock).toHaveBeenCalledTimes(2);
    });

    it("should ignore unrelated keyboard events like Escape or Tab", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      const preventDefault = vi.fn();
      element?.props.onKeyDown?.({
        key: "Escape",
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      element?.props.onKeyDown?.({
        key: "Tab",
        preventDefault,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(preventDefault).not.toHaveBeenCalled();
      expect(onOpenMock).not.toHaveBeenCalled();
    });
  });

  describe("Touch Gesture & Swipe Detection (RTL Leftward Swipe)", () => {
    it("should invoke onOpen on horizontal left swipe exceeding 25px in RTL", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      // Touch start at (100, 200)
      element?.props.onTouchStart?.({
        touches: [{ clientX: 100, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      // Touch end at (65, 205) -> deltaX = -35, deltaY = 5
      // |deltaY| <= |deltaX| and deltaX < -25 -> should trigger
      element?.props.onTouchEnd?.({
        changedTouches: [{ clientX: 65, clientY: 205 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      expect(onOpenMock).toHaveBeenCalledTimes(1);
    });

    it("should not trigger onOpen if deltaX does not pass -25px threshold", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      // DeltaX = -25 exactly (threshold is < -25)
      element?.props.onTouchStart?.({
        touches: [{ clientX: 100, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      element?.props.onTouchEnd?.({
        changedTouches: [{ clientX: 75, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      expect(onOpenMock).not.toHaveBeenCalled();

      // Small movement deltaX = -10
      element?.props.onTouchStart?.({
        touches: [{ clientX: 100, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      element?.props.onTouchEnd?.({
        changedTouches: [{ clientX: 90, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      expect(onOpenMock).not.toHaveBeenCalled();
    });

    it("should ignore rightward swipe (positive deltaX > 0)", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      element?.props.onTouchStart?.({
        touches: [{ clientX: 100, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      element?.props.onTouchEnd?.({
        changedTouches: [{ clientX: 150, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      expect(onOpenMock).not.toHaveBeenCalled();
    });

    it("should ignore vertical-dominant swipes (natural page scrolling)", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      // Swipe diagonally with larger vertical displacement (deltaX = -35, deltaY = 80)
      element?.props.onTouchStart?.({
        touches: [{ clientX: 100, clientY: 100 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      element?.props.onTouchEnd?.({
        changedTouches: [{ clientX: 65, clientY: 180 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      expect(onOpenMock).not.toHaveBeenCalled();
    });

    it("should reset coordinates on touchCancel and prevent subsequent touchEnd trigger", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      element?.props.onTouchStart?.({
        touches: [{ clientX: 100, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      element?.props.onTouchCancel?.({} as React.TouchEvent<HTMLDivElement>);

      element?.props.onTouchEnd?.({
        changedTouches: [{ clientX: 50, clientY: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>);

      expect(onOpenMock).not.toHaveBeenCalled();
    });

    it("should safely handle touchEnd with no previous touchStart or empty touches", () => {
      const element = renderComponentInstance(AdminSidebarPullHandle, {
        isOpen: false,
        onOpen: onOpenMock,
      });

      // No start event fired
      expect(() => {
        element?.props.onTouchEnd?.({
          changedTouches: [{ clientX: 50, clientY: 200 }],
        } as unknown as React.TouchEvent<HTMLDivElement>);
      }).not.toThrow();
      expect(onOpenMock).not.toHaveBeenCalled();

      // Empty touches
      expect(() => {
        element?.props.onTouchStart?.({
          touches: [],
        } as unknown as React.TouchEvent<HTMLDivElement>);
        element?.props.onTouchEnd?.({
          changedTouches: [],
        } as unknown as React.TouchEvent<HTMLDivElement>);
      }).not.toThrow();
      expect(onOpenMock).not.toHaveBeenCalled();
    });
  });
});

