import React, { useRef, useEffect } from "react";
import tileImages from "../assets/tileImages";
// Import the animated frame function (not getIdleFrameForEvent)
import getFrameForEvent from "../assets/eventSprites";

const TILE_SIZE = 48;
const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;

const MapCanvas = ({
  gridBase,
  gridOverlay,
  animatedEvents, // Ensure you pass animatedEvents from App.jsx
  onTileUpdate,
  activeLayer,
}) => {
  const canvasRef = useRef(null);

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
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          if (img && !img.onload) {
            img.onload = () => drawGrid();
          }
        }
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
            img.onload = () => drawGrid();
          }
        }
      }
    }

    // --- Draw Animated Events ---
    animatedEvents.forEach((event) => {
      const spriteData = getFrameForEvent(event.type, event.frame);
      if (spriteData && spriteData.image.complete) {
        ctx.drawImage(
          spriteData.image,
          spriteData.sx, // source x in the sprite sheet
          spriteData.sy, // source y in the sprite sheet
          spriteData.sWidth, // source width
          spriteData.sHeight, // source height
          event.x * TILE_SIZE, // destination x on the canvas
          event.y * TILE_SIZE, // destination y on the canvas
          TILE_SIZE, // destination width
          TILE_SIZE // destination height
        );
      } else if (spriteData && !spriteData.image.onload) {
        spriteData.image.onload = () => drawGrid();
      }
    });
  };

  useEffect(() => {
    drawGrid();
  }, [gridBase, gridOverlay, animatedEvents]);

  const handleMouseEvent = (e, eventType) => {
    if (eventType === "move" && e.buttons !== 1) return;
    if (typeof onTileUpdate === "function") {
      onTileUpdate(e, activeLayer, eventType);
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
