import React from "react";
import tileImages from "../assets/tileImages";
import getFrameForEvent from "../assets/eventSprites";
import {
  FaPencilAlt,
  FaSquare,
  FaCircle,
  FaFillDrip,
  FaEraser,
} from "react-icons/fa";

const TILE_SIZE = 40;

const TilePalette = ({
  tiles,
  selectedTile,
  onSelect,
  onToolSelect,
  layer,
  drawingTool,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "5px",
      }}
    >
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
          let tileWidth = TILE_SIZE;
          let tileHeight = TILE_SIZE;
          let imgSrc = null;
          let spriteStyle = {};

          // Base layer: use images from tileImages.
          if (layer === "base") {
            imgSrc = tileImages[tile];
          }
          // Events layer: use getFrameForEvent.
          else if (layer === "events") {
            const eventSprite = getFrameForEvent(tile, 1);
            if (eventSprite) {
              tileWidth = eventSprite.sWidth;
              tileHeight = eventSprite.sHeight;
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
                    ? "2px solid white"
                    : "1px solid transparent",
                cursor: "pointer",
                background: "#eee",
                overflow: "hidden",
                borderRadius: "4px",
                margin: "1px",
              }}
            >
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

      {layer === "base" && (
        <div
          className="shapes"
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "5px",
          }}
        >
          <button
            onClick={() => onToolSelect("pencil")}
            style={{
              border:
                drawingTool === "pencil"
                  ? "1px solid white"
                  : "1px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaPencilAlt size={15} color="var(--white)" />
          </button>
          <button
            onClick={() => onToolSelect("rectangle")}
            style={{
              border:
                drawingTool === "rectangle"
                  ? "1px solid white"
                  : "1px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaSquare size={15} color="var(--white)" />
          </button>
          <button
            onClick={() => onToolSelect("circle")}
            style={{
              border:
                drawingTool === "circle"
                  ? "1px solid white"
                  : "1px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaCircle size={15} color="var(--white)" />
          </button>
          <button
            onClick={() => onToolSelect("fill")}
            style={{
              border:
                drawingTool === "fill"
                  ? "1px solid white"
                  : "1px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaFillDrip size={15} color="var(--white)" />
          </button>
        </div>
      )}

      {layer !== "base" && (
        <button
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
                ? "1px solid white"
                : "1px solid transparent",
          }}
        >
          <FaEraser size={15} color="var(--white)" />
        </button>
      )}
    </div>
  );
};

export default TilePalette;
