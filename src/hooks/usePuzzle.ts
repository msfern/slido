import { useCallback, useReducer } from "react";
import { puzzleReducer } from "@/reducer/puzzleReducer";
import type { GridSize } from "../types";
import { createInitialGameState } from "../utils/puzzleUtils";

export const usePuzzle = ({ gridSize }: { gridSize: GridSize }) => {
  const [state, dispatch] = useReducer(
    puzzleReducer,
    createInitialGameState(gridSize)
  );

  const handleMove = useCallback(
    (clickedIndex: number) => dispatch({ type: "MOVE", clickedIndex }),
    []
  );

  const resetGame = useCallback(() => dispatch({ type: "RESET" }), []);

  const changeGridSize = useCallback(
    (newSize: GridSize) =>
      dispatch({ type: "CHANGE_GRID_SIZE", gridSize: newSize }),
    []
  );

  return {
    changeGridSize,
    gridSize: state.gridSize,
    handleMove,
    isSolved: state.status === "won",
    moves: state.moves,
    resetGame,
    tiles: state.tiles,
  };
};
