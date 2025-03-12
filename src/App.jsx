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
    <div>
      <Toolbar />
      <div className="game-container">
        <div className="game-screen">
          <h1 className="game-title">Fantasy Map Builder</h1>
          <div className="game-content">
            {/* Pass the currently selected tile to MapCanvas */}
            <MapCanvas
              activeLayer={activeLayer}
              selectedTile={selectedTiles[activeLayer]}
            />
            <TilePaletteMenu
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
              selectedTiles={selectedTiles}
              setSelectedTiles={setSelectedTiles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
