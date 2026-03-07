import { useState } from "react";
import type { GridSize } from "@/types";
import { DEFAULT_GRID_SIZE, GRID_SIZE_OPTIONS } from "@/utils/puzzleUtils";

const GridSizeRadio = ({
  onGridSizeChange,
}: {
  onGridSizeChange: (size: GridSize) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState<GridSize>(DEFAULT_GRID_SIZE);

  const handleSizeChange = (size: GridSize) => {
    setSelectedSize(size);
    onGridSizeChange(size);
  };

  return (
    <fieldset className="flex flex-col items-start gap-1">
      <legend className="font-bold text-slate-400 text-xs uppercase tracking-widest">
        Select a grid size:
      </legend>
      <div className="flex items-start gap-4">
        {GRID_SIZE_OPTIONS.map((size) => (
          <div key={size}>
            <input
              checked={selectedSize === size}
              id={`grid-${size}`}
              name="grid-size"
              onChange={() => handleSizeChange(size)}
              type="radio"
            />
            <label htmlFor={`grid-${size}`}>
              {size}&times;{size}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default GridSizeRadio;
