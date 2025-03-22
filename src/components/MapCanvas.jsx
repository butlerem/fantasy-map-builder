import React, { useRef, useEffect, useContext, useState } from "react";
import { MapContext } from "../context/MapContext";
import { SeasonsContext } from "../context/SeasonProvider";
import tileImages from "../assets/tileImages";
import getFrameForEvent from "../assets/eventSprites";
import outdoorTileset from "../assets/maps/outdoor.png";
import { drawSnowEffect, drawLightStreamEffect } from "../utils/seasons";

const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;
const TILE_SIZE = 40; // on-canvas display size

// Applies a tint based on the current season.
const applySeasonTint = (ctx, season) => {
  let tintColor = "rgba(255,255,255,0)";
  switch (season) {
    case "winter":
      tintColor = "rgba(136, 113, 251, 0.16)";
      break;
    case "summer":
      tintColor = "rgba(255, 132, 16, 0.17)";
      break;
    case "spring":
    default:
      tintColor = "rgba(149, 255, 0, 0.1)";
      break;
  }
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = tintColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "source-over"; // reset to default
};

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
  const { season } = useContext(SeasonsContext);

  // State for seasonal effect: snow particles for winter.
  const [snowParticles, setSnowParticles] = useState([]);

  // Create an Image instance for the outdoor tileset.
  const outdoorImageRef = useRef(null);
  if (!outdoorImageRef.current) {
    const img = new Image();
    img.src = outdoorTileset;
    outdoorImageRef.current = img;
  }

  // Load the beams image for summer.
  const beamsImageRef = useRef(null);
  useEffect(() => {
    const img = new Image();
    // Update the path to match your assets folder.
    img.src = "/assets/events/light1.png";
    img.onload = () => {
      beamsImageRef.current = img;
      // Force a redraw now that the beams image is loaded.
      drawGrid();
    };
  }, []);

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
    if (activeLayer === "events") {
      updateTile(e, activeLayer, "down", selectedTile);
      return;
    }
    if (selectedTile === null) {
      updateTile(e, activeLayer, "down", selectedTile);
      return;
    }
    if (activeLayer === "base" && drawingTool === "fill") {
      setGridBase((prev) => prev.map((row) => row.map(() => selectedTile)));
      return;
    }
    const effectiveTool =
      activeLayer === "overlay" && drawingTool === "fill"
        ? "pencil"
        : drawingTool;
    if (effectiveTool === "pencil") {
      updateTile(e, activeLayer, "down", selectedTile);
    } else {
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
    if (selectedTile === null) {
      updateTile(e, activeLayer, "move", selectedTile);
      return;
    }
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
    if (activeLayer === "base" && drawingTool === "fill") return;
    const effectiveTool =
      activeLayer === "overlay" && drawingTool === "fill"
        ? "pencil"
        : drawingTool;
    if (effectiveTool === "pencil") {
      updateTile(e, activeLayer, "up", selectedTile);
    } else if (startPos) {
      let endPos = getGridCoords(e);
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
          // (circle drawing code for overlay)
        }
      }
      setStartPos(null);
      setCurrentPos(null);
    }
  };

  // drawGrid handles drawing all layers and applying seasonal effects.
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Disable all smoothing
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base layer.
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
      }
    }

    // Draw overlay layer.
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileData = gridOverlay[y][x];
        if (tileData) {
          const outdoorImg = outdoorImageRef.current;
          if (tileData.tileSelection) {
            const { tileSelection, offsetX, offsetY } = tileData;
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

    // Draw animated events.
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

    // Draw preview for shape tools.
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
    // Apply the seasonal tint.
    applySeasonTint(ctx, season);

    // Draw seasonal effects.
    if (season === "winter") {
      drawSnowEffect(ctx, snowParticles);
    } else if (season === "summer") {
      // Draw the beams image via our summer effect.
      drawLightStreamEffect(ctx);
    }

    // Redraw grid lines on top.
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#000"; // or "#fff"
    ctx.lineWidth = 1;
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    ctx.restore();
  };

  // Initialize seasonal effects when season changes.
  useEffect(() => {
    if (season === "winter") {
      const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * (GRID_WIDTH * TILE_SIZE),
        y: Math.random() * (GRID_HEIGHT * TILE_SIZE),
        radius: 2 + Math.random() * 2,
        speed: 0.5 + Math.random(),
        opacity: 0.5 + Math.random() * 0.5,
      }));
      setSnowParticles(particles);
    }
  }, [season]);

  // Redraw the grid whenever dependencies change.
  useEffect(() => {
    drawGrid();
  }, [
    gridBase,
    gridOverlay,
    animatedEvents,
    startPos,
    currentPos,
    season,
    snowParticles,
  ]);

  // Animate seasonal effects (e.g., update snow particles).
  useEffect(() => {
    let animationFrameId;
    const updateParticles = () => {
      if (season === "winter") {
        setSnowParticles((prev) =>
          prev.map((p) => {
            let newY = p.y + p.speed;
            if (newY > GRID_HEIGHT * TILE_SIZE) newY = 0;
            return { ...p, y: newY };
          })
        );
      }
      animationFrameId = requestAnimationFrame(updateParticles);
    };
    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [season]);

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
