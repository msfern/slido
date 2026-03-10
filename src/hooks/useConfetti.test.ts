import { renderHook, waitFor } from "@testing-library/react";
import confetti from "canvas-confetti";
import { vi } from "vitest";
import useConfetti from "./useConfetti";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("useConfetti", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show confetti if the puzzle is solved", async () => {
    renderHook(() => useConfetti(true));
    await waitFor(() => {
      expect(confetti).toHaveBeenCalledOnce();
    });
  });

  it("should not show confetti if the puzzle is not solved", async () => {
    renderHook(() => useConfetti(false));
    await waitFor(() => {
      expect(confetti).not.toHaveBeenCalled();
    });
  });

  it("should not show confetti if the prefers reduced motion is set", async () => {
    window.matchMedia = () => ({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    renderHook(() => useConfetti(true));
    await waitFor(() => {
      expect(confetti).not.toHaveBeenCalled();
    });
  });
});
