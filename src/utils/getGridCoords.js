export function getGridCoords(e, canvas, tileSize = 40) {
  // Get canvas bounds and calculate scaling factors
  const {
    left,
    top,
    width: rectWidth,
    height: rectHeight,
  } = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rectWidth;
  const scaleY = canvas.height / rectHeight;

  // Convert mouse coordinates to grid coordinates
  return {
    x: Math.floor(((e.clientX - left) * scaleX) / tileSize),
    y: Math.floor(((e.clientY - top) * scaleY) / tileSize),
  };
}
