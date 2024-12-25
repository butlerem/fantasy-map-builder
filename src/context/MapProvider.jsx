import React, { useState, useEffect } from "react";
import { MapContext } from "./MapContext";
import { saveMap, loadMap } from "../utils/storage";

const TILE_SIZE = 46;

export default function MapProvider({ children }) {
  const GRID_HEIGHT = 16;
  const GRID_WIDTH = 18;
  const DEFAULT_TILE = "grass";
  const DEFAULT_OVERLAY_TILE = null;

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
      setGridOverlay((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = selectedTile;
        return newGrid;
      });
    } else if (layer === "events") {
      if (selectedTile === null) {
        // Remove event if eraser is selected
        setAnimatedEvents((prev) =>
          prev.filter((ev) => ev.x !== x || ev.y !== y)
        );
      } else {
        setAnimatedEvents((prev) => {
          // Prevent placing multiple events on the same tile
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
          let newFrame = event.frame;
          let newX = event.x;
          let newY = event.y;
          let newDirection = event.direction;
          let moveTime = event.lastMoveTime;
          let frameTime = event.frameTime || 0;

          // Change frame every 250ms (for smooth walking)
          if (time - frameTime > 250) {
            newFrame = (event.frame + 1) % 3; // Cycle 3 walking frames naturally
            frameTime = time; // Update the last frame update time
          }

          // Movement: Only update every 800ms
          if (time - event.lastMoveTime > 800) {
            const randomMove = Math.random();
            if (randomMove < 0.25) {
              newY -= 1; // Move Up
              newDirection = "up";
            } else if (randomMove < 0.5) {
              newY += 1; // Move Down
              newDirection = "down";
            } else if (randomMove < 0.75) {
              newX -= 1; // Move Left
              newDirection = "left";
            } else {
              newX += 1; // Move Right
              newDirection = "right";
            }
            moveTime = time;
          }

          // Ensure NPCs stay inside the map grid
          newX = Math.max(0, Math.min(GRID_WIDTH - 1, newX));
          newY = Math.max(0, Math.min(GRID_HEIGHT - 1, newY));

          return {
            ...event,
            x: newX,
            y: newY,
            frame: newFrame, // Walking animation cycles
            direction: newDirection,
            lastMoveTime: moveTime,
            frameTime: frameTime, // Store last frame update time
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLiveMode]); // Fix: Depend on isLiveMode

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
