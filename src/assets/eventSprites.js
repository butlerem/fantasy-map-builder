// Only import sprite sheet images with 12 columns x 8 rows
import peopleSrc from "./events/people.png";

// Create the image object for the sprite sheet.
const peopleImg = new Image();
peopleImg.src = peopleSrc;

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
  boy: 0, // Block 0 (first event block)
  girl: 1,
  boy2: 2,
  girl2: 3,
  man: 4,
  woman: 5,
  man2: 6,
  woman2: 7,
};

/// This function now accepts a frame index. For a walking cycle, 3 frames (0, 1, 2).
const getFrameForEvent = (eventType, frameIndex = 1, direction = "down") => {
  const index = eventMapping[eventType];
  if (index === undefined) return null;

  const blockColumn = index % EVENTS_PER_ROW;
  const blockRow = Math.floor(index / EVENTS_PER_ROW);
  const blockX = blockColumn * EVENT_BLOCK_WIDTH;
  const blockY = blockRow * EVENT_BLOCK_HEIGHT;

  const directionRow = { down: 0, left: 1, right: 2, up: 3 }[direction];

  return {
    image: peopleImg,
    sx: blockX + frameIndex * FRAME_WIDTH,
    sy: blockY + directionRow * FRAME_HEIGHT,
    sWidth: FRAME_WIDTH,
    sHeight: FRAME_HEIGHT,
  };
};

export default getFrameForEvent;
