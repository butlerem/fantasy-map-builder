// In TilePaletteMenu.jsx
import React from "react";
import TilePalette from "./TilePalette";

const TilePaletteMenu = ({
  activeLayer, // Current active layer (base, overlay, or events)
  setActiveLayer, // Function to change the active layer
  selectedTiles, // Object containing the selected tile for each layer
  setSelectedTiles, // Function to update the selected tile for a given layer
  onToolSelect,
  drawingTool, // Rename from setDrawingTool to onToolSelect to match the prop passed from App
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

      {/* Render palette based on active layer */}
      {activeLayer === "base" && (
        <TilePalette
          title="Base"
          tiles={[
            "grass",
            "grass2",
            "grass3",
            "water",
            "water2",
            "road2",
            "road",
            "brick",
            "sand",
            "tile",
            "stone2",
            "tile2",

            "stairs",
            "brick2",

            "brick4",
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
          drawingTool={drawingTool} // Forward the drawingTool
          layer="base"
        />
      )}

      {activeLayer === "overlay" && (
        <TilePalette
          title="Objects"
          tiles={[
            "grass",
            "rocks2",
            "stump",
            "rocks",
            "flowers4",
            "flower3",
            "flower5",
            "leaves",
            "log",
            "plant3",
            "flower2",
            "plants",
            "flowers5",
            "pot",
            "flowers",
            "flowers2",
            "vines",
            "fence7",
            "fence3",
            "plants5",
            "tree1",
            "tree2",
            "shop",
          ]}
          selectedTile={selectedTiles.overlay}
          onSelect={(tile) =>
            setSelectedTiles((prev) => ({ ...prev, overlay: tile }))
          }
          layer="overlay"
        />
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
