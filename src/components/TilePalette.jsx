import React from "react";

const TilePalette = ({ title, tiles, selectedTile, onSelect }) => {
  return (
    <div>
      <h3>{title}</h3>
      {tiles.map((tile) => (
        <button
          key={tile}
          onClick={() => onSelect(tile)}
          style={{
            backgroundColor: selectedTile === tile ? "#ddd" : "#fff",
            margin: "5px",
          }}
        >
          {tile}
        </button>
      ))}
      {title.includes("Overlay") && (
        <button onClick={() => onSelect(null)} style={{ margin: "5px" }}>
          Eraser
        </button>
      )}
    </div>
  );
};

export default TilePalette;
