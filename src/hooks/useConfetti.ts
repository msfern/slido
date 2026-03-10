import { useEffect } from "react";

const useConfetti = (isSolved: boolean) => {
  useEffect(() => {
    if (!isSolved) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    import("canvas-confetti")
      .then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 360,
          startVelocity: 30,
          ticks: 60,
          colors: ["#4f46e5", "#10b981", "#f59e0b"],
        });
      })
      .catch((error) => {
        console.error("Failed to load canvas-confetti", error);
      });
  }, [isSolved]);
};

export default useConfetti;
