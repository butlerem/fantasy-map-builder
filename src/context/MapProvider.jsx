import React, { useState, useEffect, useRef } from "react";
import { MapContext } from "./MapContext";
import { saveMap, loadMap } from "../utils/storage";
import { sampleMaps } from "../data/sampleMaps";
import { BASE_TILE_SECTIONS } from "../assets/tileImages";

const TILE_SIZE = 40;
const WATER_TILES = new Set(["water", "water2", "water3", "water4"]);

export default function MapProvider({ children }) {
  // Grid configuration and defaults
  const GRID_HEIGHT = 24;
  const GRID_WIDTH = 28;
  const DEFAULT_TILE = { type: "grass" };

  const DEFAULT_OVERLAY_TILE = null;

  // Ref to track blocked cells (by overlay objects or water)
  const blockedTilesRef = useRef(new Set());
  const BLOCKED_TILES = blockedTilesRef.current;

  // State for base grid, overlay, animated events, and live mode toggle
  const [gridBase, setGridBase] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => ({ ...DEFAULT_TILE }))
    )
  );
  const [gridOverlay, setGridOverlay] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_OVERLAY_TILE)
    )
  );
  const [animatedEvents, setAnimatedEvents] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Update tile based on user interaction
  const updateTile = (e, layer, eventType, selectedTile) => {
    if (eventType !== "down" && eventType !== "move") return;
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

    if (layer === "base") {
      // Ensure selectedTile is properly formatted
      let wrapped;
      if (typeof selectedTile === "string") {
        wrapped = { type: selectedTile };
      } else if (typeof selectedTile === "number") {
        // Convert numeric tile index to proper type
        const tileTypes = ["water", "sand", "grass", "road", "stone"];
        const typeIndex = Math.floor(selectedTile / 12); // 12 tiles per section
        wrapped = { type: tileTypes[typeIndex] };
      } else {
        wrapped = selectedTile;
      }

      console.log("Placing base tile:", wrapped, "at", x, y);

      setGridBase((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = wrapped;
        return newGrid;
      });
    } else if (layer === "overlay") {
      if (selectedTile !== null) {
        // Handle multi-tile selection
        if (selectedTile.sw > 32 || selectedTile.sh > 32) {
          const cols = selectedTile.sw / 32;
          const rows = selectedTile.sh / 32;
          setGridOverlay((prev) => {
            const newGrid = prev.map((row) => row.slice());
            for (let j = 0; j < rows; j++) {
              for (let i = 0; i < cols; i++) {
                if (y + j < GRID_HEIGHT && x + i < GRID_WIDTH) {
                  newGrid[y + j][x + i] = {
                    tileSelection: selectedTile,
                    offsetX: i,
                    offsetY: j,
                  };
                  BLOCKED_TILES.add(`${x + i},${y + j}`);
                }
              }
            }
            return newGrid;
          });
        } else {
          // Single-tile selection
          setGridOverlay((prev) => {
            const newGrid = prev.map((row) => row.slice());
            newGrid[y][x] = selectedTile;
            return newGrid;
          });
          BLOCKED_TILES.add(`${x},${y}`);
        }
      } else {
        // Erase overlay tile
        setGridOverlay((prev) => {
          const newGrid = prev.map((row) => row.slice());
          newGrid[y][x] = null;
          return newGrid;
        });
        BLOCKED_TILES.delete(`${x},${y}`);
      }
    } else if (layer === "events") {
      if (selectedTile === null) {
        setAnimatedEvents((prev) =>
          prev.filter((ev) => ev.x !== x || ev.y !== y)
        );
      } else {
        setAnimatedEvents((prev) => {
          if (prev.some((ev) => ev.x === x && ev.y === y)) return prev;
          return [
            ...prev,
            {
              id: Date.now(),
              type: selectedTile,
              x,
              y,
              frame: 1,
              direction: "down",
              lastMoveTime: performance.now(),
            },
          ];
        });
      }
    }
  };

  // Reset all layers and blocked cells
  const clearCanvas = () => {
    setGridBase(
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => DEFAULT_TILE)
      )
    );
    setGridOverlay(
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => DEFAULT_OVERLAY_TILE)
      )
    );
    setAnimatedEvents([]);
    BLOCKED_TILES.clear();
  };

  // Save current map state
  const handleSave = () => {
    const mapData = { gridBase, gridOverlay, animatedEvents };
    saveMap(mapData);
  };

  // Load map state and reinitialize animated events
  const handleLoad = () => {
    const savedMap = loadMap();
    if (savedMap) {
      setGridBase(savedMap.gridBase);
      setGridOverlay(savedMap.gridOverlay);
      const reinitializedEvents = (savedMap.animatedEvents || []).map(
        (event) => {
          const newEvent = { ...event };
          delete newEvent.targetX;
          delete newEvent.targetY;
          return {
            ...newEvent,
            lastMoveTime: performance.now() - 1000,
            frameTime: performance.now(),
            movementProgress: 0,
          };
        }
      );
      setAnimatedEvents(reinitializedEvents);

      const newBlocked = new Set(["water", "water2", "water3"]);
      savedMap.gridOverlay.forEach((row, y) =>
        row.forEach((tile, x) => {
          if (tile !== null) {
            newBlocked.add(`${x},${y}`);
          }
        })
      );
      BLOCKED_TILES.clear();
      newBlocked.forEach((t) => BLOCKED_TILES.add(t));

      // Restart live mode to start event animations
      setIsLiveMode(false);
      setTimeout(() => setIsLiveMode(true), 0);
    }
  };

  // --- Reinitialize animated events like handleLoad ---
  const handleLoadSample = (sampleName) => {
    if (!sampleMaps[sampleName]) return;
    const { gridBase, gridOverlay, animatedEvents } = sampleMaps[sampleName];
    setGridBase(gridBase);
    setGridOverlay(gridOverlay);
    const reinitializedEvents = (animatedEvents || []).map((event) => ({
      ...event,
      lastMoveTime: performance.now() - 1000,
      frameTime: performance.now(),
      movementProgress: 0,
    }));
    setAnimatedEvents(reinitializedEvents);

    console.log("Loaded sample map:", sampleName);

    const newBlocked = new Set();
    gridOverlay.forEach((row, y) =>
      row.forEach((tile, x) => {
        if (tile !== null) {
          newBlocked.add(`${x},${y}`);
        }
      })
    );
    BLOCKED_TILES.clear();
    newBlocked.forEach((t) => BLOCKED_TILES.add(t));

    setIsLiveMode(false);
    setTimeout(() => setIsLiveMode(true), 0);
  };

  // --- Animation loop for events ---
  useEffect(() => {
    if (!isLiveMode) return;
    let animationFrameId;
    const animate = (time) => {
      if (!isLiveMode) return;
      setAnimatedEvents((prev) =>
        prev.map((event) => {
          // Four-frame walk cycle: left foot -> idle -> right foot -> idle
          const walkCycle = [0, 1, 2, 1];
          let newFrame = event.frame;
          let newX = event.x;
          let newY = event.y;
          let newDirection = event.direction;
          let moveTime = event.lastMoveTime;
          let frameTime = event.frameTime || 0;
          let movementProgress = event.movementProgress || 0;
          let isMoving = false;
          let walkIndex = event.walkIndex !== undefined ? event.walkIndex : 1;

          if (event.targetX !== undefined && event.targetY !== undefined) {
            movementProgress += 0.03;
            if (movementProgress >= 1) {
              newX = event.targetX;
              newY = event.targetY;
              movementProgress = 0;
              isMoving = false;
            } else {
              isMoving = true;
            }
          }

          // Pick a new direction if not moving
          if (!isMoving && time - moveTime > 800) {
            const directions = [
              { x: 0, y: -1, direction: "up" },
              { x: 0, y: 1, direction: "down" },
              { x: -1, y: 0, direction: "left" },
              { x: 1, y: 0, direction: "right" },
            ];
            const shuffled = directions.sort(() => Math.random() - 0.5);
            for (const { x: dx, y: dy, direction } of shuffled) {
              const potentialX = event.x + dx;
              const potentialY = event.y + dy;
              if (
                potentialX >= 0 &&
                potentialX < GRID_WIDTH &&
                potentialY >= 0 &&
                potentialY < GRID_HEIGHT &&
                !BLOCKED_TILES.has(`${potentialX},${potentialY}`) &&
                !WATER_TILES.has(gridBase[potentialY][potentialX])
              ) {
                newDirection = direction;
                moveTime = time;
                isMoving = true;
                return {
                  ...event,
                  targetX: potentialX,
                  targetY: potentialY,
                  movementProgress: 0,
                  direction: newDirection,
                  lastMoveTime: moveTime,
                  walkIndex,
                };
              }
            }
          }

          if (isMoving && time - frameTime > 350) {
            const nextIndex = (walkIndex + 1) % walkCycle.length;
            newFrame = walkCycle[nextIndex];
            walkIndex = nextIndex;
            frameTime = time;
          } else if (!isMoving) {
            newFrame = 1;
            walkIndex = 1;
          }

          newX = Math.max(0, Math.min(GRID_WIDTH - 1, newX));
          newY = Math.max(0, Math.min(GRID_HEIGHT - 1, newY));

          return {
            ...event,
            x: newX,
            y: newY,
            frame: newFrame,
            direction: newDirection,
            lastMoveTime: moveTime,
            frameTime,
            movementProgress,
            walkIndex,
          };
        })
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLiveMode, gridBase, gridOverlay]);

  return (
    <MapContext.Provider
      value={{
        gridBase,
        setGridBase,
        gridOverlay,
        setGridOverlay,
        animatedEvents,
        setAnimatedEvents,
        isLiveMode,
        setIsLiveMode,
        updateTile,
        clearCanvas,
        handleSave,
        handleLoad,
        handleLoadSample,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
