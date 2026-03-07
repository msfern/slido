import { motion } from "framer-motion";
import { memo } from "react";
import type { Tile as TileType } from "../types";
import "./Tile.css";

interface TileProps {
  handleMove: (index: number) => void;
  index: number;
  isSolved: boolean;
  tile: TileType;
}

const Tile = ({ index, handleMove, tile, isSolved }: TileProps) => {
  const isEmpty = tile.value === null;

  return (
    <motion.button
      className={`tile ${isEmpty ? "is-empty" : ""} ${isSolved ? "has-won" : ""}`}
      layout
      onClick={() => handleMove(index)}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      type="button"
    >
      {tile.value ?? " "}
    </motion.button>
  );
};

export default memo(Tile);
