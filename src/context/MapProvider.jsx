import React, { useState, useEffect } from "react";
import { MapContext } from "./MapContext";
import { saveMap, loadMap } from "../utils/storage";

export default function MapProvider({ children }) {
  const GRID_HEIGHT = 16;
  const GRID_WIDTH = 18;
  const DEFAULT_TILE = "grass";
  const DEFAULT_OVERLAY_TILE = null;

  // Map layers
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

  // Mode state and animation loop for events
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Update a tile based on mouse event
  const updateTile = (e, layer, eventType, selectedTile) => {
    if (eventType !== "down" && eventType !== "move") return;
    const rect = e.target.getBoundingClientRect();
    const TILE_SIZE = 48;
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

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
        // Eraser: remove event at location
        setAnimatedEvents((prevEvents) =>
          prevEvents.filter((event) => !(event.x === x && event.y === y))
        );
      } else {
        // Add event if none exists at this location
        setAnimatedEvents((prevEvents) => {
          if (prevEvents.some((event) => event.x === x && event.y === y)) {
            return prevEvents;
          }
          return [
            ...prevEvents,
            { id: Date.now(), type: selectedTile, x, y, frame: 1 },
          ];
        });
      }
    }
  };

  // Clear the canvas layers
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

  // Save/load handlers
  const handleSave = () => {
    const mapData = { gridBase, gridOverlay, animatedEvents };
    saveMap(mapData);
  };
  const handleLoad = () => {
    const savedMap = loadMap();
    if (savedMap) {
      setGridBase(savedMap.gridBase);
      setGridOverlay(savedMap.gridOverlay);
      setAnimatedEvents(savedMap.animatedEvents);
    }
  };

  // Animation loop for events
  useEffect(() => {
    if (!isLiveMode) return;

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (time) => {
      if (time - lastTime > 250) {
        lastTime = time;
        setAnimatedEvents((prevEvents) =>
          prevEvents.map((event) => ({
            ...event,
            frame: (event.frame + 1) % 3,
          }))
        );
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLiveMode]);

  // All state and functions provided via context
  const value = {
    gridBase,
    gridOverlay,
    animatedEvents,
    isLiveMode,
    setIsLiveMode,
    updateTile,
    clearCanvas,
    handleSave,
    handleLoad,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
