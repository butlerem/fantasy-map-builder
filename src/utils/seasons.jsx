import beamsImageSrc from "../assets/events/light3.webp";

// Draw snowfall effect for winter.
export const drawSnowEffect = (ctx, particles) => {
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();
  });
};

// Preload the beams image.
const beamsImage = new Image();
beamsImage.src = beamsImageSrc;

// Draw light stream effect for summer using the beams image.
// It uses the "screen" composite mode so that only the white parts of the image add brightness.
export const drawLightStreamEffect = (ctx) => {
  if (beamsImage.complete) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(beamsImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  } else {
    // If the image isn't loaded yet, set an onload callback.
    beamsImage.onload = () => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(beamsImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    };
  }
};
