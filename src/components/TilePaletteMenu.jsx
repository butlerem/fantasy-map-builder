import React from "react";
import TilePalette from "./TilePalette";

// This component renders the menu for selecting the active layer (base, overlay, or events)
// and displays the corresponding TilePalette based on the currently active layer.
const TilePaletteMenu = ({
  activeLayer, // current active layer
  setActiveLayer, // change the active layer
  selectedTiles, // object containing the selected tile for each layer
  setSelectedTiles, //  update the selected tile for a given layer
}) => {
  return (
    <div className="tile-palette">
      {/* Layer buttons to switch between tile palettes */}
      <div className="layer-buttons">
        <button
          className={activeLayer === "base" ? "active" : ""}
          onClick={() => setActiveLayer("base")}
        >
          Base
        </button>
        <button
          className={activeLayer === "overlay" ? "active" : ""}
          onClick={() => setActiveLayer("overlay")}
        >
          Overlay
        </button>
        <button
          className={activeLayer === "events" ? "active" : ""}
          onClick={() => setActiveLayer("events")}
        >
          Events
        </button>
      </div>

      {/* Render the correct TilePalette based on the active layer */}
      {activeLayer === "base" && (
        <TilePalette
          title="Terrain"
          tiles={["grass", "water", "road", "road2", "tile", "brick"]}
          selectedTile={selectedTiles.base}
          onSelect={(tile) =>
            // Update the selected tile for the base layer
            setSelectedTiles((prev) => ({ ...prev, base: tile }))
          }
          layer="base"
        />
      )}
      {activeLayer === "overlay" && (
        <TilePalette
          title="Objects"
          tiles={[
            "flower",
            "flower2",
            "boat",
            "flower3",
            "stump",

            "fountain",

            "tree",
            "house",
            "cabin",
          ]}
          selectedTile={selectedTiles.overlay}
          onSelect={(tile) =>
            // Update the selected tile for the overlay layer
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
            // Update the selected tile for the events layer
            setSelectedTiles((prev) => ({ ...prev, events: tile }))
          }
          layer="events"
        />
      )}
    </div>
  );
};

export default TilePaletteMenu;
