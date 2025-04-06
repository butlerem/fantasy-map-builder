import React, { useRef, useState, useEffect } from "react";
import grassSrc from "./assets/grass.png";
import waterSrc from "./assets/water.png";
import roadSrc from "./assets/road.png";
import flowerSrc from "./assets/flower.png";
import rockSrc from "./assets/rock.png";
import bushSrc from "./assets/bush.png";

const TILE_SIZE = 32; // Size of each tile in pixels
const GRID_WIDTH = 18; // Number of tiles horizontally
const GRID_HEIGHT = 16; // Number of tiles vertically
const DEFAULT_TILE = "grass"; // Default tile for the base layer
const DEFAULT_OVERLAY_TILE = null; // No overlay tile by default

function App() {
  const canvasRef = useRef(null);

  // Grid state for the base layer (terrain)
  const [gridBase, setGridBase] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_TILE)
    )
  );

  // Grid state for the overlay layer (objects like flowers)
  const [gridOverlay, setGridOverlay] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => DEFAULT_OVERLAY_TILE)
    )
  );
  // Currently selected tile for each layer
  const [selectedTileBase, setSelectedTileBase] = useState("grass");
  const [selectedTileOverlay, setSelectedTileOverlay] = useState("flower");

  // Booleans to track dragging/painting state for each layer
  const [isDrawingBase, setIsDrawingBase] = useState(false);
  const [isDrawingOverlay, setIsDrawingOverlay] = useState(false);

  // Active layer selection: either 'base' or 'overlay'
  const [activeLayer, setActiveLayer] = useState("base");

  // Preload images for all tile types
  const tileImages = useRef({});

  useEffect(() => {
    const grassImg = new Image();
    grassImg.src = grassSrc;
    const waterImg = new Image();
    waterImg.src = waterSrc;
    const roadImg = new Image();
    roadImg.src = roadSrc;
    const flowerImg = new Image();
    flowerImg.src = flowerSrc;
    const bushImg = new Image();
    bushImg.src = bushSrc;
    const rockImg = new Image();
    rockImg.src = rockSrc;

    // Store images for easy access by tile type
    tileImages.current = {
      grass: grassImg,
      water: waterImg,
      road: roadImg,
      flower: flowerImg,
      bush: bushImg,
      rock: rockImg,
    };

    // Once images are loaded, draw the grid.
    grassImg.onload =
      waterImg.onload =
      roadImg.onload =
      flowerImg.onload =
      bushImg.onload =
      rockImg.onload =
        () => {
          drawGrid();
        };
  }, []);

  // Function to draw both layers on the canvas
  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the entire canvas before re-drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Draw the Base Layer ---
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = gridBase[y][x];
        const img = tileImages.current[tileType];
        if (img) {
          // Draw the base tile image
          ctx.drawImage(
            img,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        } else {
          // Fallback: fill with white if image not found
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
        // Draw grid border for clarity
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // --- Draw the Overlay Layer ---
    // This layer is drawn on top of the base layer
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tileType = gridOverlay[y][x];
        // Only draw if an overlay tile exists
        if (tileType) {
          const img = tileImages.current[tileType];
          if (img) {
            ctx.drawImage(
              img,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
          }
        }
      }
    }
  };

  // General function to update a tile on a specified layer based on mouse coordinates
  const updateTile = (e, layer) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Calculate the grid coordinates where the user clicked/dragged
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (layer === "base") {
      // Update base layer grid
      setGridBase((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());
        newGrid[y][x] = selectedTileBase;
        return newGrid;
      });
    } else if (layer === "overlay") {
      // Update overlay layer grid
      setGridOverlay((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());
        newGrid[y][x] = selectedTileOverlay;
        return newGrid;
      });
    }
  };

  // Mouse down event: start drawing on the active layer
  const handleMouseDown = (e) => {
    if (activeLayer === "base") {
      setIsDrawingBase(true);
      updateTile(e, "base");
    } else if (activeLayer === "overlay") {
      setIsDrawingOverlay(true);
      updateTile(e, "overlay");
    }
  };

  // Mouse move event: if dragging, update the tile at the current position
  const handleMouseMove = (e) => {
    if (activeLayer === "base" && isDrawingBase) {
      updateTile(e, "base");
    } else if (activeLayer === "overlay" && isDrawingOverlay) {
      updateTile(e, "overlay");
    }
  };

  // Mouse up or leave: stop drawing
  const handleMouseUp = () => {
    setIsDrawingBase(false);
    setIsDrawingOverlay(false);
  };

  const handleMouseLeave = () => {
    setIsDrawingBase(false);
    setIsDrawingOverlay(false);
  };

  // Function to reset both layers to initial state
  const clearCanvas = () => {
    // Reset base layer: fill with DEFAULT_TILE
    setGridBase(
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => DEFAULT_TILE)
      )
    );
    // Reset overlay layer: fill with DEFAULT_OVERLAY_TILE (null)
    setGridOverlay(
      Array.from({ length: GRID_HEIGHT }, () =>
        Array.from({ length: GRID_WIDTH }, () => DEFAULT_OVERLAY_TILE)
      )
    );
  };

  // Redraw the grid when either layer's state changes
  useEffect(() => {
    drawGrid();
  }, [gridBase, gridOverlay]);

  return (
    <div>
      {/* Layer selection controls */}
      <div>
        <button onClick={() => setActiveLayer("base")}>Base Layer</button>
        <button onClick={() => setActiveLayer("overlay")}>Overlay Layer</button>
        <button onClick={clearCanvas}>Clear Canvas</button>
      </div>

      <div style={{ display: "flex" }}>
        {/* Canvas for drawing the map */}
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
        {/* Tile palettes for each layer */}
        <div style={{ marginLeft: 20 }}>
          {activeLayer === "base" && (
            <div>
              <h3>Base Layer Palette</h3>
              <button onClick={() => setSelectedTileBase("grass")}>
                Grass
              </button>
              <button onClick={() => setSelectedTileBase("water")}>
                Water
              </button>
              <button onClick={() => setSelectedTileBase("road")}>Road</button>
            </div>
          )}
          {activeLayer === "overlay" && (
            <div>
              <h3>Overlay Layer Palette</h3>
              <button onClick={() => setSelectedTileOverlay("flower")}>
                Flower
              </button>
              <button onClick={() => setSelectedTileOverlay("bush")}>
                Bush
              </button>
              <button onClick={() => setSelectedTileOverlay("rock")}>
                Rock
              </button>
              <button onClick={() => setSelectedTileOverlay(null)}>
                Eraser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
