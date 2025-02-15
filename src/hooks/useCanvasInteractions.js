import { useState } from "react";
import { getGridCoords } from "../utils/getGridCoords";

/**
 * Custom hook for handling canvas interactions.
 */
export function useCanvasInteractions(canvasRef, tileSize = 40) {
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    const pos = getGridCoords(e, canvasRef.current, tileSize);
    setStartPos(pos);
    setCurrentPos(pos);
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    // Only update currentPos if we already have a startPos (e.g., dragging)
    if (startPos) {
      const pos = getGridCoords(e, canvasRef.current, tileSize);
      setCurrentPos(pos);
    }
  };

  const handleMouseUp = () => {
    // Return the final position or simply reset.
    setStartPos(null);
    setCurrentPos(null);
  };

  return {
    startPos,
    currentPos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
