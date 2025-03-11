// src/App.jsx
import React, { useState, useEffect } from "react";
import MapCanvas from "./components/MapCanvas";
import TilePalette from "./components/TilePalette";
import Toolbar from "./components/Toolbar";
import { saveMap, loadMap } from "./utils/storage";

const GRID_HEIGHT = 16;
const GRID_WIDTH = 18;
const DEFAULT_TILE = "grass";
const DEFAULT_OVERLAY_TILE = null;

function App() {
  // --- Base Layer State ---
  const [gridBase, setGridBase] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_TILE)
    )
  );

  // --- Overlay Layer State ---
  const [gridOverlay, setGridOverlay] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_OVERLAY_TILE)
    )
  );

  // Instead of gridEvents (a 2D array), we now have an array of animated events.
  // Each event object has a type, grid position, and a frame index.
  const [animatedEvents, setAnimatedEvents] = useState([
    { id: 1, type: "boy", x: 5, y: 10, frame: 1 },
    { id: 2, type: "girl", x: 8, y: 12, frame: 1 },
    // Add more events as needed.
  ]);

  // Layer selection and palette state.
  const [activeLayer, setActiveLayer] = useState("base");
  const [selectedTileBase, setSelectedTileBase] = useState("grass");
  const [selectedTileOverlay, setSelectedTileOverlay] = useState("flower");
  const [selectedTileEvents, setSelectedTileEvents] = useState("boy");

  // Handler for updating a tile in the base or overlay layers.
  const handleTileUpdate = (e, layer, eventType) => {
    if (eventType !== "down" && eventType !== "move") return;
    const rect = e.target.getBoundingClientRect();
    const TILE_SIZE = 48; // Note: TILE_SIZE should match your cell size (48 in this case)
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (layer === "base") {
      setGridBase((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = selectedTileBase;
        return newGrid;
      });
    } else if (layer === "overlay") {
      setGridOverlay((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = selectedTileOverlay;
        return newGrid;
      });
    } else if (layer === "events") {
      setAnimatedEvents((prev) => [
        ...prev,
        { id: Date.now(), type: selectedTileEvents, x, y, frame: 1 },
      ]);
    }
  };

  // Clear all layers.
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
    setAnimatedEvents([]); // or reset to a default set if desired.
  };

  // Save/load can be expanded to include animatedEvents if needed.
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

  // Track if game is in edit mode or live mode
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Animation loop for events: update each event's frame periodically.
  useEffect(() => {
    if (!isLiveMode) return;

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (time) => {
      // Update every 250ms (adjust for desired animation speed)
      if (time - lastTime > 250) {
        lastTime = time;
        setAnimatedEvents((prevEvents) =>
          prevEvents.map((event) => ({
            ...event,
            frame: (event.frame + 1) % 3, // Cycle through 0, 1, 2 (assuming 3 frames per event)
          }))
        );
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLiveMode]); // run animation when isLiveMode changes

  return (
    <div>
      <Toolbar
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        onClear={clearCanvas}
        onSave={handleSave}
        onLoad={handleLoad}
        isLiveMode={isLiveMode}
        setIsLiveMode={setIsLiveMode}
      />
      <div style={{ display: "flex" }}>
        <MapCanvas
          gridBase={gridBase}
          gridOverlay={gridOverlay}
          animatedEvents={animatedEvents}
          onTileUpdate={handleTileUpdate}
          activeLayer={activeLayer}
        />
        <div style={{ marginLeft: 20 }}>
          {activeLayer === "base" && (
            <TilePalette
              title="Base Layer Palette"
              tiles={["grass", "water", "road"]}
              selectedTile={selectedTileBase}
              onSelect={setSelectedTileBase}
            />
          )}
          {activeLayer === "overlay" && (
            <TilePalette
              title="Overlay Layer Palette"
              tiles={["flower", "bush", "rock", null]}
              selectedTile={selectedTileOverlay}
              onSelect={setSelectedTileOverlay}
            />
          )}
          {activeLayer === "events" && (
            <TilePalette
              title="Events Layer Palette"
              tiles={["boy", "girl", "man", "woman"]}
              selectedTile={selectedTileEvents}
              onSelect={setSelectedTileEvents}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
