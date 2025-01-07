// ... in TilePaletteMenu.jsx
import React from "react";
import TilePalette from "./TilePalette";
import TilesetSelector from "./TilesetSelector";

const TilePaletteMenu = ({
  activeLayer,
  setActiveLayer,
  selectedTiles,
  setSelectedTiles,
  onToolSelect,
  drawingTool,
}) => {
  return (
    <div className="tile-palette">
      {/* Layer buttons remain the same */}
      <div className="layer-buttons">
        <button
          className={activeLayer === "base" ? "active" : ""}
          onClick={() => setActiveLayer("base")}
        >
          Base Layer
        </button>
        <button
          className={activeLayer === "overlay" ? "active" : ""}
          onClick={() => setActiveLayer("overlay")}
        >
          Object Layer
        </button>
        <button
          className={activeLayer === "events" ? "active" : ""}
          onClick={() => setActiveLayer("events")}
        >
          Event Layer
        </button>
      </div>

      {/* Base and events palettes remain unchanged */}
      {activeLayer === "base" && (
        <TilePalette
          title="Base"
          tiles={[
            "water3",
            "water2",
            "water",
            "grass",
            "grass2",
            "grass3",

            "road2",
            "road",

            "sand",
            "tile",
            "stone2",
            "tile2",
            "brick2",
            "stairs",

            "three",
            "two",
            "one",
            "five",
            "four",
            "brick3",
          ]}
          selectedTile={selectedTiles.base}
          onSelect={(tile) =>
            setSelectedTiles((prev) => ({ ...prev, base: tile }))
          }
          onToolSelect={onToolSelect}
          drawingTool={drawingTool}
          layer="base"
        />
      )}

      {activeLayer === "overlay" && (
        <div className="tile-palette">
          <h3>Objects</h3>
          <TilesetSelector
            selectedTile={selectedTiles.overlay}
            onSelect={(tileData) =>
              setSelectedTiles((prev) => ({ ...prev, overlay: tileData }))
            }
          />
          <div
            className="eraser"
            onClick={() =>
              setSelectedTiles((prev) => ({ ...prev, overlay: null }))
            }
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border:
                selectedTiles.overlay === null
                  ? "3px solid white"
                  : "2px solid transparent",
            }}
          >
            Eraser
          </div>
        </div>
      )}

      {activeLayer === "events" && (
        <TilePalette
          title="Events"
          tiles={[
            "boy",
            "girl",
            "boy2",
            "girl2",
            "man",
            "woman",
            "man2",
            "woman2",
            "animal1",
            "animal2",
            "animal7",
            "animal3",
            "animal4",
            "animal5",
            "animal6",
          ]}
          selectedTile={selectedTiles.events}
          onSelect={(tile) =>
            setSelectedTiles((prev) => ({ ...prev, events: tile }))
          }
          layer="events"
        />
      )}
    </div>
  );
};

export default TilePaletteMenu;
