import React from "react";

// Component for displaying a tile palette used to select a tile type
const TilePalette = ({ title, tiles, selectedTile, onSelect }) => {
  return (
    <div>
      {/* Display the palette title */}
      <h3>{title}</h3>
      {/* Create a button for each tile option */}
      {tiles.map((tile) => (
        <button
          key={tile}
          onClick={() => onSelect(tile)}
          style={{
            // Highlight the button if it's the currently selected tile
            backgroundColor: selectedTile === tile ? "#ddd" : "#fff",
            margin: "5px",
          }}
        >
          {tile}
        </button>
      ))}
      {/* For overlay layers, add an "Eraser" button to clear the tile */}
      {title.includes("Overlay") && (
        <button onClick={() => onSelect(null)} style={{ margin: "5px" }}>
          Eraser
        </button>
      )}
    </div>
  );
};

export default TilePalette;
