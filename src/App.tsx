import "./App.css";
import { useEffect } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Footer from "./components/Footer";
import { useConfetti } from "./hooks/useConfetti";
import { usePuzzle } from "./hooks/usePuzzle";

function App() {
  const { tiles, handleMove, resetGame, moves, isSolved } = usePuzzle({
    gridSize: 3,
  });
  const confetti = useConfetti();

  useEffect(() => {
    confetti(isSolved);
  }, [isSolved, confetti]);

  return (
    <div>
      <header className="mb-8 flex w-full max-w-md items-center justify-center">
        <Controls moves={moves} resetGame={resetGame} />
      </header>
      <main>
        <Board
          gridSize={3}
          handleMove={handleMove}
          isSolved={isSolved}
          tiles={tiles}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
