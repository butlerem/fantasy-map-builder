// Only import sprite sheet images with 12 columns x 8 rows
import peopleSrc from "./events/people.png";

// Create the image object for the sprite sheet.
const peopleImg = new Image();
peopleImg.src = peopleSrc;

// Define the dimensions of a single tile (cell) in the sprite sheet.
export const FRAME_WIDTH = 48; // width of one cell in pixels
export const FRAME_HEIGHT = 48; // height of one cell in pixels

// Each event occupies a block of 3 columns x 4 rows.
export const EVENT_BLOCK_COLUMNS = 3;
export const EVENT_BLOCK_ROWS = 4;
export const EVENT_BLOCK_WIDTH = EVENT_BLOCK_COLUMNS * FRAME_WIDTH;
export const EVENT_BLOCK_HEIGHT = EVENT_BLOCK_ROWS * FRAME_HEIGHT;

// There are 12 columns total in the sprite sheet,
// so the number of event blocks per row is:
export const EVENTS_PER_ROW = 12 / EVENT_BLOCK_COLUMNS; // 4 in this case

// Map each event type to a block index (0 through 7).
// For example, the "boy" event is the first block.
const eventMapping = {
  boy: 0, // Block 0 (first event block)
  girl: 1, // Block 1 (next block in the top row)
  man: 2, // Block 2
  woman: 3, // Block 3 (end of the top row)
  // You can add additional events in the bottom row (indices 4-7)
};

// This function returns the sub-rectangle for the idle frame
// of a given event type. The idle frame is defined as the frame
// in the first row of the event block (row 0) and in the middle column (column 1).
const getIdleFrameForEvent = (eventType) => {
  const index = eventMapping[eventType];
  if (index === undefined) {
    console.warn(`No event mapping found for "${eventType}"`);
    return {
      image: peopleImg,
      sx: 0,
      sy: 0,
      sWidth: FRAME_WIDTH,
      sHeight: FRAME_HEIGHT,
    };
  }
  const blockColumn = index % EVENTS_PER_ROW;
  const blockRow = Math.floor(index / EVENTS_PER_ROW);
  const blockX = blockColumn * EVENT_BLOCK_WIDTH;
  const blockY = blockRow * EVENT_BLOCK_HEIGHT;
  const idleCellColumn = 1;
  const idleCellRow = 0;
  const sx = blockX + idleCellColumn * FRAME_WIDTH;
  const sy = blockY + idleCellRow * FRAME_HEIGHT;

  console.log(eventType, {
    index,
    blockColumn,
    blockRow,
    blockX,
    blockY,
    sx,
    sy,
  });

  return {
    image: peopleImg,
    sx,
    sy,
    sWidth: FRAME_WIDTH,
    sHeight: FRAME_HEIGHT,
  };
};

export default getIdleFrameForEvent;
