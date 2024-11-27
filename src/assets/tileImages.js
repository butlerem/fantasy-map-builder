// src/assets/tileImages.js
import grassSrc from "./tiles/grass.png";
import waterSrc from "./tiles/water.png";
import roadSrc from "./tiles/road.png";
import flowerSrc from "./tiles/flower.png";
import bushSrc from "./tiles/bush.png";
import rockSrc from "./tiles/rock.png";

const createImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

const tileImages = {
  grass: createImage(grassSrc),
  water: createImage(waterSrc),
  road: createImage(roadSrc),
  flower: createImage(flowerSrc),
  bush: createImage(bushSrc),
  rock: createImage(rockSrc),
};

export default tileImages;
