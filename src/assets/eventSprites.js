import peopleSrc from "./events/people.png";

// Create a single Image object for the sprite sheet
const peopleImg = new Image();
peopleImg.src = peopleSrc;

/*
  We will assume each character/event is 3 columns wide, 4 rows tall in the sheet.
  The 'boy' is at columns [0..2] and rows [0..3].
  For an idle standing frame (center column) we use column = 1, row = 0.
*/

const FRAME_WIDTH = 32; // the width of one animation frame in the sprite sheet
const FRAME_HEIGHT = 48; // the height of one animation frame

// Define a dictionary that maps eventType ("boy", "girl", etc.)
// to the sub-rectangle in the sprite sheet.
const eventSprites = {
  boy: {
    image: peopleImg, // which sheet to draw from
    sx: FRAME_WIDTH, // source X (for the "idle" frame, let's say column=1)
    sy: 0, // source Y (top row = 0)
    sWidth: FRAME_WIDTH, // how wide the sub-rectangle is
    sHeight: FRAME_HEIGHT, // how tall
  },
  girl: {
    image: peopleImg,
    // Assume "girl" is at columns 3..5. For an idle frame, use column=4.
    sx: FRAME_WIDTH * 4,
    sy: 0,
    sWidth: FRAME_WIDTH,
    sHeight: FRAME_HEIGHT,
  },
  // Add more sprites
};

export default eventSprites;
