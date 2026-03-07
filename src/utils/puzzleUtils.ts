import type { GridSize, Tile } from "../types";

// CONSTANTS
export const DEFAULT_GRID_SIZE: GridSize = 3; // Default grid size

/**
 * Creates the initial solved board as a flat array of Tiles.
 * Values are 1-based integers in order; the last tile has `value: null` (empty slot).
 *
 * @param gridSize - Number of rows (and columns) in the square grid.
 * @returns Ordered array of `gridSize²` Tile objects.
 */
export const createBoard = (gridSize: number): Tile[] => {
  const area = gridSize * gridSize;
  return Array.from({ length: area }, (_, index) => ({
    value: index === area - 1 ? null : index + 1,
  }));
};

/**
 * Returns a new board array with tiles in a randomised order.
 * Intended to produce a solvable starting state before each game.
 *
 * @param board - The solved board to shuffle.
 * @returns A new array of the same Tiles in a shuffled order.
 */
export const shuffleBoard = (board: Tile[]): Tile[] => {
  // TODO: Implement shuffle logic
  return [...board];
};

/**
 * Determines whether a tile is directly adjacent (horizontally or vertically)
 * to the empty tile and can therefore be legally moved.
 *
 * @param clickedTileIndex - The index of the clicked tile.
 * @param emptyTileIndex - The index of the empty tile.
 * @param gridSize - The size of the grid.
 * @returns `true` if the tile shares a side (horizontally or vertically) with the empty slot.
 */
export const canMoveTile = (
  clickedTileIndex: number,
  emptyTileIndex: number,
  gridSize: GridSize
): boolean => {
  // Vertical movement (Always safe in 1D arrays)
  const isVerticalNeighbor =
    Math.abs(clickedTileIndex - emptyTileIndex) === gridSize;

  // Horizontal movement (Needs a row check!)
  const isHorizontalNeighbor =
    Math.abs(clickedTileIndex - emptyTileIndex) === 1;

  // Check if they are actually on the same row to prevent "teleporting"
  const clickedRow = Math.floor(clickedTileIndex / gridSize);
  const emptyRow = Math.floor(emptyTileIndex / gridSize);
  const isSameRow = clickedRow === emptyRow;

  return isVerticalNeighbor || (isHorizontalNeighbor && isSameRow);
};

/**
 * Swaps the given tile with the empty tile in the board array,
 * producing the new board state after a valid move.
 *
 * @param board - The current board state.
 * @param clickedTileIndex - The index of the clicked tile.
 * @param emptyTileIndex - The index of the empty tile.
 * @param gridSize - The size of the grid.
 * @returns A new board array reflecting the move.
 */
export const moveTile = (
  board: Tile[],
  clickedTileIndex: number,
  emptyTileIndex: number
): Tile[] => {
  const newBoard = [...board];

  [newBoard[clickedTileIndex], newBoard[emptyTileIndex]] = [
    newBoard[emptyTileIndex],
    newBoard[clickedTileIndex],
  ];
  return newBoard;
};

/**
 * Checks whether the puzzle is in the solved state.
 * Solved means tiles are ordered 1…n-1 with the empty tile last.
 *
 * @param tiles - The current board state.
 * @returns `true` if every tile is in its goal position.
 */
export const checkWin = (tiles: Tile[]): boolean => {
  // The last tile must be null
  if (tiles.at(-1)?.value !== null) {
    return false;
  }

  // Every other tile must be index + 1
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i].value !== i + 1) {
      return false;
    }
  }

  return true;
};
