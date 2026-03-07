import { useCallback, useState } from "react";
import type { GridSize, Tile } from "../types";
import {
  canMoveTile,
  checkWin,
  createBoard,
  getEmptyTileIndex,
  moveTile,
  shuffleBoard,
} from "../utils/puzzleUtils";

/**
 * Holds the logic for the puzzle
 * @returns {tiles: Tile[], handleMove: (tile: Tile) => void, moves: number, resetGame: () => void, isSolved: boolean}
 */
export const usePuzzle = ({ gridSize }: { gridSize: GridSize }) => {
  const [tiles, setTiles] = useState<Tile[]>(() =>
    shuffleBoard(createBoard(gridSize), gridSize)
  );
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const handleMove = useCallback(
    (clickedTileIndex: number) => {
      if (isSolved) {
        return;
      }
      const emptyTileIndex = getEmptyTileIndex(tiles);

      if (canMoveTile(clickedTileIndex, emptyTileIndex, gridSize)) {
        setMoves((prevMoves) => prevMoves + 1);
        setTiles((prevTiles: Tile[]): Tile[] => {
          const updatedTiles = moveTile(
            prevTiles,
            clickedTileIndex,
            emptyTileIndex
          );

          if (checkWin(updatedTiles)) {
            setIsSolved(true);
          }

          return updatedTiles;
        });
      }
    },
    [gridSize, isSolved, tiles]
  );

  const resetGame = useCallback(() => {
    setTiles(shuffleBoard(createBoard(gridSize), gridSize));
    setMoves(0);
    setIsSolved(false);
  }, [gridSize]);

  return { tiles, handleMove, moves, resetGame, isSolved };
};
