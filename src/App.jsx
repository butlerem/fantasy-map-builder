// src/App.jsx
import React, { useState } from "react";
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

  // --- Events Layer State ---
  const [gridEvents, setGridEvents] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => null)
    )
  );

  // Track which layer is active
  const [activeLayer, setActiveLayer] = useState("base");

  // Selected tiles for each layer
  const [selectedTileBase, setSelectedTileBase] = useState("grass");
  const [selectedTileOverlay, setSelectedTileOverlay] = useState("flower");
  // NEW: Selected event type
  const [selectedTileEvents, setSelectedTileEvents] = useState("boy");

  // Handle placing tiles/events on the grid
  const handleTileUpdate = (e, layer, eventType) => {
    // Only paint on mouse down or move
    if (eventType !== "down" && eventType !== "move") return;

    const rect = e.target.getBoundingClientRect();
    const TILE_SIZE = 32;
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
      // Place an event ID (e.g. "boy", "girl") in the grid
      setGridEvents((prev) => {
        const newGrid = prev.map((row) => row.slice());
        newGrid[y][x] = selectedTileEvents; // store the event type
        return newGrid;
      });
    }
  };

  // Clear the base & overlay layers (you can decide if you want to clear events too)
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
    /* Clear events - to replace with delete event
    setGridEvents(
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => null)
      )
    ); */
  };

  // Save all layers to localStorage
  const handleSave = () => {
    const mapData = { gridBase, gridOverlay, gridEvents };
    saveMap(mapData);
  };

  // Load all layers from localStorage
  const handleLoad = () => {
    const savedMap = loadMap();
    if (savedMap) {
      setGridBase(savedMap.gridBase);
      setGridOverlay(savedMap.gridOverlay);
      setGridEvents(savedMap.gridEvents);
    }
  };

  return (
    <div>
      <Toolbar
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        onClear={clearCanvas}
        onSave={handleSave}
        onLoad={handleLoad}
      />

      <div style={{ display: "flex" }}>
        <MapCanvas
          gridBase={gridBase}
          gridOverlay={gridOverlay}
          gridEvents={gridEvents}
          onTileUpdate={handleTileUpdate}
          activeLayer={activeLayer}
        />

        <div style={{ marginLeft: 20 }}>
          {/* Show different palettes based on the active layer */}
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
              tiles={["flower", "bush", "rock", null /* eraser */]}
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
