import React, { useRef, useEffect, useContext, useState } from "react";
import { MapContext } from "../context/MapContext";
import tileImages from "../assets/tileImages";
import getFrameForEvent from "../assets/eventSprites";
import objects from "../assets/autoExteriorObjects";

const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;
const TILE_SIZE = 46;

const MapCanvas = ({ activeLayer, selectedTile, drawingTool }) => {
  const canvasRef = useRef(null);
  // Access grid and update functions from MapContext
  const {
    gridBase,
    gridOverlay,
    placedObjects,
    animatedEvents,
    updateTile,
    setGridBase,
  } = useContext(MapContext);

  // Local state to record the starting grid coordinate and current mouse position for shape preview.
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);

  // Function to convert a mouse event into grid coordinates, accounting for canvas scaling.
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

  // Mouse down: draw a single tile (pencil) or record the starting position for a shape.
  const handleMouseDown = (e) => {
    if (activeLayer !== "base") {
      updateTile(e, activeLayer, "down", selectedTile);
      return;
    }
    // If fill tool is selected, fill the entire grid immediately.
    if (drawingTool === "fill") {
      setGridBase((prev) => prev.map((row) => row.map(() => selectedTile)));
      // Optionally, reset the drawing tool back to pencil after fill.
      // onToolSelect("pencil");  // if you have access to change it here, or do it in App.
      return;
    }
    // If using pencil tool, update as usual.
    if (drawingTool === "pencil") {
      updateTile(e, activeLayer, "down", selectedTile);
    } else {
      // For shape tools, record the starting grid coordinate.
      const pos = getGridCoords(e);
      setStartPos(pos);
      setCurrentPos(pos); // Initialize preview position.
    }
  };

  // Mouse move: update drawing. For shape tools, update current position for preview.
  const handleMouseMove = (e) => {
    if (e.buttons === 0) return; // Only process if a button is pressed.
    if (activeLayer !== "base") {
      updateTile(e, activeLayer, "move", selectedTile);
      return;
    }
    if (drawingTool === "pencil") {
      updateTile(e, activeLayer, "move", selectedTile);
    } else if (startPos) {
      const pos = getGridCoords(e);
      setCurrentPos(pos);
    }
  };

  // Mouse up: finalize the shape drawing and clear preview states.
  const handleMouseUp = (e) => {
    if (activeLayer !== "base") {
      updateTile(e, activeLayer, "up", selectedTile);
      return;
    }
    if (drawingTool === "pencil") {
      updateTile(e, activeLayer, "up", selectedTile);
    } else if (startPos) {
      let endPos = getGridCoords(e);

      // Force a minimum shape size if no drag occurred.
      if (startPos.x === endPos.x && startPos.y === endPos.y) {
        endPos = { x: startPos.x + 1, y: startPos.y + 1 };
      }

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
        const centerX = (startPos.x + endPos.x) / 2;
        const centerY = (startPos.y + endPos.y) / 2;
        const radius =
          Math.max(
            Math.abs(endPos.x - startPos.x),
            Math.abs(endPos.y - startPos.y)
          ) / 2;
        setGridBase((prev) => {
          const newGrid = prev.map((row) => row.slice());
          for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
              if (
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <=
                Math.pow(radius, 2)
              ) {
                newGrid[y][x] = selectedTile;
              }
            }
          }
          return newGrid;
        });
      }
      // Clear preview states.
      setStartPos(null);
      setCurrentPos(null);
    }
  };

  // Draw the entire grid including base layer, overlay, objects, events, and preview shape.
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Base Layer tiles.
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

    // Draw 1x1 Overlay Layer tiles.
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = gridOverlay[y][x];
        if (tileType) {
          const img = tileImages[tileType];
          if (img && img.complete) {
            ctx.drawImage(
              img,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
          } else if (img && !img.onload) {
            img.onload = () => drawGrid();
          }
        }
      }
    }

    // Draw placed multi-tile objects.
    placedObjects.forEach((obj) => {
      const def = objects[obj.type];
      if (def) {
        const frame = def.getFrame();
        const gridSpanWidth = def.gridWidth * TILE_SIZE;
        const gridSpanHeight = def.gridHeight * TILE_SIZE;
        const offsetX = (gridSpanWidth - frame.w) / 2;
        const offsetY = (gridSpanHeight - frame.h) / 2;
        ctx.drawImage(
          def.image,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          obj.x * TILE_SIZE + offsetX,
          obj.y * TILE_SIZE + offsetY,
          frame.w,
          frame.h
        );
      }
    });

    // Draw animated events.
    animatedEvents.forEach((event) => {
      const spriteData = getFrameForEvent(event.type, event.frame);
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

    // Draw shape preview if applicable.
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
  }, [
    gridBase,
    gridOverlay,
    placedObjects,
    animatedEvents,
    startPos,
    currentPos,
  ]);

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
