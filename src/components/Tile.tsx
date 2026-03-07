import { memo } from "react";
import type { Tile as TileType } from "../types";

interface TileProps {
  handleMove: (index: number) => void;
  index: number;
  tile: TileType;
}

const Tile = ({ index, handleMove, tile }: TileProps) => {
  console.log(`Rendering Tile: ${tile.value}`);
  return (
    <button
      disabled={tile.value === null}
      onClick={() => handleMove(index)}
      type="button"
    >
      {tile.value ?? "empty"} (i: {index})
    </button>
  );
};

export default memo(Tile);
