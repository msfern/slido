import { memo } from "react";
import GridSizeSelector from "@/components/GridSizeSelector";
import Button from "@/components/ui/Button";
import type { GridSize } from "@/types";

interface ControlsProps {
  gridSize: GridSize;
  moves: number;
  onGridSizeChange: (gridSize: GridSize) => void;
  resetGame: () => void;
}

const Controls = ({
  gridSize,
  moves,
  onGridSizeChange,
  resetGame,
}: ControlsProps) => {
  return (
    <section
      aria-label="Game controls"
      className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:items-start sm:gap-6"
    >
      <div className="flex flex-col items-center">
        <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">
          Moves
        </span>
        <output
          aria-live="polite"
          className="block font-black text-3xl text-slate-800 tabular-nums"
          id="moves"
        >
          {moves}
        </output>
      </div>
      <GridSizeSelector
        gridSize={gridSize}
        onGridSizeChange={onGridSizeChange}
      />
      <Button onClick={resetGame}>New Game</Button>
    </section>
  );
};

export default memo(Controls);
