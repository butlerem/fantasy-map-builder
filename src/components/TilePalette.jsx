import React from "react";
import tileImages from "../assets/tileImages";
import atlasObjects from "../assets/autoExteriorObjects";
import getFrameForEvent from "../assets/eventSprites";
import { FaPencilAlt, FaSquare, FaCircle, FaFillDrip } from "react-icons/fa";

const TILE_SIZE = 46;

const TilePalette = ({
  title,
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
        margin: "10px",
      }}
    >
      <h3 style={{ marginBottom: "5px" }}>{title}</h3>

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

          if (layer === "base") {
            imgSrc = tileImages[tile];
          } else if (layer === "overlay") {
            const objDef = atlasObjects[tile];
            if (objDef) {
              const frame = objDef.getFrame();
              tileWidth = frame.w;
              tileHeight = frame.h;
              spriteStyle = {
                width: tileWidth,
                height: tileHeight,
                backgroundImage: `url(${objDef.image.src})`,
                backgroundPosition: `-${frame.x}px -${frame.y}px`,
                backgroundSize: `${objDef.image.width}px ${objDef.image.height}px`,
              };
            }
          } else if (layer === "events") {
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
                    ? "3px solid white"
                    : "2px solid transparent",
                cursor: "pointer",
                background: "#eee",
                overflow: "hidden",
                borderRadius: "4px",
                margin: "2px",
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
                  ? "3px solid white"
                  : "2px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaPencilAlt size={20} color="var(--white)" />
          </button>
          <button
            onClick={() => onToolSelect("rectangle")}
            style={{
              border:
                drawingTool === "rectangle"
                  ? "3px solid white"
                  : "2px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaSquare size={20} color="var(--white)" />
          </button>
          <button
            onClick={() => onToolSelect("circle")}
            style={{
              border:
                drawingTool === "circle"
                  ? "3px solid white"
                  : "2px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaCircle size={20} color="var(--white)" />
          </button>
          <button
            onClick={() => onToolSelect("fill")}
            style={{
              border:
                drawingTool === "fill"
                  ? "3px solid white"
                  : "2px solid transparent",
              background: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <FaFillDrip size={20} color="var(--white)" />
          </button>
        </div>
      )}

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
