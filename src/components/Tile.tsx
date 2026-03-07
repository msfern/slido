import { motion } from "motion/react";
import { memo } from "react";
import type { GridSize, Tile as TileType } from "../types";
import "./Tile.css";

interface TileProps {
  gridSize: GridSize;
  handleMove: (index: number) => void;
  index: number;
  tile: TileType;
}

const Tile = ({ gridSize, index, handleMove, tile }: TileProps) => {
  if (tile.value === null) {
    return <div aria-hidden="true" className="tile is-empty" />;
  }

  const row = Math.floor(index / gridSize) + 1;
  const col = (index % gridSize) + 1;

  return (
    <motion.button
      aria-label={`Tile ${tile.value}, row ${row}, column ${col}`}
      className="tile"
      layout
      onClick={() => handleMove(index)}
      transition={{ type: "spring", stiffness: 700, damping: 35 }}
      type="button"
    >
      {tile.value}
    </motion.button>
  );
};

export default memo(Tile);
