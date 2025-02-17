import React, { useRef, useEffect, useContext } from "react";
import { MapContext } from "../context/MapContext";
import tileImages from "../assets/tileImages";
import getFrameForEvent from "../assets/eventSprites";
import objects from "../assets/autoExteriorObjects"; // Adjust the path if needed

// Define the grid dimensions
const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;
const TILE_SIZE = 46;

const MapCanvas = ({ activeLayer, selectedTile }) => {
  const canvasRef = useRef(null);

  // Destructure grid data and update functions from the MapContext
  const { gridBase, gridOverlay, placedObjects, animatedEvents, updateTile } =
    useContext(MapContext);

  // Function to draw the entire grid including base, overlay, objects, and animated events.
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
    // (Assuming overlay tiles are still drawn from tileImages)
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

    // --- Draw Placed Multi-Tile Objects Using the Atlas ---
    // Here we use the new atlas objects from autoExteriorObjects.
    placedObjects.forEach((obj) => {
      const def = objects[obj.type];
      if (def) {
        const frame = def.getFrame();
        // Calculate how many cells the object occupies based on its natural size.
        const gridSpanWidth = def.gridWidth * TILE_SIZE;
        const gridSpanHeight = def.gridHeight * TILE_SIZE;

        // Instead of scaling the image to fill the grid span,
        // draw it at its natural size (frame.w x frame.h)
        // and compute offsets to center it in the grid area.
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
