export type TileValue = number | null;

export interface Tile {
  value: TileValue;
}

export type GridSize = 3 | 4 | 5;

export type GameStatus = "idle" | "playing" | "won";

export interface GameState {
  gridSize: GridSize;
  moves: number;
  status: GameStatus;
  tiles: Tile[];
}

export type GameAction =
  | { type: "MOVE"; clickedIndex: number }
  | { type: "RESET" }
  | { type: "CHANGE_GRID_SIZE"; gridSize: GridSize };
