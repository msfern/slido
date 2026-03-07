import "./App.css";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Footer from "./components/Footer";
import { usePuzzle } from "./hooks/usePuzzle";
import { DEFAULT_GRID_SIZE } from "./utils/puzzleUtils";

function App() {
  const { tiles, handleMove, resetGame } = usePuzzle({
    gridSize: DEFAULT_GRID_SIZE,
  });

  return (
    <>
      <main>
        <Controls resetGame={resetGame} />
        <Board handleMove={handleMove} tiles={tiles} />
      </main>
      <Footer />
    </>
  );
}

export default App;
