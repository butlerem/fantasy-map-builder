import React, { useRef, useEffect, useContext, useState } from "react";
import { MapContext } from "../context/MapContext";
import tileImages from "../assets/tileImages";
import getFrameForEvent from "../assets/eventSprites";
// Import the outdoor tileset URL.
import outdoorTileset from "../assets/maps/outdoor.png";

const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;
const TILE_SIZE = 46; // on-canvas display size (even if source tiles are 32x32)

const MapCanvas = ({ activeLayer, selectedTile, drawingTool }) => {
  const canvasRef = useRef(null);
  const {
    gridBase,
    setGridBase,
    gridOverlay,
    setGridOverlay,
    animatedEvents,
    updateTile,
  } = useContext(MapContext);

  // Create an Image instance for the outdoor tileset.
  const outdoorImageRef = useRef(null);
  if (!outdoorImageRef.current) {
    const img = new Image();
    img.src = outdoorTileset;
    outdoorImageRef.current = img;
  }

  // Local state for shape preview.
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);

  // Convert mouse event to grid coordinates.
  const getGridCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE),
      y: Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE),
    };
  };

  // Mouse event handlers.
  const handleMouseDown = (e) => {
    // Always handle events layer normally.
    if (activeLayer === "events") {
      updateTile(e, activeLayer, "down", selectedTile);
      return;
    }
    // If eraser is selected (selectedTile is null), always update immediately.
    if (selectedTile === null) {
      updateTile(e, activeLayer, "down", selectedTile);
      return;
    }
    // For base layer, if the fill tool is active, do a full fill.
    if (activeLayer === "base" && drawingTool === "fill") {
      setGridBase((prev) => prev.map((row) => row.map(() => selectedTile)));
      return;
    }
    // For overlay, if fill is selected, treat it as pencil.
    const effectiveTool =
      activeLayer === "overlay" && drawingTool === "fill"
        ? "pencil"
        : drawingTool;
    if (effectiveTool === "pencil") {
      updateTile(e, activeLayer, "down", selectedTile);
    } else {
      // For shape tools, record the start position.
      const pos = getGridCoords(e);
      setStartPos(pos);
      setCurrentPos(pos);
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 0) return;
    if (activeLayer === "events") {
      updateTile(e, activeLayer, "move", selectedTile);
      return;
    }
    // Eraser: always update immediately.
    if (selectedTile === null) {
      updateTile(e, activeLayer, "move", selectedTile);
      return;
    }
    // For base layer with fill, no need to update on move.
    if (activeLayer === "base" && drawingTool === "fill") return;
    const effectiveTool =
      activeLayer === "overlay" && drawingTool === "fill"
        ? "pencil"
        : drawingTool;
    if (effectiveTool === "pencil") {
      updateTile(e, activeLayer, "move", selectedTile);
    } else if (startPos) {
      const pos = getGridCoords(e);
      setCurrentPos(pos);
    }
  };

  const handleMouseUp = (e) => {
    if (activeLayer === "events") {
      updateTile(e, activeLayer, "up", selectedTile);
      return;
    }
    if (selectedTile === null) {
      updateTile(e, activeLayer, "up", selectedTile);
      return;
    }
    // For base layer with fill, fill is already done.
    if (activeLayer === "base" && drawingTool === "fill") return;
    const effectiveTool =
      activeLayer === "overlay" && drawingTool === "fill"
        ? "pencil"
        : drawingTool;
    if (effectiveTool === "pencil") {
      updateTile(e, activeLayer, "up", selectedTile);
    } else if (startPos) {
      let endPos = getGridCoords(e);
      // Force a minimum shape of 1x1.
      if (startPos.x === endPos.x && startPos.y === endPos.y) {
        endPos = { x: startPos.x + 1, y: startPos.y + 1 };
      }
      if (activeLayer === "base") {
        if (drawingTool === "rectangle") {
          const xStart = Math.min(startPos.x, endPos.x);
          const xEnd = Math.max(startPos.x, endPos.x);
          const yStart = Math.min(startPos.y, endPos.y);
          const yEnd = Math.max(startPos.y, endPos.y);
          setGridBase((prev) => {
            const newGrid = prev.map((row) => row.slice());
            for (let y = yStart; y <= yEnd; y++) {
              for (let x = xStart; x <= xEnd; x++) {
                newGrid[y][x] = selectedTile;
              }
            }
            return newGrid;
          });
        } else if (drawingTool === "circle") {
          // (circle drawing code for base)
        }
      } else if (activeLayer === "overlay") {
        if (drawingTool === "rectangle") {
          const xStart = Math.min(startPos.x, endPos.x);
          const xEnd = Math.max(startPos.x, endPos.x);
          const yStart = Math.min(startPos.y, endPos.y);
          const yEnd = Math.max(startPos.y, endPos.y);
          setGridOverlay((prev) => {
            const newGrid = prev.map((row) => row.slice());
            for (let y = yStart; y <= yEnd; y++) {
              for (let x = xStart; x <= xEnd; x++) {
                newGrid[y][x] = selectedTile;
              }
            }
            return newGrid;
          });
        } else if (drawingTool === "circle") {
          // (Your existing circle drawing code for overlay)
        }
      }
      setStartPos(null);
      setCurrentPos(null);
    }
  };

  // Draw the grid and layers.
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base layer.
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = gridBase[y][x];
        const img = tileImages[tileType];
        if (img && img.complete) {
          ctx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        } else {
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          if (img && !img.onload) {
            img.onload = () => drawGrid();
          }
        }
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // Overlay layer using the outdoor image.
    // In MapCanvas.jsx, inside the overlay drawing loop:
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileData = gridOverlay[y][x];
        if (tileData) {
          const outdoorImg = outdoorImageRef.current;
          if (tileData.tileSelection) {
            // This is part of a multi-tile selection.
            const { tileSelection, offsetX, offsetY } = tileData;
            // Each sub-tile is 32x32.
            const subSx = tileSelection.sx + offsetX * 32;
            const subSy = tileSelection.sy + offsetY * 32;
            const subSw = 32;
            const subSh = 32;
            if (outdoorImg.complete) {
              ctx.drawImage(
                outdoorImg,
                subSx,
                subSy,
                subSw,
                subSh,
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
              );
            } else {
              outdoorImg.onload = () => drawGrid();
            }
          } else {
            // Single-tile selection.
            if (outdoorImg.complete) {
              ctx.drawImage(
                outdoorImg,
                tileData.sx,
                tileData.sy,
                tileData.sw,
                tileData.sh,
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
              );
            } else {
              outdoorImg.onload = () => drawGrid();
            }
          }
        }
      }
    }

    // Animated events.
    animatedEvents.forEach((event) => {
      const spriteData = getFrameForEvent(
        event.type,
        event.frame,
        event.direction
      );
      if (spriteData && spriteData.image.complete) {
        ctx.drawImage(
          spriteData.image,
          spriteData.sx,
          spriteData.sy,
          spriteData.sWidth,
          spriteData.sHeight,
          event.x * TILE_SIZE,
          event.y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      } else if (spriteData && !spriteData.image.onload) {
        spriteData.image.onload = () => drawGrid();
      }
    });

    // Shape preview for rectangle or circle tools.
    const drawPreview = (ctx) => {
      if (!startPos || !currentPos || drawingTool === "pencil") return;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);

      if (drawingTool === "rectangle") {
        const xStart = Math.min(startPos.x, currentPos.x);
        const xEnd = Math.max(startPos.x, currentPos.x);
        const yStart = Math.min(startPos.y, currentPos.y);
        const yEnd = Math.max(startPos.y, currentPos.y);
        ctx.strokeRect(
          xStart * TILE_SIZE,
          yStart * TILE_SIZE,
          (xEnd - xStart + 1) * TILE_SIZE,
          (yEnd - yStart + 1) * TILE_SIZE
        );
      } else if (drawingTool === "circle") {
        const centerX = (startPos.x + currentPos.x) / 2;
        const centerY = (startPos.y + currentPos.y) / 2;
        const radius =
          (Math.max(
            Math.abs(currentPos.x - startPos.x),
            Math.abs(currentPos.y - startPos.y)
          ) /
            2) *
          TILE_SIZE;
        ctx.beginPath();
        ctx.arc(
          centerX * TILE_SIZE,
          centerY * TILE_SIZE,
          radius,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
      ctx.restore();
    };

    drawPreview(ctx);
  };

  useEffect(() => {
    drawGrid();
  }, [gridBase, gridOverlay, animatedEvents, startPos, currentPos]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_WIDTH * TILE_SIZE}
      height={GRID_HEIGHT * TILE_SIZE}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ border: "1px solid #000" }}
    />
  );
};

export default MapCanvas;
