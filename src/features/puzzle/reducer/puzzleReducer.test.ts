import { describe, expect, it } from "vitest";
import type { GameState } from "@/features/puzzle/types";
import { NEAR_SOLVED_STATE } from "@/mocks/testMocks";
import { puzzleReducer } from "./puzzleReducer";

describe("puzzleReducer", () => {
  describe("MOVE action", () => {
    it("swaps a valid adjacent tile with the empty slot", () => {
      const next = puzzleReducer(NEAR_SOLVED_STATE, {
        type: "MOVE",
        clickedIndex: 6,
      });

      expect(next.tiles[6].value).toBeNull();
      expect(next.tiles[7].value).toBe(7);
      expect(next.moves).toBe(1);
      expect(next.status).toBe("playing");
    });

    it("returns the same reference for an invalid move", () => {
      const next = puzzleReducer(NEAR_SOLVED_STATE, {
        type: "MOVE",
        clickedIndex: 0,
      });

      expect(next).toBe(NEAR_SOLVED_STATE);
    });

    it("returns the same reference when the game is already won", () => {
      const wonState: GameState = { ...NEAR_SOLVED_STATE, status: "won" };
      const next = puzzleReducer(wonState, {
        type: "MOVE",
        clickedIndex: 6,
      });

      expect(next).toBe(wonState);
    });

    it("sets status to 'won' when the winning move is made", () => {
      const next = puzzleReducer(NEAR_SOLVED_STATE, {
        type: "MOVE",
        clickedIndex: 8,
      });

      expect(next.status).toBe("won");
      expect(next.moves).toBe(1);
    });

    it("accumulates moves across sequential dispatches", () => {
      let state = puzzleReducer(NEAR_SOLVED_STATE, {
        type: "MOVE",
        clickedIndex: 6,
      });
      state = puzzleReducer(state, { type: "MOVE", clickedIndex: 7 });

      expect(state.moves).toBe(2);
    });
  });

  describe("RESET action", () => {
    it("resets moves and status while preserving gridSize", () => {
      const playedState: GameState = {
        ...NEAR_SOLVED_STATE,
        moves: 5,
        status: "playing",
      };
      const next = puzzleReducer(playedState, { type: "RESET" });

      expect(next.moves).toBe(0);
      expect(next.status).toBe("idle");
      expect(next.gridSize).toBe(3);
    });
  });

  describe("CHANGE_GRID_SIZE action", () => {
    it("creates a new board with the specified grid size", () => {
      const next = puzzleReducer(NEAR_SOLVED_STATE, {
        type: "CHANGE_GRID_SIZE",
        gridSize: 4,
      });

      expect(next.tiles).toHaveLength(16);
      expect(next.gridSize).toBe(4);
      expect(next.moves).toBe(0);
      expect(next.status).toBe("idle");
    });
  });
});
