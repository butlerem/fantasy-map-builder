import { getGridCoords } from "../utils/getGridCoords";
import { TILE_NAME_TO_INDEX } from "../assets/tileImages";

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
  // Helper to resolve selectedTile (string to index if needed)
  const resolveTileIndex = () => {
    // For base layer, just return the tile type directly
    if (activeLayer === "base") {
      return selectedTile;
    }
    // For other layers, convert to index if needed
    if (typeof selectedTile === "string") {
      return TILE_NAME_TO_INDEX[selectedTile];
    }
    return selectedTile;
  };

  const onMouseDown = (e) => {
    const tileIndex = resolveTileIndex();

    if (activeLayer === "events" || tileIndex === null) {
      updateTile(e, activeLayer, "down", tileIndex);
      return;
    }

    if (activeLayer === "base" && drawingTool === "fill") {
      setGridBase((prev) => prev.map((row) => row.map(() => ({ type: selectedTile }))));
      return;
    }

    drawingTool === "pencil"
      ? updateTile(e, activeLayer, "down", tileIndex)
      : canvasMouseDown(e);
  };

  const onMouseMove = (e) => {
    const tileIndex = resolveTileIndex();

    if (!pinnedTooltip) handleHover(e);
    if (e.buttons === 0) return;

    if (activeLayer === "events" || tileIndex === null) {
      updateTile(e, activeLayer, "move", tileIndex);
      return;
    }

    if (activeLayer === "base" && drawingTool === "fill") return;

    drawingTool === "pencil"
      ? updateTile(e, activeLayer, "move", tileIndex)
      : canvasMouseMove(e);
  };

  const onMouseUp = (e) => {
    const tileIndex = resolveTileIndex();

    if (activeLayer === "events" || tileIndex === null) {
      updateTile(e, activeLayer, "up", tileIndex);
      return;
    }

    if (activeLayer === "base" && drawingTool === "fill") return;

    if (drawingTool === "pencil") {
      updateTile(e, activeLayer, "up", tileIndex);
      return;
    }

    if (!startPos) return;

    canvasMouseUp(e);

    let endPos = getGridCoords(e, canvasRef.current, TILE_SIZE);

    if (startPos.x === endPos.x && startPos.y === endPos.y) {
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
            newGrid[y][x] = { type: selectedTile };
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
  };

  return { onMouseDown, onMouseMove, onMouseUp };
};
