import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  useAdminSidebar,
  UseAdminSidebarReturn,
  ADMIN_SIDEBAR_STORAGE_KEY,
  getStoredSidebarCollapsed,
  setStoredSidebarCollapsed,
} from "@/features/admin/hooks/useAdminSidebar";

const clientInternals =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

/**
 * Lightweight hook testing harness for Node environment.
 * Executes hooks with state tracking, effect dispatching, and cleanup.
 */
function createHookHarness<T>(hookFn: () => T) {
  const states: unknown[] = [];
  let stateIndex = 0;
  const effects: Array<{
    cb: () => (() => void) | void;
    deps?: unknown[];
    cleanup?: (() => void) | void;
  }> = [];

  const prevH = clientInternals ? clientInternals.H : null;

  const dispatcher = {
    useState: (initial: unknown) => {
      const idx = stateIndex++;
      if (states.length <= idx) {
        states[idx] = typeof initial === "function" ? (initial as () => unknown)() : initial;
      }
      const setter = (valOrFn: unknown) => {
        states[idx] =
          typeof valOrFn === "function"
            ? (valOrFn as (prev: unknown) => unknown)(states[idx])
            : valOrFn;
      };
      return [states[idx], setter];
    },
    useEffect: (cb: () => (() => void) | void, deps?: unknown[]) => {
      effects.push({ cb, deps });
    },
    useCallback: <F extends Function>(cb: F) => cb,
  };

  if (clientInternals) {
    clientInternals.H = dispatcher;
  }

  // Initial mount execution
  stateIndex = 0;
  let currentResult = hookFn();

  // Run mount effects
  for (const eff of effects) {
    eff.cleanup = eff.cb();
  }

  // Re-run after mount effects to reflect state updates from mount effects
  stateIndex = 0;
  currentResult = hookFn();

  const rerender = (): T => {
    stateIndex = 0;
    currentResult = hookFn();
    return currentResult;
  };

  const unmount = () => {
    for (const eff of effects) {
      if (typeof eff.cleanup === "function") {
        eff.cleanup();
      }
    }
    if (clientInternals) {
      clientInternals.H = prevH;
    }
  };

  return {
    get current() {
      return currentResult;
    },
    rerender,
    unmount,
  };
}

describe("useAdminSidebar SSR Compatibility (renderToStaticMarkup)", () => {
  it("should mount and render cleanly in SSR node environment", () => {
    let capturedHook: UseAdminSidebarReturn | undefined;

    function TestComponent() {
      capturedHook = useAdminSidebar();
      return React.createElement(
        "div",
        { "data-testid": "admin-sidebar-status" },
        React.createElement("span", { "data-testid": "is-collapsed" }, String(capturedHook.isCollapsed)),
        React.createElement("span", { "data-testid": "is-mobile-open" }, String(capturedHook.isMobileOpen))
      );
    }

    const html = renderToStaticMarkup(React.createElement(TestComponent));

    expect(html).toContain('data-testid="is-collapsed">false<');
    expect(html).toContain('data-testid="is-mobile-open">false<');

    expect(capturedHook).toBeDefined();
    expect(capturedHook?.isCollapsed).toBe(false);
    expect(capturedHook?.isMobileOpen).toBe(false);
    expect(typeof capturedHook?.toggleCollapse).toBe("function");
    expect(typeof capturedHook?.openMobile).toBe("function");
    expect(typeof capturedHook?.closeMobile).toBe("function");
    expect(typeof capturedHook?.toggleMobile).toBe("function");
  });
});

describe("useAdminSidebar State Transitions & Actions", () => {
  let harness: ReturnType<typeof createHookHarness<UseAdminSidebarReturn>> | null = null;

  beforeEach(() => {
    if (typeof globalThis.localStorage !== "undefined") {
      globalThis.localStorage.clear();
    }
  });

  afterEach(() => {
    if (harness) {
      harness.unmount();
      harness = null;
    }
  });

  it("should toggle isCollapsed when toggleCollapse is called", () => {
    harness = createHookHarness(useAdminSidebar);
    expect(harness.current.isCollapsed).toBe(false);

    harness.current.toggleCollapse();
    harness.rerender();
    expect(harness.current.isCollapsed).toBe(true);

    harness.current.toggleCollapse();
    harness.rerender();
    expect(harness.current.isCollapsed).toBe(false);
  });

  it("should control mobile drawer with openMobile, closeMobile, and toggleMobile", () => {
    harness = createHookHarness(useAdminSidebar);
    expect(harness.current.isMobileOpen).toBe(false);

    // openMobile
    harness.current.openMobile();
    harness.rerender();
    expect(harness.current.isMobileOpen).toBe(true);

    // closeMobile
    harness.current.closeMobile();
    harness.rerender();
    expect(harness.current.isMobileOpen).toBe(false);

    // toggleMobile
    harness.current.toggleMobile();
    harness.rerender();
    expect(harness.current.isMobileOpen).toBe(true);

    harness.current.toggleMobile();
    harness.rerender();
    expect(harness.current.isMobileOpen).toBe(false);
  });
});

describe("useAdminSidebar LocalStorage Integration & Error Handling", () => {
  let harness: ReturnType<typeof createHookHarness<UseAdminSidebarReturn>> | null = null;
  const storageMock = new Map<string, string>();

  beforeEach(() => {
    storageMock.clear();
    const fakeLocalStorage = {
      getItem: vi.fn((key: string) => storageMock.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storageMock.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storageMock.delete(key);
      }),
      clear: vi.fn(() => {
        storageMock.clear();
      }),
      key: vi.fn(() => null),
      length: 0,
    };

    Object.defineProperty(globalThis, "localStorage", {
      value: fakeLocalStorage,
      writable: true,
      configurable: true,
    });

    if (typeof (globalThis as any).window !== "undefined") {
      Object.defineProperty((globalThis as any).window, "localStorage", {
        value: fakeLocalStorage,
        writable: true,
        configurable: true,
      });
    }
  });

  afterEach(() => {
    if (harness) {
      harness.unmount();
      harness = null;
    }
    vi.restoreAllMocks();
  });

  it("should hydrate isCollapsed = true from localStorage after mount", () => {
    storageMock.set(ADMIN_SIDEBAR_STORAGE_KEY, "true");

    harness = createHookHarness(useAdminSidebar);
    expect(harness.current.isCollapsed).toBe(true);
  });

  it("should keep isCollapsed = false when localStorage is empty or false", () => {
    storageMock.set(ADMIN_SIDEBAR_STORAGE_KEY, "false");

    harness = createHookHarness(useAdminSidebar);
    expect(harness.current.isCollapsed).toBe(false);
  });

  it("should persist collapsed state to localStorage on toggleCollapse", () => {
    harness = createHookHarness(useAdminSidebar);
    expect(harness.current.isCollapsed).toBe(false);

    harness.current.toggleCollapse();
    harness.rerender();
    expect(harness.current.isCollapsed).toBe(true);
    expect(storageMock.get(ADMIN_SIDEBAR_STORAGE_KEY)).toBe("true");

    harness.current.toggleCollapse();
    harness.rerender();
    expect(harness.current.isCollapsed).toBe(false);
    expect(storageMock.get(ADMIN_SIDEBAR_STORAGE_KEY)).toBe("false");
  });

  it("should handle localStorage.getItem throwing an exception gracefully (e.g. private browsing)", () => {
    globalThis.localStorage.getItem = vi.fn().mockImplementation(() => {
      throw new Error("SecurityError: Access to localStorage is denied");
    });

    expect(() => {
      harness = createHookHarness(useAdminSidebar);
    }).not.toThrow();

    expect(harness?.current.isCollapsed).toBe(false);
  });

  it("should handle localStorage.setItem throwing an exception gracefully (e.g. quota exceeded)", () => {
    harness = createHookHarness(useAdminSidebar);

    globalThis.localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error("QuotaExceededError: Storage quota exceeded");
    });

    expect(() => {
      harness?.current.toggleCollapse();
      harness?.rerender();
    }).not.toThrow();

    expect(harness?.current.isCollapsed).toBe(true);
  });

  it("should read and write using getStoredSidebarCollapsed and setStoredSidebarCollapsed helpers", () => {
    expect(getStoredSidebarCollapsed()).toBe(false);

    setStoredSidebarCollapsed(true);
    expect(getStoredSidebarCollapsed()).toBe(true);

    setStoredSidebarCollapsed(false);
    expect(getStoredSidebarCollapsed()).toBe(false);
  });
});

describe("useAdminSidebar Responsive Window Resize Handling", () => {
  let harness: ReturnType<typeof createHookHarness<UseAdminSidebarReturn>> | null = null;
  const eventListeners = new Map<string, Function[]>();

  beforeEach(() => {
    eventListeners.clear();

    const fakeWindow = {
      innerWidth: 768,
      addEventListener: vi.fn((event: string, handler: Function) => {
        const list = eventListeners.get(event) ?? [];
        list.push(handler);
        eventListeners.set(event, list);
      }),
      removeEventListener: vi.fn((event: string, handler: Function) => {
        const list = eventListeners.get(event) ?? [];
        eventListeners.set(
          event,
          list.filter((h) => h !== handler)
        );
      }),
    };

    Object.defineProperty(globalThis, "window", {
      value: fakeWindow,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    if (harness) {
      harness.unmount();
      harness = null;
    }
    delete (globalThis as any).window;
  });

  it("should auto-close mobile drawer when window resizes to >= 1024px", () => {
    harness = createHookHarness(useAdminSidebar);

    // Open mobile drawer on mobile (innerWidth = 768)
    harness.current.openMobile();
    harness.rerender();
    expect(harness.current.isMobileOpen).toBe(true);

    // Resize to desktop (1024px)
    (globalThis as any).window.innerWidth = 1024;
    const resizeHandlers = eventListeners.get("resize") ?? [];
    for (const handler of resizeHandlers) {
      handler();
    }
    harness.rerender();

    expect(harness.current.isMobileOpen).toBe(false);
  });

  it("should NOT close mobile drawer when window resizes below 1024px", () => {
    harness = createHookHarness(useAdminSidebar);

    harness.current.openMobile();
    harness.rerender();
    expect(harness.current.isMobileOpen).toBe(true);

    // Resize to another mobile size (375px)
    (globalThis as any).window.innerWidth = 375;
    const resizeHandlers = eventListeners.get("resize") ?? [];
    for (const handler of resizeHandlers) {
      handler();
    }
    harness.rerender();

    expect(harness.current.isMobileOpen).toBe(true);
  });

  it("should remove resize event listener on unmount", () => {
    harness = createHookHarness(useAdminSidebar);

    expect(eventListeners.get("resize")?.length).toBe(1);

    harness.unmount();
    harness = null;

    const remaining = eventListeners.get("resize") ?? [];
    expect(remaining.length).toBe(0);
  });
});
