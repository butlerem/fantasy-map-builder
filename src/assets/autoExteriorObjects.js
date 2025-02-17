// src/assets/autoExteriorObjects.js

// Import the atlas URL and new JSON mapping.
import atlasURL from "./atlases/exterior.png";
import atlasData from "./atlases/exterior.json";

const TILE_SIZE = 46;

// Create an Image element from the atlas URL.
const atlasImage = new Image();
atlasImage.src = atlasURL;

// Auto-generate object definitions from the new atlas JSON.
// For each frame entry, we store its image, grid dimensions (calculated from TILE_SIZE),
// and a helper to return its frame data.
const objects = {};

Object.entries(atlasData.frames).forEach(([key, data]) => {
  // Ensure frame data exists
  if (!data || !data.frame) {
    console.warn(`No frame data for key "${key}". Skipping.`);
    return;
  }
  const frame = data.frame;
  // Calculate grid dimensions (you may adjust this if you need a different calculation)
  const gridWidth = Math.ceil(frame.w / TILE_SIZE);
  const gridHeight = Math.ceil(frame.h / TILE_SIZE);
  objects[key] = {
    image: atlasImage, // the atlas image (HTMLImageElement)
    gridWidth,
    gridHeight,
    getFrame: () => frame,
  };
});

export default objects;
