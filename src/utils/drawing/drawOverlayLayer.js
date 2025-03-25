export function drawOverlayLayer({
  ctx,
  gridOverlay,
  outdoorImage,
  tileSize,
  onImageLoad,
}) {
  for (let y = 0; y < gridOverlay.length; y++) {
    for (let x = 0; x < gridOverlay[y].length; x++) {
      const tileData = gridOverlay[y][x];
      if (!tileData) continue;

      // If the tileData has custom tileSelection with offsets:
      if (tileData.tileSelection) {
        const { tileSelection, offsetX, offsetY } = tileData;
        const subSx = tileSelection.sx + offsetX * 32;
        const subSy = tileSelection.sy + offsetY * 32;

        if (outdoorImage.complete) {
          ctx.drawImage(
            outdoorImage,
            subSx,
            subSy,
            32,
            32,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );
        } else if (!outdoorImage.onload) {
          outdoorImage.onload = () => onImageLoad();
        }
      } else {
        // Otherwise, draw from tileData's sx, sy, etc.
        if (outdoorImage.complete) {
          ctx.drawImage(
            outdoorImage,
            tileData.sx,
            tileData.sy,
            tileData.sw,
            tileData.sh,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );
        } else if (!outdoorImage.onload) {
          outdoorImage.onload = () => onImageLoad();
        }
      }
    }
  }
}
