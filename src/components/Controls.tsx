// (New Game, Size Switcher)

import { memo } from "react";

const Controls = ({
  moves,
  resetGame,
}: {
  moves: number;
  resetGame: () => void;
}) => {
  return (
    <div>
      <div className="flex flex-col">
        <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">
          Moves
        </span>
        <span className="font-black text-3xl text-slate-800 tabular-nums">
          {moves}
        </span>
      </div>
      <button
        className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-900"
        onClick={resetGame}
        type="button"
      >
        New Game
      </button>
    </div>
  );
};

export default memo(Controls);
