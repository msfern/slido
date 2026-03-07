import type { Tile as TileType } from "../types";
import "./Board.css";
import Tile from "./Tile";

const Board = ({
  handleMove,
  tiles,
}: {
  handleMove: (clickIndex: number) => void;
  tiles: TileType[];
}) => {
  return (
    <div className="board">
      {tiles.map((tile, index) => (
        <Tile
          handleMove={handleMove}
          index={index}
          key={tile.value ?? "empty"}
          tile={tile}
        />
      ))}
    </div>
  );
};

export default Board;
