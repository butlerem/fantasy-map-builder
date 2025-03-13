import grassSrc from "./tiles/grass.png";
import waterSrc from "./tiles/water.png";
import roadSrc from "./tiles/road.png";
import road2Src from "./tiles/road2.png";
import tile from "./tiles/tile.png";
import brick from "./tiles/brick.png";
//
import flowerSrc from "./tiles/flower.png";
import flower2Src from "./tiles/flower2.png";
import flower3Src from "./tiles/flower3.png";
import stumpSrc from "./tiles/stump.png";
import bushSrc from "./tiles/bush.png";
import rockSrc from "./tiles/rock.png";
//
import treeSrc from "./tiles/tree.png";
import boatSrc from "./tiles/boat.png";
import fountainSrc from "./tiles/fountain.png";
import clockSrc from "./tiles/clock.png";
import houseSrc from "./tiles/house.png";
import cabinSrc from "./tiles/cabin.png";

// Helper function to create an HTMLImageElement from a given source URL
export const createImage = (src) => {
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
  road2: createImage(road2Src),
  tile: createImage(tile),
  brick: createImage(brick),
  //
  flower: createImage(flowerSrc),
  flower2: createImage(flower2Src),
  flower3: createImage(flower3Src),
  stump: createImage(stumpSrc),
  bush: createImage(bushSrc),
  rock: createImage(rockSrc),
  //
  tree: createImage(treeSrc),
  boat: createImage(boatSrc),
  fountain: createImage(fountainSrc),
  clock: createImage(clockSrc),
  house: createImage(houseSrc),
  cabin: createImage(cabinSrc),
};

export default tileImages;
