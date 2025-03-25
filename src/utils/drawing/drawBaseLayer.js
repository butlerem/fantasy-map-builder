export function drawBaseLayer({
  ctx,
  gridBase,
  tileImages,
  tileSize,
  onImageLoad,
}) {
  for (let y = 0; y < gridBase.length; y++) {
    for (let x = 0; x < gridBase[y].length; x++) {
      const tileType = gridBase[y][x];
      const img = tileImages[tileType];

      if (img && img.complete) {
        ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
      } else {
        // Fallback to a white square if image is not yet loaded
        ctx.fillStyle = "#fff";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

        // If the image exists but has no onload, attach one so we can redraw
        if (img && !img.onload) {
          img.onload = () => onImageLoad();
        }
      }
    }
  }
}
