// import { useEffect } from "react";

// interface UseKeyboardProps {
//   gridSize: number;
//   emptyIdx: number;
//   onMove: (index: number) => void;
//   isSolved: boolean;
// }

// export const useKeyboardControls = ({
//   gridSize,
//   emptyIdx,
//   onMove,
//   isSolved,
// }: UseKeyboardProps) => {
//   useEffect(() => {
//     if (isSolved) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       let targetIdx = -1;
//       const row = Math.floor(emptyIdx / gridSize);
//       const col = emptyIdx % gridSize;

//       switch (e.key) {
//         case "ArrowUp": // Move the tile BELOW the gap UP
//           if (row < gridSize - 1) targetIdx = emptyIdx + gridSize;
//           break;
//         case "ArrowDown": // Move the tile ABOVE the gap DOWN
//           if (row > 0) targetIdx = emptyIdx - gridSize;
//           break;
//         case "ArrowLeft": // Move the tile to the RIGHT of the gap LEFT
//           if (col < gridSize - 1) targetIdx = emptyIdx + 1;
//           break;
//         case "ArrowRight": // Move the tile to the LEFT of the gap RIGHT
//           if (col > 0) targetIdx = emptyIdx - 1;
//           break;
//           de
//       }

//       if (targetIdx !== -1) {
//         e.preventDefault(); // Prevent page scrolling
//         onMove(targetIdx);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [emptyIdx, gridSize, onMove, isSolved]);
// };
