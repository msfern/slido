import type { GridSize, Tile as TileType } from "../types";
import "./Board.css";
import Tile from "./Tile";

interface BoardProps {
  gridSize: GridSize;
  handleMove: (clickIndex: number) => void;
  isSolved: boolean;
  tiles: TileType[];
}

const Board = ({ gridSize, handleMove, isSolved, tiles }: BoardProps) => {
  return (
    <section
      aria-label={`${gridSize} by ${gridSize} sliding puzzle`}
      className={`board ${isSolved ? "has-won" : ""}`}
      style={{ "--grid-size": gridSize } as React.CSSProperties}
    >
      {tiles.map((tile, index) => (
        <Tile
          gridSize={gridSize}
          handleMove={handleMove}
          index={index}
          key={tile.value ?? "empty"}
          tile={tile}
        />
      ))}
    </section>
  );
};

export default Board;
