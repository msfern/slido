import type { GameState, Tile } from "@/types";

export const SOLVED_BOARD: Tile[] = [
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

export const NEAR_SOLVED_BOARD: Tile[] = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: null },
  { value: 8 },
];

export const NEAR_SOLVED_STATE: GameState = {
  gridSize: 3,
  moves: 0,
  status: "idle",
  tiles: NEAR_SOLVED_BOARD,
};
