import "@testing-library/jest-dom";
import { vi } from "vitest";

// ---- MUI needs this ----
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated but MUI still calls it
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ---- Also required by MUI in many cases ----
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis).ResizeObserver = ResizeObserver;