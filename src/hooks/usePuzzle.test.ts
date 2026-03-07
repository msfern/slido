import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NEAR_SOLVED_BOARD, NEAR_SOLVED_STATE } from "@/mocks/testMocks";
import { createInitialGameState, shuffleBoard } from "../utils/puzzleUtils";
import { usePuzzle } from "./usePuzzle";

vi.mock("../utils/puzzleUtils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/puzzleUtils")>();
  return {
    ...actual,
    shuffleBoard: vi.fn(actual.shuffleBoard),
    createInitialGameState: vi.fn(actual.createInitialGameState),
  };
});

describe("usePuzzle", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("initialises with a shuffled board of the correct size", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      expect(result.current.tiles).toHaveLength(9);
      expect(result.current.moves).toBe(0);
      expect(result.current.isSolved).toBe(false);
    });

    it("supports different grid sizes", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 4 }));

      expect(result.current.tiles).toHaveLength(16);
      expect(result.current.gridSize).toBe(4);
    });
  });

  describe("handleMove", () => {
    it("updates state on a valid move", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...NEAR_SOLVED_BOARD]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.handleMove(6));

      expect(result.current.moves).toBe(1);
      expect(result.current.tiles[6].value).toBeNull();
      expect(result.current.tiles[7].value).toBe(7);
    });

    it("does not update state for an invalid move", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));
      const tilesBefore = result.current.tiles;

      act(() => result.current.handleMove(0));

      expect(result.current.moves).toBe(0);
      expect(result.current.tiles).toEqual(tilesBefore);
    });

    it("sets isSolved after the winning move", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...NEAR_SOLVED_BOARD]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.handleMove(8));

      expect(result.current.isSolved).toBe(true);
    });

    it("ignores moves after the puzzle is solved", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...NEAR_SOLVED_BOARD]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.handleMove(8));
      const movesAfterWin = result.current.moves;

      act(() => result.current.handleMove(7));

      expect(result.current.moves).toBe(movesAfterWin);
      expect(result.current.tiles).toEqual(NEAR_SOLVED_BOARD);
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

      act(() => result.current.handleMove(6));
      expect(result.current.moves).toBe(1);

      act(() => result.current.resetGame());

      expect(result.current.moves).toBe(0);
      expect(result.current.isSolved).toBe(false);
    });
  });

  describe("changeGridSize", () => {
    it("resets the board with the new grid size", () => {
      vi.mocked(createInitialGameState).mockReturnValue(NEAR_SOLVED_STATE);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => result.current.changeGridSize(4));

      expect(result.current.tiles).toEqual(createInitialGameState(4).tiles);
      expect(result.current.gridSize).toBe(4);
      expect(result.current.moves).toBe(0);
    });
  });
});
