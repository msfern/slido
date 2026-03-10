import Board from "@/components/Board";
import Controls from "@/components/Controls";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WinBanner from "@/components/WinBanner";
import useConfetti from "@/hooks/useConfetti";
import { usePuzzle } from "@/hooks/usePuzzle";
import { DEFAULT_GRID_SIZE } from "@/utils/puzzleUtils";

const App = () => {
  const {
    changeGridSize,
    gridSize,
    handleMove,
    isSolved,
    moves,
    resetGame,
    tiles,
  } = usePuzzle({ gridSize: DEFAULT_GRID_SIZE });

  useConfetti(isSolved);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 p-4">
      <Header />
      <main className="flex flex-col gap-3 sm:gap-6">
        <Controls
          gridSize={gridSize}
          moves={moves}
          onGridSizeChange={changeGridSize}
          resetGame={resetGame}
        />
        <Board
          gridSize={gridSize}
          handleMove={handleMove}
          isSolved={isSolved}
          tiles={tiles}
        />
        {isSolved && <WinBanner moves={moves} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
