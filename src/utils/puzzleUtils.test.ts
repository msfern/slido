import { describe, expect, it } from "vitest";
import type { Tile } from "../types";
import {
  canMoveTile,
  checkWin,
  createBoard,
  createInitialGameState,
  GRID_SIZE_OPTIONS,
  moveTile,
  shuffleBoard,
} from "./puzzleUtils";

describe("puzzleUtils", () => {
  describe("createBoard", () => {
    it.each([
      ...GRID_SIZE_OPTIONS,
    ])("should create a board with the correct number of tiles for gridSize %i", (gridSize) => {
      const board = createBoard(gridSize);
      expect(board).toHaveLength(gridSize * gridSize);
      expect(board.at(-1)?.value).toBeNull();
    });

    it.each([
      ...GRID_SIZE_OPTIONS,
    ])("should have tiles ordered 1…n-1 for gridSize %i", (gridSize) => {
      const board = createBoard(gridSize);
      const area = gridSize * gridSize;
      for (let i = 0; i < area - 1; i++) {
        expect(board[i].value).toBe(i + 1);
      }
    });
  });

  describe("canMoveTile", () => {
    // Layout (3×3):
    // [0][1][2]
    // [3][4][5]
    // [6][7][8]
    it("should return true for a horizontal neighbor to the left of empty", () => {
      // empty at index 2 → tile at index 1 is left-adjacent
      expect(canMoveTile(2, 1, 3)).toBe(true);
    });

    it("should return true for a horizontal neighbor to the right of empty", () => {
      // empty at index 1 → tile at index 2 is right-adjacent
      expect(canMoveTile(1, 2, 3)).toBe(true);
    });

    it("should return true for a vertical neighbor above the empty tile", () => {
      // empty at index 4 (center) → tile at index 1 is directly above
      expect(canMoveTile(4, 1, 3)).toBe(true);
    });

    it("should return true for a vertical neighbor below the empty tile", () => {
      // empty at index 4 (center) → tile at index 7 is directly below
      expect(canMoveTile(4, 7, 3)).toBe(true);
    });

    it("should return false for a non-adjacent tile in the same row", () => {
      // empty at index 3, clicked index 5 → diff 2, same row
      expect(canMoveTile(3, 5, 3)).toBe(false);
    });

    it("should return false for a tile that wraps across a row boundary", () => {
      // empty at index 3 (start of row 1) → tile at index 2 (end of row 0)
      // index diff is 1 but they are on different rows
      expect(canMoveTile(3, 2, 3)).toBe(false);
    });

    it("should return false when clicking the empty tile itself", () => {
      expect(canMoveTile(4, 4, 3)).toBe(false);
    });
  });

  describe("moveTile", () => {
    it("should move the tile to the empty slot (tile left of empty)", () => {
      const board: Tile[] = [{ value: 1 }, { value: 2 }, { value: null }];
      expect(moveTile(board, 1, 2)).toEqual([
        { value: 1 },
        { value: null },
        { value: 2 },
      ]);
    });

    it("should move the tile to the empty slot (tile right of empty)", () => {
      const board: Tile[] = [{ value: null }, { value: 1 }, { value: 2 }];
      expect(moveTile(board, 1, 0)).toEqual([
        { value: 1 },
        { value: null },
        { value: 2 },
      ]);
    });

    it("should not mutate the original board", () => {
      const board: Tile[] = [{ value: 1 }, { value: 2 }, { value: null }];
      const newBoard = moveTile(board, 1, 2);
      expect(board).not.toEqual(newBoard);
    });

    it("should return a new array reference", () => {
      const board: Tile[] = [{ value: 1 }, { value: 2 }, { value: null }];
      expect(moveTile(board, 1, 2)).not.toBe(board);
    });
  });

  describe("checkWin", () => {
    it("should return true for a fully solved 3×3 board", () => {
      const board: Tile[] = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: null },
      ];
      expect(checkWin(board)).toBe(true);
    });

    it("should return false when null is not in the last position", () => {
      const board: Tile[] = [{ value: 1 }, { value: null }, { value: 2 }];
      expect(checkWin(board)).toBe(false);
    });

    it("should return false when tile values are scrambled but null is last", () => {
      const board: Tile[] = [
        { value: 3 },
        { value: 1 },
        { value: 2 },
        { value: null },
      ];
      expect(checkWin(board)).toBe(false);
    });

    it("should return false when a middle tile has the wrong value", () => {
      const board: Tile[] = [
        { value: 1 },
        { value: 3 },
        { value: 2 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: null },
      ];
      expect(checkWin(board)).toBe(false);
    });
  });

  describe("shuffleBoard", () => {
    const solvedBoard = createBoard(3);

    it("should return an array of the same length", () => {
      expect(shuffleBoard(solvedBoard, 3)).toHaveLength(solvedBoard.length);
    });

    it("should contain the same set of tile values", () => {
      const shuffled = shuffleBoard(solvedBoard, 3);
      const originalValues = solvedBoard.map((t) => t.value).sort();
      const shuffledValues = shuffled.map((t) => t.value).sort();
      expect(shuffledValues).toEqual(originalValues);
    });

    it("should return a new array reference", () => {
      expect(shuffleBoard(solvedBoard, 3)).not.toBe(solvedBoard);
    });
  });

  describe("createInitialGameState", () => {
    it.each([
      ...GRID_SIZE_OPTIONS,
    ])("produces a board of the correct size with zero moves for gridSize %i", (gridSize) => {
      const state = createInitialGameState(gridSize);

      expect(state.tiles).toHaveLength(gridSize * gridSize);
      expect(state.moves).toBe(0);
      expect(state.status).toBe("idle");
      expect(state.gridSize).toBe(gridSize);
    });
  });
});
