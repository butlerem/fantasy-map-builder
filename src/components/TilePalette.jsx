import React from "react";
import tileImages from "../assets/tileImages";
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

      {/* Toolbox Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: `repeat(${tiles.length}, ${TILE_SIZE}px)`,
          gap: "5px",
          padding: "5px",
          border: "2px solid black",
          background: "#ccc",
          borderRadius: "5px",
        }}
      >
        {tiles.map((tile) => {
          if (tile === null) return null; // Skip null since eraser is separate

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
              key={tile}
              onClick={() => onSelect(tile)}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  selectedTile === tile
                    ? "3px solid red"
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

      {/* Show Eraser only for Overlay & Events layers */}
      {layer !== "base" && (
        <div
          onClick={() => onSelect(null)}
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
              selectedTile === null ? "3px solid red" : "2px solid transparent",
            cursor: "pointer",
            background: "#eee",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Eraser
        </div>
      )}
    </div>
  );
};

export default TilePalette;
