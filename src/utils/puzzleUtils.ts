import type { GameState, GridSize, Tile } from "../types";

// CONSTANTS
export const DEFAULT_GRID_SIZE: GridSize = 3; // Default grid size
export const GRID_SIZE_OPTIONS: GridSize[] = [3, 4, 5];

/**
 * Creates the initial solved board as a flat array of Tiles.
 * Values are 1-based integers in order; the last tile has `value: null` (empty slot).
 *
 * @param gridSize - Number of rows (and columns) in the square grid.
 * @returns Ordered array of `gridSize²` Tile objects.
 */
export const createBoard = (gridSize: GridSize): Tile[] => {
  const area = gridSize * gridSize;
  return Array.from({ length: area }, (_, index) => ({
    value: index === area - 1 ? null : index + 1,
  }));
};

/**
 * Returns a new board array with tiles in a randomised order.
 * Intended to produce a solvable starting state before each game.
 *
 * @param board - The solved board to shuffle
 * @param gridSize - The size of the grid
 * @returns A new array of the same Tiles in a shuffled order
 */
export const shuffleBoard = (board: Tile[], gridSize: GridSize): Tile[] => {
  const currentBoard = [...board];

  /**
   * Returns the valid neighbors of the empty tile
   *
   * @param gapIdx - The index of the empty tile
   * @param gridSize - The size of the grid
   * @returns The valid neighbors of the empty tile
   */
  const getValidNeighbors = (gapIdx: number, gridSize: GridSize): number[] => {
    const neighbors: number[] = [];

    const row = Math.floor(gapIdx / gridSize);
    const col = gapIdx % gridSize;

    // North
    if (row > 0) {
      neighbors.push(gapIdx - gridSize);
    }
    // South
    if (row < gridSize - 1) {
      neighbors.push(gapIdx + gridSize);
    }
    // West
    if (col > 0) {
      neighbors.push(gapIdx - 1);
    }
    // East
    if (col < gridSize - 1) {
      neighbors.push(gapIdx + 1);
    }

    return neighbors;
  };

  for (let i = 0; i < 200; i++) {
    const gapIdx = getEmptyTileIndex(currentBoard);
    const neighbors = getValidNeighbors(gapIdx, gridSize); // Helper to find indices North, South, East, West
    const randomNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    // Swap them
    [currentBoard[gapIdx], currentBoard[randomNeighbor]] = [
      currentBoard[randomNeighbor],
      currentBoard[gapIdx],
    ];
  }
  return currentBoard;
};

/**
 * Creates the initial game state with a shuffled board.
 *
 * @param gridSize - The size of the grid.
 * @returns The initial game state.
 */
export const createInitialGameState = (gridSize: GridSize): GameState => ({
  gridSize,
  moves: 0,
  status: "idle",
  tiles: shuffleBoard(createBoard(gridSize), gridSize),
});

/**
 * Returns the index of the empty tile in the board array.
 *
 * @param board - The current board state.
 * @returns The index of the empty tile.
 */
export const getEmptyTileIndex = (board: Tile[]): number => {
  return board.findIndex((tile) => tile.value === null);
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
  // Check if every tile (except the last one) is in its correct 1-based index position
  return tiles.every((tile, i) => {
    if (i === tiles.length - 1) {
      return tile.value === null; // Last one should be the gap
    }
    return tile.value === i + 1; // e.g., Index 0 should have value 1
  });
};
