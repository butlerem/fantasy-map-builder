import React, { useRef, useEffect } from "react";
import tileImages from "../assets/tileImages";
import getIdleFrameForEvent from "../assets/eventSprites";

const TILE_SIZE = 32;
const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;

const MapCanvas = ({
  gridBase,
  gridOverlay,
  gridEvents,
  onTileUpdate,
  activeLayer,
}) => {
  const canvasRef = useRef(null);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Draw Base Layer ---
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = gridBase[y][x];
        const img = tileImages[tileType];
        if (img && img.complete) {
          // Draw the image if it has fully loaded
          ctx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        } else {
          // Fallback: fill the tile area with white if the image isn't ready
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          // Attach an onload handler to re-draw when the image loads
          if (img && !img.onload) {
            img.onload = () => {
              drawGrid();
            };
          }
        }
        // Draw a border around each tile for clarity
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
            // Draw the overlay image if it has loaded
            ctx.drawImage(
              img,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
          } else if (img && !img.onload) {
            // Attach onload handler if the overlay image is not yet loaded
            img.onload = () => {
              drawGrid();
            };
          }
        }
      }
    }

    // --- Draw Events Layer ---
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const eventType = gridEvents[y][x];
        if (eventType) {
          // Get the idle frame data for the given event type
          const spriteData = getIdleFrameForEvent(eventType);
          if (spriteData && spriteData.image.complete) {
            ctx.drawImage(
              spriteData.image,
              spriteData.sx, // source x in the sprite sheet
              spriteData.sy, // source y in the sprite sheet
              spriteData.sWidth, // source width (FRAME_WIDTH)
              spriteData.sHeight, // source height (FRAME_HEIGHT)
              x * TILE_SIZE, // destination x on the canvas
              y * TILE_SIZE, // destination y on the canvas
              TILE_SIZE, // destination width (adjust as needed)
              TILE_SIZE // destination height (adjust as needed)
            );
          } else if (spriteData && !spriteData.image.onload) {
            spriteData.image.onload = () => drawGrid();
          }
        }
      }
    }
  };

  // Re-draw the grid whenever the base or overlay grid state changes.
  // Also, ensure that if any image hasn't loaded yet, attach an onload callback.
  useEffect(() => {
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
  }, [gridBase, gridOverlay, gridEvents]);

  // Handle mouse events for drawing on the canvas
  const handleMouseEvent = (e, eventType) => {
    // For "move" events, only proceed if the left mouse button is pressed (e.buttons === 1)
    if (eventType === "move" && e.buttons !== 1) return;
    // Call the parent handler for tile updates with the event and current active layer
    if (typeof onTileUpdate === "function") {
      onTileUpdate(e, activeLayer, eventType);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={GRID_WIDTH * TILE_SIZE}
      height={GRID_HEIGHT * TILE_SIZE}
      // Attach mouse event listeners for drawing
      onMouseDown={(e) => handleMouseEvent(e, "down")}
      onMouseMove={(e) => handleMouseEvent(e, "move")}
      onMouseUp={(e) => handleMouseEvent(e, "up")}
      onMouseLeave={(e) => handleMouseEvent(e, "leave")}
      style={{ border: "1px solid #000" }}
    />
  );
};

export default MapCanvas;
