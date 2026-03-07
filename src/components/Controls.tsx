import { memo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center gap-3">
          <RadioGroupItem id="option-one" value="option-one" />
          <Label htmlFor="option-one">Option One</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem id="option-two" value="option-two" />
          <Label htmlFor="option-two">Option Two</Label>
        </div>
      </RadioGroup>
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
