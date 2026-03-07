import { useCallback, useState } from "react";
import type { GridSize, Tile } from "../types";
import {
  canMoveTile,
  checkWin,
  createBoard,
  moveTile,
} from "../utils/puzzleUtils";

/**
 * Holds the logic for the puzzle
 * @returns {tiles: Tile[], handleMove: (tile: Tile) => void, moves: number, resetGame: () => void, isSolved: boolean}
 */
export const usePuzzle = ({ gridSize }: { gridSize: GridSize }) => {
  const [tiles, setTiles] = useState<Tile[]>(() => createBoard(gridSize));
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const handleMove = useCallback(
    (clickedTileIndex: number) => {
      // Use the functional update to get the LATEST state without needing it in dependencies
      setTiles((prevTiles: Tile[]): Tile[] => {
        if (isSolved) {
          return prevTiles;
        }
        const emptyTileIndex = prevTiles.findIndex(
          (tile: Tile): boolean => tile.value === null
        );

        if (canMoveTile(clickedTileIndex, emptyTileIndex, gridSize)) {
          // 2. Move the tile
          const updatedTiles = moveTile(
            prevTiles,
            clickedTileIndex,
            emptyTileIndex
          );

          // 3. Update moves (using functional update here too!)
          setMoves((prevMoves) => prevMoves + 1);

          // 4. Check win
          if (checkWin(updatedTiles)) {
            setIsSolved(true);
          }

          return updatedTiles;
        }
        return prevTiles;
      });
    },
    [gridSize, isSolved]
  );

  const resetGame = useCallback(() => {
    setTiles(createBoard(gridSize));
    setMoves(0);
    setIsSolved(false);
  }, [gridSize]);

  return { tiles, handleMove, moves, resetGame, isSolved };
};
