import React, { useState, useEffect, useRef } from "react";
import { MapContext } from "./MapContext";
import { saveMap, loadMap } from "../utils/storage";

const TILE_SIZE = 46;

export default function MapProvider({ children }) {
  const GRID_HEIGHT = 16;
  const GRID_WIDTH = 18;
  const DEFAULT_TILE = "grass";
  const DEFAULT_OVERLAY_TILE = null;

  // Use a ref for BLOCKED_TILES so it persists across renders.
  const blockedTilesRef = useRef(new Set(["water", "water2", "water3"]));
  const BLOCKED_TILES = blockedTilesRef.current;

  // Map layers state
  const [gridBase, setGridBase] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_TILE)
    )
  );

  const [gridOverlay, setGridOverlay] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_OVERLAY_TILE)
    )
  );

  const [animatedEvents, setAnimatedEvents] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Update a tile based on a mouse event.
  const updateTile = (e, layer, eventType, selectedTile) => {
    if (eventType !== "down" && eventType !== "move") return;

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

    if (layer === "base") {
      setGridBase((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = selectedTile;
        return newGrid;
      });
    } else if (layer === "overlay") {
      if (selectedTile !== null) {
        // Check if multi-tile selection (assumes each base cell is 32x32 in source)
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
        // Eraser: remove object from this cell
        setGridOverlay((prev) => {
          const newGrid = prev.map((row) => row.slice());
          newGrid[y][x] = null;
          return newGrid;
        });
        BLOCKED_TILES.delete(`${x},${y}`);
      }
    } else if (layer === "events") {
      if (selectedTile === null) {
        // Eraser for events: remove event if present
        setAnimatedEvents((prev) =>
          prev.filter((ev) => ev.x !== x || ev.y !== y)
        );
      } else {
        // Place event if one is not already present at this cell
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

  // Clear all canvas layers.
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
  };

  // Save and load map handlers.
  const handleSave = () => {
    const mapData = { gridBase, gridOverlay, animatedEvents };
    saveMap(mapData);
  };
  const handleLoad = () => {
    const savedMap = loadMap();
    if (savedMap) {
      setGridBase(savedMap.gridBase);
      setGridOverlay(savedMap.gridOverlay);
      setAnimatedEvents(savedMap.animatedEvents || []);

      // Rebuild BLOCKED_TILES from saved overlay objects
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
    }
  };

  // Animation loop for events.
  useEffect(() => {
    if (!isLiveMode) return; // Stops animation when Live Mode is off

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

          // If walkIndex is undefined, default to 1 (idle center frame)
          let walkIndex = event.walkIndex !== undefined ? event.walkIndex : 1;

          // Gradual movement transition
          if (event.targetX !== undefined && event.targetY !== undefined) {
            // Slow down movement
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

          // Only pick a new direction if not already moving
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
                !BLOCKED_TILES.has(gridBase[potentialY]?.[potentialX])
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
                  walkIndex, // keep walkIndex
                };
              }
            }
          }

          // Slow the walk frame update from 200ms to 350ms
          if (isMoving && time - frameTime > 350) {
            // Step to next index in the [0,1,2,1] cycle
            const nextIndex = (walkIndex + 1) % walkCycle.length;
            newFrame = walkCycle[nextIndex];
            walkIndex = nextIndex;
            frameTime = time;
          } else if (!isMoving) {
            newFrame = 1; // idle center frame
            walkIndex = 1;
          }

          // Ensure NPC stays inside the grid
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
  }, [isLiveMode]);

  return (
    <MapContext.Provider
      value={{
        gridBase,
        setGridBase,
        gridOverlay,
        animatedEvents,
        isLiveMode,
        setIsLiveMode,
        updateTile,
        clearCanvas,
        handleSave,
        handleLoad,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
