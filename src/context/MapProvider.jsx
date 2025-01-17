import React, { useState, useEffect } from "react";
import { MapContext } from "./MapContext";
import { saveMap, loadMap } from "../utils/storage";
import { objects as objectDefinitions } from "../assets/mapObjects";

export const TILE_SIZE = 34;

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
  const [placedObjects, setPlacedObjects] = useState([]);
  const [animatedEvents, setAnimatedEvents] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Update a tile based on mouse event
  const updateTile = (e, layer, eventType, selectedTile) => {
    if (eventType !== "down" && eventType !== "move") return;

    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (layer === "base") {
      // --- Base Layer ---
      setGridBase((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = selectedTile;
        return newGrid;
      });
    } else if (layer === "overlay") {
      // --- Overlay Layer ---
      if (selectedTile === null) {
        // Eraser: remove multi-tile objects covering (x, y)
        setPlacedObjects((prev) =>
          prev.filter((obj) => {
            const def = objectDefinitions[obj.type];
            if (!def) return true;
            const withinX = x >= obj.x && x < obj.x + def.gridWidth;
            const withinY = y >= obj.y && y < obj.y + def.gridHeight;
            return !(withinX && withinY);
          })
        );
        // Clear any 1x1 overlay tile at (x, y)
        setGridOverlay((prev) => {
          const newGrid = prev.map((row) => row.slice());
          newGrid[y][x] = null;
          return newGrid;
        });
      } else {
        // Place multi-tile or single-tile overlay
        if (objectDefinitions[selectedTile]) {
          // Multi-tile
          setPlacedObjects((prev) => [
            ...prev,
            { id: Date.now(), type: selectedTile, x, y },
          ]);
        } else {
          // Single-tile
          setGridOverlay((prev) => {
            const newGrid = prev.map((row) => row.slice());
            newGrid[y][x] = selectedTile;
            return newGrid;
          });
        }
      }
    } else if (layer === "events") {
      // --- Events Layer ---
      if (selectedTile === null) {
        // Eraser: remove event at (x, y)
        setAnimatedEvents((prev) =>
          prev.filter((ev) => !(ev.x === x && ev.y === y))
        );
      } else {
        // Place event if cell is free
        setAnimatedEvents((prev) => {
          if (prev.some((ev) => ev.x === x && ev.y === y)) {
            return prev; // already occupied
          }
          return [
            ...prev,
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
    setPlacedObjects([]);
    setAnimatedEvents([]);
  };

  // Save/load handlers
  const handleSave = () => {
    const mapData = { gridBase, gridOverlay, placedObjects, animatedEvents };
    saveMap(mapData);
  };
  const handleLoad = () => {
    const savedMap = loadMap();
    if (savedMap) {
      setGridBase(savedMap.gridBase);
      setGridOverlay(savedMap.gridOverlay);
      setPlacedObjects(savedMap.placedObjects || []);
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
        setAnimatedEvents((prev) =>
          prev.map((event) => ({
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

  // Provide all states and functions via context
  const value = {
    gridBase,
    gridOverlay,
    placedObjects,
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
