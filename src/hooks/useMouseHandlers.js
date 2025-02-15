import { getGridCoords } from "../utils/getGridCoords";

/**
 * Custom hook for handling mouse events.
 */
export const useMouseHandlers = ({
  activeLayer,
  selectedTile,
  drawingTool,
  updateTile,
  setGridBase,
  setGridOverlay,
  canvasMouseDown,
  canvasMouseMove,
  canvasMouseUp,
  startPos,
  canvasRef,
  pinnedTooltip,
  handleHover,
  TILE_SIZE,
}) => {
  const onMouseDown = (e) => {
    // For events layer or no tile selected, update immediately.
    if (activeLayer === "events" || selectedTile === null) {
      updateTile(e, activeLayer, "down", selectedTile);
      return;
    }
    // Fill the entire base grid.
    if (activeLayer === "base" && drawingTool === "fill") {
      setGridBase((prev) => prev.map((row) => row.map(() => selectedTile)));
      return;
    }
    // Use pencil tool or delegate to canvas-specific handler.
    drawingTool === "pencil"
      ? updateTile(e, activeLayer, "down", selectedTile)
      : canvasMouseDown(e);
  };

  const onMouseMove = (e) => {
    if (!pinnedTooltip) handleHover(e);
    if (e.buttons === 0) return;
    if (activeLayer === "events" || selectedTile === null) {
      updateTile(e, activeLayer, "move", selectedTile);
      return;
    }
    if (activeLayer === "base" && drawingTool === "fill") return;
    drawingTool === "pencil"
      ? updateTile(e, activeLayer, "move", selectedTile)
      : canvasMouseMove(e);
    if (!pinnedTooltip) handleHover(e);
  };

  const onMouseUp = (e) => {
    if (activeLayer === "events" || selectedTile === null) {
      updateTile(e, activeLayer, "up", selectedTile);
      return;
    }
    if (activeLayer === "base" && drawingTool === "fill") return;
    if (drawingTool === "pencil") {
      updateTile(e, activeLayer, "up", selectedTile);
    } else {
      canvasMouseUp(e);
      let endPos = getGridCoords(e, canvasRef.current, TILE_SIZE);
      if (startPos && startPos.x === endPos.x && startPos.y === endPos.y) {
        endPos = { x: startPos.x + 1, y: startPos.y + 1 };
      }
      if (drawingTool === "rectangle") {
        const xStart = Math.min(startPos.x, endPos.x);
        const xEnd = Math.max(startPos.x, endPos.x);
        const yStart = Math.min(startPos.y, endPos.y);
        const yEnd = Math.max(startPos.y, endPos.y);
        const updateGrid = (prevGrid) => {
          const newGrid = prevGrid.map((row) => [...row]);
          for (let y = yStart; y <= yEnd; y++) {
            for (let x = xStart; x <= xEnd; x++) {
              newGrid[y][x] = selectedTile;
            }
          }
          return newGrid;
        };
        if (activeLayer === "base") {
          setGridBase(updateGrid);
        } else if (activeLayer === "overlay") {
          setGridOverlay(updateGrid);
        }
      }
    }
  };

  return { onMouseDown, onMouseMove, onMouseUp };
};
