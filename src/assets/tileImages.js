import grassSrc from "./tiles/grass.png";
import waterSrc from "./tiles/water.png";
import roadSrc from "./tiles/road.png";
import flowerSrc from "./tiles/flower.png";
import bushSrc from "./tiles/bush.png";
import rockSrc from "./tiles/rock.png";

// Helper function to create an HTMLImageElement from a given source URL
const createImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

// Create and export an object that maps tile names to Image objects.
// This allows us to access images by name in our canvas drawing logic.
const tileImages = {
  grass: createImage(grassSrc),
  water: createImage(waterSrc),
  road: createImage(roadSrc),
  flower: createImage(flowerSrc),
  bush: createImage(bushSrc),
  rock: createImage(rockSrc),
};

export default tileImages;
