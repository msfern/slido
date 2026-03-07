import confetti from "canvas-confetti";

export const useConfetti = () => {
  return (isSolved: boolean) => {
    if (isSolved) {
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount: 100,
      });
    }
  };
};
