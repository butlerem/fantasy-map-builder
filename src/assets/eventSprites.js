// Only import sprite sheet images with 12 columns
import npcSrc from "./events/npc.png";

// Create the image object for the sprite sheet.
const npcImg = new Image();
npcImg.src = npcSrc;

// Define the dimensions of a single tile (cell) in the sprite sheet.
export const FRAME_WIDTH = 48;
export const FRAME_HEIGHT = 48;

// Each event occupies a block of 3 columns x 4 rows.
export const EVENT_BLOCK_COLUMNS = 3;
export const EVENT_BLOCK_ROWS = 4;
export const EVENT_BLOCK_WIDTH = EVENT_BLOCK_COLUMNS * FRAME_WIDTH;
export const EVENT_BLOCK_HEIGHT = EVENT_BLOCK_ROWS * FRAME_HEIGHT;

// There are 12 columns total in the sprite sheet,
// so the number of event blocks per row is:
export const EVENTS_PER_ROW = 12 / EVENT_BLOCK_COLUMNS; // 12 / 3 = 4

// Default names for each event type
export const EVENT_DEFAULT_NAMES = {
  boy: "Village Boy",
  girl: "Village Girl",
  boy2: "Town Boy",
  girl2: "Town Girl",
  boy3: "Noble Boy",
  boy4: "Warrior Boy",
  girl3: "Noble Girl",
  girl4: "Warrior Girl",
  animal1: "Cow",
  animal2: "Fox",
  animal3: "Mountain Goat",
  animal4: "Mountain Goat",
};

// Map each event type to a block index
const eventMapping = {
  boy: { sheet: "npc", index: 0 },
  girl: { sheet: "npc", index: 1 },
  boy2: { sheet: "npc", index: 2 },
  girl2: { sheet: "npc", index: 3 },

  boy3: { sheet: "npc", index: 4 },
  boy4: { sheet: "npc", index: 5 },
  girl3: { sheet: "npc", index: 6 },
  girl4: { sheet: "npc", index: 7 },

  animal1: { sheet: "npc", index: 8 },
  animal2: { sheet: "npc", index: 9 },
  animal3: { sheet: "npc", index: 10 },
  animal4: { sheet: "npc", index: 11 },
};

/// This function accepts a frame index, for a walking cycle, 3 frames (0, 1, 2).
const getFrameForEvent = (eventType, frameIndex = 1, direction = "down") => {
  const eventData = eventMapping[eventType];

  if (!eventData) return null;
  // Select the correct sprite sheet dynamically
  let spriteSheet;
  if (eventData.sheet === "npc") {
    spriteSheet = npcImg;
  } else {
    return null; // Invalid sprite sheet name
  }

  const { index } = eventData;
  // Calculate the position of the event block in the grid.
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
