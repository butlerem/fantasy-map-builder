import treeSrc from "./tiles/tree.png";
import boatSrc from "./tiles/boat.png";
import fountainSrc from "./tiles/fountain.png";

import clockSrc from "./tiles/clock.png";
import cabinSrc from "./tiles/cabin.png";
import houseSrc from "./tiles/house.png";
import { createImage } from "./tileImages";

export const objects = {
  tree: {
    image: createImage(treeSrc),
    gridWidth: 2,
    gridHeight: 3,
  },
  boat: {
    image: createImage(boatSrc),
    gridWidth: 2,
    gridHeight: 1,
  },
  fountain: {
    image: createImage(fountainSrc),
    gridWidth: 2,
    gridHeight: 2,
  },
  clock: {
    image: createImage(clockSrc),
    gridWidth: 2,
    gridHeight: 4,
  },
  cabin: {
    image: createImage(cabinSrc),
    gridWidth: 2,
    gridHeight: 3,
  },
  house: {
    image: createImage(houseSrc),
    gridWidth: 2,
    gridHeight: 3,
  },
};
