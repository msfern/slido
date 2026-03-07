import confetti from "canvas-confetti";
import { useEffect } from "react";

export const useConfetti = (isSolved: boolean) => {
  useEffect(() => {
    if (!isSolved) {
      return;
    }

    confetti({
      particleCount: 100,
      spread: 360,
      startVelocity: 30,
      ticks: 60,
      zIndex: 0,
    });
  }, [isSolved]);
};
