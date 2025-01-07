// Only import sprite sheet images with 12 columns x 8 rows
import peopleSrc from "./events/people.png";
import people2Src from "./events/people2.png";
import animalSrc from "./events/animals.png";
import animal2Src from "./events/animals2.png";
import animal3Src from "./events/animals3.png";

// Create the image object for the sprite sheet.
const peopleImg = new Image();
peopleImg.src = peopleSrc;

const people2Img = new Image();
people2Img.src = people2Src;

const animalImg = new Image();
animalImg.src = animalSrc;

const animal2Img = new Image();
animal2Img.src = animal2Src;

const animal3Img = new Image();
animal3Img.src = animal3Src;

// Define the dimensions of a single tile (cell) in the sprite sheet.
export const FRAME_WIDTH = 48;
export const FRAME_HEIGHT = 48;

// Each event occupies a block of 3 columns x 4 rows.
export const EVENT_BLOCK_COLUMNS = 3;
export const EVENT_BLOCK_ROWS = 4;
export const EVENT_BLOCK_WIDTH = EVENT_BLOCK_COLUMNS * FRAME_WIDTH;
export const EVENT_BLOCK_HEIGHT = EVENT_BLOCK_ROWS * FRAME_HEIGHT;

// There are 12 columns total in the sprite sheet,
// so number of event blocks per row is:
export const EVENTS_PER_ROW = 12 / EVENT_BLOCK_COLUMNS;

// Map each event type to a block index (0 through 7).
const eventMapping = {
  boy: { sheet: "people", index: 0 },
  girl: { sheet: "people2", index: 2 },
  boy2: { sheet: "people", index: 2 },
  girl2: { sheet: "people", index: 3 },
  man: { sheet: "people2", index: 0 },
  woman: { sheet: "people", index: 5 },
  man2: { sheet: "people", index: 6 },
  woman2: { sheet: "people", index: 7 },

  animal1: { sheet: "animals3", index: 2 },
  animal2: { sheet: "animals3", index: 3 },
  animal3: { sheet: "animals", index: 1 },

  animal4: { sheet: "animals2", index: 0 },
  animal5: { sheet: "animals2", index: 2 },
  animal6: { sheet: "animals2", index: 3 },
  animal7: { sheet: "animals3", index: 1 },
};

/// This function now accepts a frame index. For a walking cycle, 3 frames (0, 1, 2).
const getFrameForEvent = (eventType, frameIndex = 1, direction = "down") => {
  const eventData = eventMapping[eventType];

  if (!eventData) return null;
  // Select the correct sprite sheet dynamically
  let spriteSheet;
  if (eventData.sheet === "people") {
    spriteSheet = peopleImg;
  } else if (eventData.sheet === "people2") {
    spriteSheet = people2Img;
  } else if (eventData.sheet === "animals") {
    spriteSheet = animalImg;
  } else if (eventData.sheet === "animals2") {
    spriteSheet = animal2Img;
  } else if (eventData.sheet === "animals3") {
    spriteSheet = animal3Img;
  } else {
    return null; // Invalid sprite sheet name
  }

  const { index } = eventData;
  const blockColumn = index % EVENTS_PER_ROW;
  const blockRow = Math.floor(index / EVENTS_PER_ROW);
  const blockX = blockColumn * EVENT_BLOCK_WIDTH;
  const blockY = blockRow * EVENT_BLOCK_HEIGHT;

  const directionRow = { down: 0, left: 1, right: 2, up: 3 }[direction];

  return {
    image: spriteSheet,
    sx: blockX + frameIndex * FRAME_WIDTH,
    sy: blockY + directionRow * FRAME_HEIGHT,
    sWidth: FRAME_WIDTH,
    sHeight: FRAME_HEIGHT,
  };
};

export default getFrameForEvent;
