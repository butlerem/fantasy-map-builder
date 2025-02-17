import React, { useState, useEffect } from "react";
import { MapContext } from "./MapContext";
import { saveMap, loadMap } from "../utils/storage";
// Import atlas-based objects from autoExteriorObjects.
import objects from "../assets/autoExteriorObjects";

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
  const [placedObjects, setPlacedObjects] = useState([]);
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
      if (selectedTile === null) {
        setPlacedObjects((prev) =>
          prev.filter((obj) => {
            const def = objects[obj.type];
            if (!def) return true;
            const withinX = x >= obj.x && x < obj.x + def.gridWidth;
            const withinY = y >= obj.y && y < obj.y + def.gridHeight;
            return !(withinX && withinY);
          })
        );
        setGridOverlay((prev) => {
          const newGrid = prev.map((row) => row.slice());
          newGrid[y][x] = null;
          return newGrid;
        });
      } else {
        if (objects[selectedTile]) {
          setPlacedObjects((prev) => [
            ...prev,
            { id: Date.now(), type: selectedTile, x, y },
          ]);
        } else {
          setGridOverlay((prev) => {
            const newGrid = prev.map((row) => row.slice());
            newGrid[y][x] = selectedTile;
            return newGrid;
          });
        }
      }
    } else if (layer === "events") {
      if (selectedTile === null) {
        setAnimatedEvents((prev) =>
          prev.filter((ev) => !(ev.x === x && ev.y === y))
        );
      } else {
        setAnimatedEvents((prev) => {
          if (prev.some((ev) => ev.x === x && ev.y === y)) return prev;
          return [
            ...prev,
            { id: Date.now(), type: selectedTile, x, y, frame: 1 },
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
    setPlacedObjects([]);
    setAnimatedEvents([]);
  };

  // Save and load map handlers.
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

  // Animation loop for events.
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

  // Provide all state and handler functions via context.
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
