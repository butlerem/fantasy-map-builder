import "./index.css";
import React, { useState } from "react";
import MapCanvas from "./components/MapCanvas";
import TilePaletteMenu from "./components/TilePaletteMenu";
import Toolbar from "./components/Toolbar";

function App() {
  const [activeLayer, setActiveLayer] = useState("base");
  const [drawingTool, setDrawingTool] = useState("pencil");

  const [selectedTiles, setSelectedTiles] = useState({
    base: "grass",
    overlay: null,
    events: "boy",
  });

  return (
    <div className="game-screen">
      <h1 className="game-title">Map Builder</h1>
      <div className="main-content">
        {/* Canvas section */}
        <div className="canvas-container">
          <MapCanvas
            activeLayer={activeLayer}
            selectedTile={selectedTiles[activeLayer]}
            drawingTool={drawingTool}
          />
        </div>
      </div>

      {/* Palette and Toolbar Wrapper */}
      <div className="menu-wrapper">
        <div className="tile-palette-container">
          <TilePaletteMenu
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            selectedTiles={selectedTiles}
            setSelectedTiles={setSelectedTiles}
            onToolSelect={setDrawingTool}
            drawingTool={drawingTool}
          />
        </div>
        <div className="toolbar-container">
          <Toolbar />
        </div>
      </div>
    </div>
  );
}

export default App;
