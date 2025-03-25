import beamsImageSrc from "../../assets/events/light3.webp";

// Applies a seasonal tint to the canvas.
export function applySeasonTint(ctx, season) {
  let tintColor = "rgba(255,255,255,0)";
  switch (season) {
    case "winter":
      tintColor = "rgba(136, 113, 251, 0.16)";
      break;
    case "summer":
      tintColor = "rgba(255, 132, 16, 0.17)";
      break;
    case "spring":
    default:
      tintColor = "rgba(149, 255, 0, 0.1)";
      break;
  }
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = tintColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "source-over"; // reset to default
}

// Draw snowfall effect for winter.
export function drawSnowEffect(ctx, particles) {
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();
  });
}

// Preload the beams image for summer effects.
const beamsImage = new Image();
beamsImage.src = beamsImageSrc;

// Draw light stream effect for summer using the beams image.
// This uses the "screen" composite mode so that only the white parts of the image add brightness.
export function drawLightStreamEffect(ctx) {
  if (beamsImage.complete) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(beamsImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  } else {
    beamsImage.onload = () => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(beamsImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    };
  }
}

// drawEffects function that applies the seasonal tint and any other effects.
export function drawEffects({ ctx, season, snowParticles }) {
  // Apply a color tint for the season.
  applySeasonTint(ctx, season);

  // Draw additional effects based on the season.
  if (season === "winter") {
    drawSnowEffect(ctx, snowParticles);
  } else if (season === "summer") {
    drawLightStreamEffect(ctx);
  }
}
