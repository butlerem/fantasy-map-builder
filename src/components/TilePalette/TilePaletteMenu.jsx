import React from "react";
import TilePalette from "./TilePalette";
import TilesetSelector from "../TilesetSelector/TilesetSelector";
import { FaEraser } from "react-icons/fa";
import styles from "./TilePaletteMenu.module.scss";

const TilePaletteMenu = ({
  activeLayer,
  setActiveLayer,
  selectedTiles,
  setSelectedTiles,
  onToolSelect,
  drawingTool,
}) => {
  return (
    <div className={styles.tilePaletteMenu}>
      {/* Layer selection buttons */}
      <div className={styles.layerButtons}>
        <button
          className={`${styles.layerButton} ${
            activeLayer === "base" ? styles.active : ""
          }`}
          onClick={() => setActiveLayer("base")}
        >
          Base Layer
        </button>
        <button
          className={`${styles.layerButton} ${
            activeLayer === "overlay" ? styles.active : ""
          }`}
          onClick={() => setActiveLayer("overlay")}
        >
          Object Layer
        </button>
        <button
          className={`${styles.layerButton} ${
            activeLayer === "events" ? styles.active : ""
          }`}
          onClick={() => setActiveLayer("events")}
        >
          Event Layer
        </button>
      </div>

      {/* Layer-specific palettes */}
      {activeLayer === "base" && (
        <TilePalette
          tiles={[
            "water", "water2", "water4",
            "grass", "grass2", "grass3",
            "road", "road2",
            "sand", "sand2",
            "stone2", "tile2",
            "brick", "brick4",
            "stairs"
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
            className={`${styles.eraserButton} ${
              selectedTiles.overlay === null ? styles.active : ""
            }`}
            onClick={() =>
              setSelectedTiles((prev) => ({ ...prev, overlay: null }))
            }
          >
            <FaEraser size={15} color="var(--white)" />
          </button>
        </div>
      )}

      {activeLayer === "events" && (
        <TilePalette
          tiles={[
            "boy2",
            "girl2",
            "boy3",
            "girl3",
            "boy4",
            "girl4",
            "animal1",
            "animal2",
            "animal3",
            "monster1",
            "monster2",
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
