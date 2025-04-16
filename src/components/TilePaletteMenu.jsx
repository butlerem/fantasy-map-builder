import React from "react";
import TilePalette from "./TilePalette";

const TilePaletteMenu = ({
  activeLayer,
  setActiveLayer,
  selectedTiles,
  setSelectedTiles,
}) => {
  return (
    <div className="tile-palette">
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

      {activeLayer === "base" && (
        <TilePalette
          title="Base Tiles"
          tiles={["grass", "water", "road", "road2"]}
          selectedTile={selectedTiles.base}
          onSelect={(tile) =>
            setSelectedTiles((prev) => ({ ...prev, base: tile }))
          }
          layer="base"
        />
      )}
      {activeLayer === "overlay" && (
        <TilePalette
          title="Overlay Tiles"
          tiles={["flower", "flower2", "flower3", "bush", "rock"]}
          selectedTile={selectedTiles.overlay}
          onSelect={(tile) =>
            setSelectedTiles((prev) => ({ ...prev, overlay: tile }))
          }
          layer="overlay"
        />
      )}
      {activeLayer === "events" && (
        <TilePalette
          title="Event Tiles"
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
