import React, { useRef, useEffect, useContext } from "react";
import { MapContext } from "../context/MapContext";
import tileImages from "../assets/tileImages";
import getFrameForEvent from "../assets/eventSprites";
import { TILE_SIZE } from "../context/MapProvider";
import { objects as objectDefinitions } from "../assets/mapObjects";

// Define the grid dimensions
const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;

// MapCanvas renders the map canvas, draws layers using the state from MapContext,
// Handles mouse events to update tiles based on user interactions.
const MapCanvas = ({ activeLayer, selectedTile }) => {
  const canvasRef = useRef(null);

  // Destructure grid data and the update function from the MapContext
  const { gridBase, gridOverlay, placedObjects, animatedEvents, updateTile } =
    useContext(MapContext);

  // Function to draw the entire grid including base, overlay, and animated events.
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Clear the canvas before drawing
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
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          if (img && !img.onload) {
            img.onload = () => drawGrid();
          }
        }
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // --- Draw 1x1 Overlay Layer ---
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = gridOverlay[y][x];
        if (tileType) {
          // Skip multi-tile objects (they're drawn from placedObjects)
          if (!objectDefinitions[tileType]) {
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
    }

    // --- Draw Placed Multi-Tile Objects ---
    placedObjects.forEach((obj) => {
      const { type, x, y } = obj;
      const def = objectDefinitions[type];
      const img = tileImages[type];
      if (def && img && img.complete) {
        ctx.drawImage(
          img,
          x * TILE_SIZE,
          y * TILE_SIZE,
          def.gridWidth * TILE_SIZE,
          def.gridHeight * TILE_SIZE
        );
      }
    });

    // --- Draw Animated Events ---
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
  };

  // Redraw the grid whenever the grid layers or animated events change.
  useEffect(() => {
    drawGrid();
  }, [gridBase, gridOverlay, placedObjects, animatedEvents]);

  const handleMouseEvent = (e, eventType) => {
    if (eventType === "move" && e.buttons !== 1) return;
    if (typeof updateTile === "function") {
      updateTile(e, activeLayer, eventType, selectedTile);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={GRID_WIDTH * TILE_SIZE}
      height={GRID_HEIGHT * TILE_SIZE}
      onMouseDown={(e) => handleMouseEvent(e, "down")}
      onMouseMove={(e) => handleMouseEvent(e, "move")}
      onMouseUp={(e) => handleMouseEvent(e, "up")}
      onMouseLeave={(e) => handleMouseEvent(e, "leave")}
      style={{ border: "1px solid #000" }}
    />
  );
};

export default MapCanvas;
