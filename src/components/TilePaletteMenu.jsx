import React from "react";
import TilePalette from "./TilePalette";
import TilesetSelector from "./TilesetSelector";
import { FaEraser } from "react-icons/fa";

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
      {/* Layer buttons */}
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

      {/* Base and events palettes */}
      {activeLayer === "base" && (
        <TilePalette
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

            "stone2",
            "tile2",
            "brick2",
            "four",
            "brick3",
            "tile",
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
