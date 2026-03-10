import type { GameAction, GameState } from "@/features/puzzle/types";
import {
  canMoveTile,
  checkWin,
  createInitialGameState,
  getEmptyTileIndex,
  moveTile,
} from "@/features/puzzle/utils/puzzleUtils";

export const puzzleReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "MOVE": {
      if (state.status === "won") {
        return state;
      }

      const emptyTileIndex = getEmptyTileIndex(state.tiles);
      if (!canMoveTile(action.clickedIndex, emptyTileIndex, state.gridSize)) {
        return state;
      }

      const newTiles = moveTile(
        state.tiles,
        action.clickedIndex,
        emptyTileIndex
      );

      return {
        ...state,
        tiles: newTiles,
        moves: state.moves + 1,
        status: checkWin(newTiles) ? "won" : "playing",
      };
    }
    case "RESET":
      return createInitialGameState(state.gridSize);
    case "CHANGE_GRID_SIZE":
      return createInitialGameState(action.gridSize);
    default:
      throw new Error(`Unhandled action type: ${(action as GameAction).type}`);
  }
};
