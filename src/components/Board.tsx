import type { GridSize, Tile as TileType } from "../types";
import "./Board.css";
import Tile from "./Tile";

const Board = ({
  handleMove,
  tiles,
  isSolved,
  gridSize,
}: {
  handleMove: (clickIndex: number) => void;
  tiles: TileType[];
  isSolved: boolean;
  gridSize: GridSize;
}) => {
  return (
    <div
      className="board"
      style={{ "--grid-size": gridSize } as React.CSSProperties}
    >
      {tiles.map((tile, index) => (
        <Tile
          handleMove={handleMove}
          index={index}
          isSolved={isSolved}
          key={tile.value ?? "empty"}
          tile={tile}
        />
      ))}
    </div>
  );
};

export default Board;
