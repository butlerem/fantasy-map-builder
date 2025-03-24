// src/components/MapCanvas.jsx
import React, { useRef, useEffect } from "react";
import tileImages from "../assets/tileImages";

const TILE_SIZE = 32;
const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;

const MapCanvas = ({ gridBase, gridOverlay, onTileUpdate, activeLayer }) => {
  const canvasRef = useRef(null);

  // Function to draw the grid and all tiles
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Draw Base Layer ---
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
          // Fallback: fill with white if image isn't loaded yet
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          // Attach onload callback to re-draw when image is ready
          if (img && !img.onload) {
            img.onload = () => {
              drawGrid();
            };
          }
        }
        // Draw grid border for clarity
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // --- Draw Overlay Layer ---
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
            img.onload = () => {
              drawGrid();
            };
          }
        }
      }
    }
  };

  // Use effect to re-draw the grid whenever grid state changes
  useEffect(() => {
    // Check that all images are loaded before drawing
    let allLoaded = true;
    Object.keys(tileImages).forEach((key) => {
      const img = tileImages[key];
      if (!img.complete) {
        allLoaded = false;
        if (!img.onload) {
          img.onload = () => {
            drawGrid();
          };
        }
      }
    });
    if (allLoaded) {
      drawGrid();
    }
  }, [gridBase, gridOverlay]);

  // Handle mouse events for drawing
  const handleMouseEvent = (e, eventType) => {
    // Only process mouse move events if the left button is held down
    if (eventType === "move" && e.buttons !== 1) return;
    // Call the parent component's tile update handler if provided
    if (typeof onTileUpdate === "function") {
      onTileUpdate(e, activeLayer, eventType);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={GRID_WIDTH * TILE_SIZE}
      height={GRID_HEIGHT * TILE_SIZE}
      // Attach mouse event handlers
      onMouseDown={(e) => handleMouseEvent(e, "down")}
      onMouseMove={(e) => handleMouseEvent(e, "move")}
      onMouseUp={(e) => handleMouseEvent(e, "up")}
      onMouseLeave={(e) => handleMouseEvent(e, "leave")}
      style={{ border: "1px solid #000" }}
    />
  );
};

export default MapCanvas;
