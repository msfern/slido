// (New Game, Size Switcher)

import { memo } from "react";

const Controls = ({ resetGame }: { resetGame: () => void }) => {
  return (
    <div>
      <button onClick={resetGame} type="button">
        New Game
      </button>
    </div>
  );
};

export default memo(Controls);
