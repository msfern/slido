import "./App.css";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Footer from "./components/Footer";
import { usePuzzle } from "./hooks/usePuzzle";
import { DEFAULT_GRID_SIZE } from "./utils/puzzleUtils";

function App() {
  const { tiles, handleMove, resetGame, moves, isSolved } = usePuzzle({
    gridSize: DEFAULT_GRID_SIZE,
  });

  console.log("tiles");

  useEffect(() => {
    if (isSolved) {
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount: 100,
        origin: {
          x: Math.random() * (0.3 - 0.1) + 0.1,
          y: Math.random() - 0.2,
        },
      });
    }
  }, [isSolved]);

  return (
    <>
      <main>
        <Controls resetGame={resetGame} />
        <Board handleMove={handleMove} moves={moves} tiles={tiles} />
      </main>
      <Footer />
    </>
  );
}

export default App;
