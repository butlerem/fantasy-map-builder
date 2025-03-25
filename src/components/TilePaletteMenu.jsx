import React from "react";
import TilePalette from "./TilePalette";
import TilesetSelector from "./TilesetSelector";
import { FaEraser } from "react-icons/fa";

/**
 * TilePaletteMenu component manages the layer selection and tile palettes for the map editor
 */
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
      {/* Layer selection buttons */}
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

      {/* Layer-specific palettes */}
      {activeLayer === "base" && (
        <TilePalette
          tiles={[
            "water4", "water3", "water2", "water",
            "grass", "grass2", "grass3",
            "road2", "road",
            "sand", "sand2",
            "stone2", "tile2", "brick2", "four", "brick3", "tile",
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
        <div className="tile-palette object-layer">
          <TilesetSelector
            selectedTile={selectedTiles.overlay}
            onSelect={(tileData) =>
              setSelectedTiles((prev) => ({ ...prev, overlay: tileData }))
            }
          />
          <button
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
                  ? "1px solid white"
                  : "1px solid transparent",
            }}
          >
            <FaEraser size={15} color="var(--white)" />
          </button>
        </div>
      )}

      {activeLayer === "events" && (
        <TilePalette
          tiles={[
            "boy", "girl", "boy2", "girl2",
            "boy3", "girl3", "boy4", "girl4",
            "animal1", "animal2", "animal3", "animal4",
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
