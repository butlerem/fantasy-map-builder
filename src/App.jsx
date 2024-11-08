import "./index.css";
import React, { useState } from "react";
import MapCanvas from "./components/MapCanvas";
import TilePaletteMenu from "./components/TilePaletteMenu";
import Toolbar from "./components/Toolbar";

function App() {
  const [activeLayer, setActiveLayer] = useState("base");
  const [selectedTiles, setSelectedTiles] = useState({
    base: "grass",
    overlay: "flower",
    events: "boy",
  });

  return (
    <div className="game-screen">
      <h1 className="game-title">Map Builder</h1>

      {/* Centered canvas container */}
      <div className="canvas-container">
        <MapCanvas
          activeLayer={activeLayer}
          selectedTile={selectedTiles[activeLayer]}
        />
      </div>

      <div className="toolbar-container">
        <Toolbar />
      </div>

      {/* Tile palette menu overlay on the right side */}
      <div className="tile-palette-container">
        <TilePaletteMenu
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          selectedTiles={selectedTiles}
          setSelectedTiles={setSelectedTiles}
        />
      </div>
    </div>
  );
}

export default App;
