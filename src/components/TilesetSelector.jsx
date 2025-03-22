import React, { useState, useRef } from "react";
import outdoorTileset from "../assets/maps/outdoor.png";

const TILE_SIZE_TILES = 32; // size of each tile in the tileset

const TilesetSelector = ({ onSelect, selectedTile }) => {
  // Store selection in terms of tile coordinates
  const [isSelecting, setIsSelecting] = useState(false);
  const [startTile, setStartTile] = useState(null);
  const [currentTile, setCurrentTile] = useState(null);
  const containerRef = useRef(null);

  // Convert mouse event into tile coordinates (integer values)
  const getTileCoords = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const tileX = Math.floor((e.clientX - rect.left) / TILE_SIZE_TILES);
    const tileY = Math.floor((e.clientY - rect.top) / TILE_SIZE_TILES);
    return { tileX, tileY };
  };

  const handleMouseDown = (e) => {
    const tileCoords = getTileCoords(e);
    setStartTile(tileCoords);
    setCurrentTile(tileCoords);
    setIsSelecting(true);
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    const tileCoords = getTileCoords(e);
    setCurrentTile(tileCoords);
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (!startTile || !currentTile) return;
    const tileX1 = Math.min(startTile.tileX, currentTile.tileX);
    const tileY1 = Math.min(startTile.tileY, currentTile.tileY);
    const tileX2 = Math.max(startTile.tileX, currentTile.tileX);
    const tileY2 = Math.max(startTile.tileY, currentTile.tileY);
    const sx = tileX1 * TILE_SIZE_TILES;
    const sy = tileY1 * TILE_SIZE_TILES;
    const sw = (tileX2 - tileX1 + 1) * TILE_SIZE_TILES;
    const sh = (tileY2 - tileY1 + 1) * TILE_SIZE_TILES;
    onSelect({ sx, sy, sw, sh });
  };

  // Compute the preview rectangle in pixel coordinates from the tile coordinates.
  let preview = null;
  if (startTile && currentTile) {
    const tileX1 = Math.min(startTile.tileX, currentTile.tileX);
    const tileY1 = Math.min(startTile.tileY, currentTile.tileY);
    const tileX2 = Math.max(startTile.tileX, currentTile.tileX);
    const tileY2 = Math.max(startTile.tileY, currentTile.tileY);
    preview = {
      left: tileX1 * TILE_SIZE_TILES,
      top: tileY1 * TILE_SIZE_TILES,
      width: (tileX2 - tileX1 + 1) * TILE_SIZE_TILES,
      height: (tileY2 - tileY1 + 1) * TILE_SIZE_TILES,
    };
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={containerRef}
        src={outdoorTileset}
        alt="Outdoor Tileset"
        draggable="false"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ display: "block", cursor: "crosshair" }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.3) 1px, transparent 1px)`,
          backgroundSize: `${TILE_SIZE_TILES}px ${TILE_SIZE_TILES}px`,
          pointerEvents: "none",
        }}
      />
      {/* Preview highlight */}
      {isSelecting && preview && (
        <div
          style={{
            position: "absolute",
            left: preview.left,
            top: preview.top,
            width: preview.width,
            height: preview.height,
            border: "2px dashed cyan",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Highlight the selected region once chosen */}
      {selectedTile && (
        <div
          style={{
            position: "absolute",
            left: selectedTile.sx,
            top: selectedTile.sy,
            width: selectedTile.sw,
            height: selectedTile.sh,
            border: "2px solid magenta",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        />
      )}
      {selectedTile && (
        <div style={{ marginTop: "10px" }}>
          Selected region: {selectedTile.sx}, {selectedTile.sy},{" "}
          {selectedTile.sw}×{selectedTile.sh}
        </div>
      )}
    </div>
  );
};

export default TilesetSelector;
