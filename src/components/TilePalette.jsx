// src/components/TilePalette.jsx
import React from "react";
import tileImages from "../assets/tileImages";
// Import atlas-based objects for the overlay layer.
import atlasObjects from "../assets/autoExteriorObjects";
import getFrameForEvent from "../assets/eventSprites";

const TILE_SIZE = 46;

const TilePalette = ({ title, tiles, selectedTile, onSelect, layer }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <h3 style={{ marginBottom: "5px" }}>{title}</h3>

      {/* Toolbox Grid (flex wrap) */}
      <div
        className="toolbox"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1px",
          boxSizing: "border-box",
        }}
      >
        {tiles.map((tile) => {
          if (tile === null) return null;

          // Default dimensions for 1x1 tiles.
          let tileWidth = TILE_SIZE;
          let tileHeight = TILE_SIZE;

          // Variables for rendering preview.
          let imgSrc = null;
          let spriteStyle = {};

          if (layer === "base") {
            // For base layer, use individual tile images.
            imgSrc = tileImages[tile];
          } else if (layer === "overlay") {
            // For overlay (objects) layer, look up the atlas object.
            const objDef = atlasObjects[tile];
            if (objDef) {
              // Currently:
              // tileWidth = objDef.gridWidth * TILE_SIZE;
              // tileHeight = objDef.gridHeight * TILE_SIZE;

              // Instead, use the object's actual frame dimensions:
              const frame = objDef.getFrame();
              tileWidth = frame.w;
              tileHeight = frame.h;

              // Then apply background cropping at 1:1 scale:
              spriteStyle = {
                width: tileWidth,
                height: tileHeight,
                backgroundImage: `url(${objDef.image.src})`,
                backgroundPosition: `-${frame.x}px -${frame.y}px`,
                backgroundSize: `${objDef.image.width}px ${objDef.image.height}px`,
              };
            }
          } else if (layer === "events") {
            // For events, use getFrameForEvent to get the cropped region.
            const eventSprite = getFrameForEvent(tile, 1);
            if (eventSprite) {
              // Use the frame dimensions from the event sprite.
              tileWidth = eventSprite.sWidth;
              tileHeight = eventSprite.sHeight;
              // Set inline style so that only the cropped region is shown.
              spriteStyle = {
                width: tileWidth,
                height: tileHeight,
                backgroundImage: `url(${eventSprite.image.src})`,
                backgroundPosition: `-${eventSprite.sx}px -${eventSprite.sy}px`,
                backgroundSize: `${eventSprite.image.width}px ${eventSprite.image.height}px`,
              };
            }
          }

          return (
            <div
              className="icon"
              key={tile}
              onClick={() => onSelect(tile)}
              style={{
                width: tileWidth,
                height: tileHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  selectedTile === tile
                    ? "3px solid white"
                    : "2px solid transparent",
                cursor: "pointer",
                background: "#eee",
                overflow: "hidden",
              }}
            >
              {/** For base layer, we render an <img>; for overlay and events, we render a div with background cropping */}
              {layer === "base" && imgSrc ? (
                <img
                  src={imgSrc.src}
                  alt={tile}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div style={spriteStyle} />
              )}
            </div>
          );
        })}
      </div>

      {/* Eraser option for non-base layers */}
      {layer !== "base" && (
        <div
          className="eraser"
          onClick={() => onSelect(null)}
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border:
              selectedTile === null
                ? "3px solid white"
                : "2px solid transparent",
          }}
        >
          Eraser
        </div>
      )}
    </div>
  );
};

export default TilePalette;
