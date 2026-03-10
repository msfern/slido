import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GridSize } from "@/features/puzzle/types";
import { createInitialGameState } from "@/features/puzzle/utils/puzzleUtils";
import { NEAR_SOLVED_STATE, SOLVED_BOARD } from "@/mocks/testMocks";
import { usePuzzle } from "./usePuzzle";

vi.mock("@/features/puzzle/utils/puzzleUtils", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/puzzle/utils/puzzleUtils")
    >();
  return {
    ...actual,
    createBoard: vi.fn(actual.createBoard),
    createInitialGameState: vi.fn(actual.createInitialGameState),
  };
});

describe("usePuzzle", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it.each([
      3 as GridSize,
      4 as GridSize,
      5 as GridSize,
    ])("initialises with a shuffled board of the correct size for grid size %s", (gridSize) => {
      const { result } = renderHook(() => usePuzzle({ gridSize }));

      expect(result.current.tiles).toHaveLength(gridSize * gridSize);
      expect(result.current.moves).toBe(0);
      expect(result.current.isSolved).toBe(false);
    });
  });

  describe("handleMove", () => {
    it("updates tiles on a valid move", () => {
      vi.mocked(createInitialGameState).mockReturnValueOnce(NEAR_SOLVED_STATE);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.handleMove(6));

      expect(result.current.moves).toBe(1);
      expect(result.current.tiles[6].value).toBeNull();
      expect(result.current.tiles[7].value).toBe(7);
    });

    it("does not update tiles for an invalid move", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));
      const tilesBefore = result.current.tiles;

      act(() => result.current.handleMove(0));

      expect(result.current.moves).toBe(0);
      expect(result.current.tiles).toEqual(tilesBefore);
    });

    it("sets isSolved after the winning move", () => {
      vi.mocked(createInitialGameState).mockReturnValueOnce(NEAR_SOLVED_STATE);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.handleMove(8));

      expect(result.current.isSolved).toBe(true);
    });

    it("ignores moves after the puzzle is solved", () => {
      vi.mocked(createInitialGameState).mockReturnValueOnce(NEAR_SOLVED_STATE);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.handleMove(8));
      const { moves } = result.current;

      act(() => result.current.handleMove(7));

      expect(result.current.moves).toBe(moves);
      expect(result.current.tiles).toEqual(SOLVED_BOARD);
    });

    it("maintains stable identity across renders (dispatch-backed)", () => {
      const { result, rerender } = renderHook(() => usePuzzle({ gridSize: 3 }));
      const first = result.current.handleMove;

      rerender();

      expect(result.current.handleMove).toBe(first);
    });
  });

  describe("resetGame", () => {
    it("resets to a new shuffled board", () => {
      vi.mocked(createInitialGameState).mockReturnValue(NEAR_SOLVED_STATE);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.resetGame());

      expect(result.current.moves).toBe(0);
      expect(result.current.isSolved).toBe(false);
    });
  });

  describe("changeGridSize", () => {
    it("resets the board with the new grid size", () => {
      vi.mocked(createInitialGameState)
        .mockReturnValueOnce(NEAR_SOLVED_STATE)
        .mockReturnValue({
          gridSize: 4,
          moves: 0,
          status: "idle",
          tiles: [],
        });

      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.changeGridSize(4));

      expect(result.current.gridSize).toBe(4);
    });
  });
});
