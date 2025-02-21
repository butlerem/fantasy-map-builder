import React, { useRef, useState, useEffect } from "react";
import grassSrc from "./assets/grass.png";
import waterSrc from "./assets/water.png";

const TILE_SIZE = 32;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const DEFAULT_TILE = "grass";

function App() {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_TILE)
    )
  );
  const [selectedTile, setSelectedTile] = useState("water"); // starting selection

  // Use a ref to store the preloaded images
  const tileImages = useRef({});

  useEffect(() => {
    // Preload your images once
    const grassImg = new Image();
    grassImg.src = grassSrc;
    const waterImg = new Image();
    waterImg.src = waterSrc;

    // Store them in the ref for later use
    tileImages.current = {
      grass: grassImg,
      water: waterImg,
    };

    // When both images have loaded, draw the grid
    // (for simplicity, we assume both load quickly)
    grassImg.onload = waterImg.onload = () => {
      drawGrid();
    };
  }, []);

  // Function to draw the grid on the canvas
  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = grid[y][x];
        const img = tileImages.current[tileType];
        if (img) {
          // Draw the image instead of a colored rectangle
          ctx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        } else {
          // Fallback in case an image isn't available
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  };

  // Redraw the grid every time the grid state updates
  useEffect(() => {
    drawGrid();
  }, [grid]);

  // Handle clicks on the canvas to update a tile in the grid
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.slice());
      newGrid[y][x] = selectedTile;
      return newGrid;
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * TILE_SIZE}
        height={GRID_HEIGHT * TILE_SIZE}
        onClick={handleCanvasClick}
        style={{ border: "1px solid #000" }}
      />
      <div style={{ marginLeft: 20 }}>
        <h3>Tile Palette</h3>
        <button onClick={() => setSelectedTile("grass")}>Grass</button>
        <button onClick={() => setSelectedTile("water")}>Water</button>
      </div>
    </div>
  );
}

export default App;
