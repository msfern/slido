export type TileValue = number | null; // null represents the empty gap

export interface Tile {
  value: TileValue;
}

export type GridSize = 3 | 4 | 5;

export type GameStatus = "idle" | "playing" | "won";

export interface PuzzleState {
  bestScore: number | null; // Stored in localStorage perhaps?
  gridSize: number;
  moves: number;
  status: GameStatus;
  tiles: Tile[];
}
