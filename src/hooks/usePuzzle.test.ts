// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { shuffleBoard } from "../utils/puzzleUtils";
import { usePuzzle } from "./usePuzzle";

// Mock the shuffleBoard function
vi.mock("../utils/puzzleUtils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/puzzleUtils")>();
  return {
    ...actual,
    shuffleBoard: vi.fn(actual.shuffleBoard),
    createBoard: vi.fn(actual.createBoard),
  };
});

// 3×3 board one move away from solved: empty at index 7, tile 8 at index 8.
// Calling handleMove(8) produces the solved state [1…8, null].
const nearSolvedBoard = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: null },
  { value: 8 },
] as const;

describe("usePuzzle", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("initialises with a 3×3 unsolved board by default", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      expect(result.current.tiles).toHaveLength(9);
      expect(result.current.moves).toBe(0);
      expect(result.current.isSolved).toBe(false);
    });

    it("initialises with the correct tile count for a custom gridSize", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 4 }));

      expect(result.current.tiles).toHaveLength(16);
    });
  });

  describe("handleMove", () => {
    it("does not update state when the tile cannot move", () => {
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));
      // Solved board: empty at index 8. Index 0 (top-left) is not adjacent.
      const tilesBefore = result.current.tiles;

      act(() => {
        result.current.handleMove(0);
      });

      expect(result.current.moves).toBe(0);
      expect(result.current.tiles).toEqual(tilesBefore);
    });

    it("increments moves and updates tiles on a valid move", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...nearSolvedBoard]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => {
        result.current.handleMove(6);
      });

      expect(result.current.moves).toBe(1);
      expect(result.current.tiles[6].value).toBeNull();
      expect(result.current.tiles[7].value).toBe(7);
    });

    it("accumulates moves across multiple valid moves", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...nearSolvedBoard]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));
      console.log(result.current.tiles);

      act(() => {
        result.current.handleMove(6); // move 1: empty → index 6
      });
      act(() => {
        result.current.handleMove(7); // move 2: empty → index 7 (back)
      });

      expect(result.current.moves).toBe(2);
    });

    it("sets isSolved to true after the winning move", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...nearSolvedBoard]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => {
        result.current.handleMove(8); // slides tile 8 into the last slot
      });

      expect(result.current.isSolved).toBe(true);
    });

    it("is a no-op when the puzzle is already solved", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...nearSolvedBoard]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      act(() => {
        result.current.handleMove(8); // winning move
      });

      expect(result.current.isSolved).toBe(true);
      const movesAfterWin = result.current.moves;

      act(() => {
        result.current.handleMove(7); // would be valid but puzzle is won
      });

      expect(result.current.moves).toBe(movesAfterWin);
      expect(result.current.isSolved).toBe(true);
    });
  });

  describe("resetGame", () => {
    it("resets moves to 0 and tiles to the initial board after a move", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...nearSolvedBoard]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));
      const initialTiles = result.current.tiles;

      act(() => {
        result.current.handleMove(6);
      });

      expect(result.current.moves).toBe(1);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.moves).toBe(0);
      expect(result.current.isSolved).toBe(false);
      expect(result.current.tiles).not.toEqual(initialTiles);
    });

    it("resets isSolved to false after a win", () => {
      vi.mocked(shuffleBoard).mockReturnValueOnce([...nearSolvedBoard]);
      const { result } = renderHook(() => usePuzzle({ gridSize: 3 }));

      expect(result.current.isSolved).toBe(false);
    });
  });
});
