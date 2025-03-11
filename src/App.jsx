// src/App.jsx
import React, { useState } from "react";
import MapCanvas from "./components/MapCanvas";
import TilePalette from "./components/TilePalette";
import Toolbar from "./components/Toolbar";
import tileImages from "./assets/tileImages";
import { saveMap, loadMap } from "./utils/storage";

const GRID_HEIGHT = 16;
const GRID_WIDTH = 18;
const DEFAULT_TILE = "grass";
const DEFAULT_OVERLAY_TILE = null;

function App() {
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

  const [activeLayer, setActiveLayer] = useState("base");
  const [selectedTileBase, setSelectedTileBase] = useState("grass");
  const [selectedTileOverlay, setSelectedTileOverlay] = useState("flower");

  // General handler for updating a tile on the active layer
  const handleTileUpdate = (e, layer, eventType) => {
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
    }
  };

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
  };

  const handleSave = () => {
    const mapData = { gridBase, gridOverlay };
    saveMap(mapData);
  };

  const handleLoad = () => {
    const savedMap = loadMap();
    if (savedMap) {
      setGridBase(savedMap.gridBase);
      setGridOverlay(savedMap.gridOverlay);
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
          tileImages={tileImages}
          onTileUpdate={handleTileUpdate}
          activeLayer={activeLayer}
        />
        <div style={{ marginLeft: 20 }}>
          {activeLayer === "base" ? (
            <TilePalette
              title="Base Layer Palette"
              tiles={["grass", "water", "road"]}
              selectedTile={selectedTileBase}
              onSelect={setSelectedTileBase}
            />
          ) : (
            <TilePalette
              title="Overlay Layer Palette"
              tiles={["flower", "bush", "rock"]}
              selectedTile={selectedTileOverlay}
              onSelect={setSelectedTileOverlay}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
