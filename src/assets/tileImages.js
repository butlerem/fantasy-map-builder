import grassSrc from "./tiles/grass.png";
import grass2Src from "./tiles/grass2.png";
import grass3Src from "./tiles/grass3.png";
import waterSrc from "./tiles/water.png";
import water2Src from "./tiles/water2.png";
import roadSrc from "./tiles/road.png";
import road2Src from "./tiles/road2.png";
import tile from "./tiles/tile.png";
import brick from "./tiles/brick.png";
import oneSrc from "./tiles/1.png";
import twoSrc from "./tiles/2.png";
import threeSrc from "./tiles/3.png";
import fourSrc from "./tiles/4.png";
import fiveSrc from "./tiles/5.png";
import sandSrc from "./tiles/sand.png";
import stairsSrc from "./tiles/stairs.png";
import stone2Src from "./tiles/stone2.png";
import tile2Src from "./tiles/tile2.png";
//

// Helper function to create an HTMLImageElement from a given source URL
export const createImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

// Create and export an object that maps tile names to Image objects.
// This allows us to access images by name in our canvas drawing logic.
const tileImages = {
  one: createImage(oneSrc),
  two: createImage(twoSrc),
  three: createImage(threeSrc),
  four: createImage(fourSrc),
  five: createImage(fiveSrc),
  sand: createImage(sandSrc),
  stairs: createImage(stairsSrc),
  stone2: createImage(stone2Src),
  tile2: createImage(tile2Src),
  grass: createImage(grassSrc),
  grass2: createImage(grass2Src),
  grass3: createImage(grass3Src),
  water: createImage(waterSrc),
  water2: createImage(water2Src),
  road: createImage(roadSrc),
  road2: createImage(road2Src),
  tile: createImage(tile),
  brick: createImage(brick),
};

export default tileImages;
