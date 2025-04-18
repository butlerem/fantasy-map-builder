// App.js
import React, { useState } from "react";
import MapCanvas from "./components/MapCanvas";
import TilePaletteMenu from "./components/TilePaletteMenu";
import Toolbar from "./components/Toolbar";
import WelcomeOverlay from "./components/WelcomeOverlay"; // adjust path

function App() {
  const [activeLayer, setActiveLayer] = useState("base");
  const [drawingTool, setDrawingTool] = useState("pencil");
  const [showWelcome, setShowWelcome] = useState(true);

  const [selectedTiles, setSelectedTiles] = useState({
    base: "grass",
    overlay: null,
    events: "boy",
  });

  const handleDismissWelcome = () => setShowWelcome(false);

  return (
    <div className="game-screen">
      {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}

      <div className="navbar">
        <Toolbar />
      </div>

      <div className="main-content">
        <div className="canvas-container">
          <MapCanvas
            activeLayer={activeLayer}
            selectedTile={selectedTiles[activeLayer]}
            drawingTool={drawingTool}
          />
        </div>
      </div>
      
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
      </div>
    </div>
  );
}

export default App;
