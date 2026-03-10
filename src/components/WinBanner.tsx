const WinBanner = ({ moves }: { moves: number }) => {
  return (
    <output
      aria-atomic="true"
      aria-live="polite"
      className="flex flex-col items-center gap-2 rounded-lg bg-emerald-50 px-6 py-4 text-emerald-800"
    >
      <p className="font-bold text-lg">
        Solved in {moves} {moves === 1 ? "move" : "moves"}!
      </p>
    </output>
  );
};

export default WinBanner;
