import React from "react";
import tileImages from "../assets/tileImages";
import { objects as objectDefinitions } from "../assets/mapObjects";
import getFrameForEvent from "../assets/eventSprites";

const TILE_SIZE = 48;

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
          gap: "10px",
          // Increase maxWidth so 3 columns + padding + gap can fit
          maxWidth: 200, // Try 200, 220, etc. if 3 columns don't fit
          maxHeight: "400px",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {tiles.map((tile) => {
          if (tile === null) return null;

          // Default dimensions for 1x1 tiles
          let tileWidth = TILE_SIZE;
          let tileHeight = TILE_SIZE;

          // If in the objects layer and a multi-tile definition exists, update dimensions
          if (layer === "overlay" && objectDefinitions[tile]) {
            tileWidth = objectDefinitions[tile].gridWidth * TILE_SIZE;
            tileHeight = objectDefinitions[tile].gridHeight * TILE_SIZE;
          }

          let imgSrc = null;
          let spriteStyle = {};

          if (layer === "base" || layer === "overlay") {
            imgSrc = tileImages[tile];
          } else if (layer === "events") {
            const eventSprite = getFrameForEvent(tile, 1);
            imgSrc = eventSprite?.image;
            spriteStyle = {
              width: eventSprite.sWidth,
              height: eventSprite.sHeight,
              backgroundImage: `url(${eventSprite.image.src})`,
              backgroundPosition: `-${eventSprite.sx}px -${eventSprite.sy}px`,
              backgroundSize: `${eventSprite.image.width}px ${eventSprite.image.height}px`,
            };
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
              {imgSrc ? (
                layer === "events" ? (
                  <div style={spriteStyle} />
                ) : (
                  <img
                    src={imgSrc.src}
                    alt={tile}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )
              ) : (
                <span style={{ fontSize: "12px" }}>{tile}</span>
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
