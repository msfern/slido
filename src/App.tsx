import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WinBanner from "@/components/WinBanner";
import Board from "@/features/puzzle/components/Board";
import Controls from "@/features/puzzle/components/Controls";
import { usePuzzle } from "@/features/puzzle/hooks/usePuzzle";
import { DEFAULT_GRID_SIZE } from "@/features/puzzle/utils/puzzleUtils";
import useConfetti from "@/hooks/useConfetti";

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
