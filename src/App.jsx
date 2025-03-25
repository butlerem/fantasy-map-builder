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
  const [selectedTile, setSelectedTile] = useState("water");
  const [isDrawing, setIsDrawing] = useState(false);
  const tileImages = useRef({});

  useEffect(() => {
    // Preload images
    const grassImg = new Image();
    grassImg.src = grassSrc;
    const waterImg = new Image();
    waterImg.src = waterSrc;

    tileImages.current = {
      grass: grassImg,
      water: waterImg,
    };

    // Draw grid once images are loaded
    grassImg.onload = waterImg.onload = () => {
      drawGrid();
    };
  }, []);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = grid[y][x];
        const img = tileImages.current[tileType];
        if (img) {
          ctx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        } else {
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  };

  // Update tile based on mouse event coordinates
  const updateTile = (e) => {
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

  // Start drawing on mouse down
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    updateTile(e);
  };

  // If drawing is active, update the tile as the mouse moves
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    updateTile(e);
  };

  // Stop drawing when mouse is released or leaves the canvas
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    drawGrid();
  }, [grid]);

  return (
    <div style={{ display: "flex" }}>
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * TILE_SIZE}
        height={GRID_HEIGHT * TILE_SIZE}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
