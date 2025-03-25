import getFrameForEvent from "../../assets/eventSprites";

// Draw animated events on the canvas.
export function drawEvents({ ctx, animatedEvents, tileSize, onImageLoad }) {
  animatedEvents.forEach((event) => {
    const spriteData = getFrameForEvent(
      event.type,
      event.frame,
      event.direction
    );
    if (!spriteData) return;

    const { image, sx, sy, sWidth, sHeight } = spriteData;

    // If the image is loaded, draw it
    if (image.complete) {
      ctx.drawImage(
        image,
        sx,
        sy,
        sWidth,
        sHeight,
        event.x * tileSize,
        event.y * tileSize,
        tileSize,
        tileSize
      );
    }
    // Otherwise, set the onload handler if not already set
    else if (!image.onload) {
      image.onload = onImageLoad;
    }
  });
}
