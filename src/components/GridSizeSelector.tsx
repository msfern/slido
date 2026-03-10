import type { GridSize } from "@/types";
import { GRID_SIZE_OPTIONS } from "@/utils/puzzleUtils";

const GridSizeRadio = ({
  gridSize,
  onGridSizeChange,
}: {
  gridSize: GridSize;
  onGridSizeChange: (size: GridSize) => void;
}) => {
  return (
    <div className="flex flex-col justify-between gap-1" role="radiogroup">
      <legend className="font-bold text-slate-400 text-xs uppercase tracking-widest">
        Select a grid size:
      </legend>
      <div className="flex items-start gap-4">
        {GRID_SIZE_OPTIONS.map((size) => (
          <div key={size}>
            <input
              checked={gridSize === size}
              id={`grid-${size}`}
              name="grid-size"
              onChange={() => onGridSizeChange(size)}
              type="radio"
            />
            <label htmlFor={`grid-${size}`}>
              {size}&times;{size}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridSizeRadio;
