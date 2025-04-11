// ... your existing imports
import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { MapContext } from "../../context/MapContext";
import { SeasonsContext } from "../../context/SeasonProvider";
import outdoorTileset from "../../assets/maps/outdoor.png";
import { drawOverlayLayer } from "../../utils/drawing/drawOverlayLayer";
import { drawEvents } from "../../utils/drawing/drawEvents";
import { drawEffects } from "../../utils/drawing/drawEffects";
import { EventTooltip } from "../EventTooltip/EventTooltip";
import { getGridCoords } from "../../utils/getGridCoords";
import { useCanvasInteractions } from "../../hooks/useCanvasInteractions";
import { useMouseHandlers } from "../../hooks/useMouseHandlers";
import { drawAutotile } from "../../utils/drawAutotile";
import { autotileBlocks } from "../../utils/autotileConfig";

// Constants
const GRID_WIDTH = 28;
const GRID_HEIGHT = 24;
const TILE_SIZE = 40;

const MapCanvas = ({ activeLayer, selectedTile, drawingTool }) => {
  const {
    gridBase,
    setGridBase,
    gridOverlay,
    setGridOverlay,
    animatedEvents,
    setAnimatedEvents,
    updateTile,
  } = useContext(MapContext);
  const { season } = useContext(SeasonsContext);

  const canvasRef = useRef(null);
  const outdoorImageRef = useRef(null);

  const [imageMap, setImageMap] = useState({});
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [pinnedTooltip, setPinnedTooltip] = useState(null);
  const [snowParticles, setSnowParticles] = useState([]);

  useEffect(() => {
    const img = new Image();
    img.src = outdoorTileset;
    outdoorImageRef.current = img;
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = autotileBlocks.water.imageSrc;
    img.onload = () => {
      setImageMap((prev) => ({ ...prev, water: img }));
    };
  }, []);

  useEffect(() => {
    if (season === "winter") {
      const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * GRID_WIDTH * TILE_SIZE,
        y: Math.random() * GRID_HEIGHT * TILE_SIZE,
        radius: 2 + Math.random() * 2,
        speed: 0.5 + Math.random(),
        opacity: 0.5 + Math.random() * 0.5,
      }));
      setSnowParticles(particles);
    } else {
      setSnowParticles([]);
    }
  }, [season]);

  const {
    startPos,
    currentPos,
    handleMouseDown: canvasMouseDown,
    handleMouseMove: canvasMouseMove,
    handleMouseUp: canvasMouseUp,
  } = useCanvasInteractions(canvasRef, TILE_SIZE);

  const handleHover = (e) => {
    if (pinnedTooltip) return;
    const coords = getGridCoords(e, canvasRef.current, TILE_SIZE);
    const foundEvent = animatedEvents.find(
      (ev) => ev.x === coords.x && ev.y === coords.y
    );
    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (foundEvent) {
      setHoveredEvent(foundEvent);
      setTooltipPosition({
        x: e.clientX - canvasRect.left + 10,
        y: e.clientY - canvasRect.top + 10,
      });
    } else {
      setHoveredEvent(null);
    }
  };

  const handleEventClick = (e) => {
    const coords = getGridCoords(e, canvasRef.current, TILE_SIZE);
    const clickedEvent = animatedEvents.find(
      (ev) => ev.x === coords.x && ev.y === coords.y
    );
    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (clickedEvent) {
      setPinnedTooltip({
        event: clickedEvent,
        position: {
          x: e.clientX - canvasRect.left + 10,
          y: e.clientY - canvasRect.top + 10,
        },
      });
      e.stopPropagation();
    } else if (!e.target.closest(".event-tooltip")) {
      setPinnedTooltip(null);
    }
  };

  const { onMouseDown, onMouseMove, onMouseUp } = useMouseHandlers({
    activeLayer,
    selectedTile,
    drawingTool,
    updateTile,
    setGridBase,
    setGridOverlay,
    canvasMouseDown,
    canvasMouseMove,
    canvasMouseUp,
    startPos,
    canvasRef,
    pinnedTooltip,
    handleHover,
    TILE_SIZE,
  });

  const handleMouseDown = (e) => {
    const coords = getGridCoords(e, canvasRef.current, TILE_SIZE);
    const clickedEvent = animatedEvents.find(
      (ev) => ev.x === coords.x && ev.y === coords.y
    );
    if (clickedEvent || hoveredEvent || e.target.closest(".event-tooltip")) {
      handleEventClick(e);
      return;
    } else {
      onMouseDown(e);
    }
  };

  const handleMouseMove = (e) => {
    if (!pinnedTooltip) {
      handleHover(e);
    }
    if (!hoveredEvent && !e.target.closest(".event-tooltip")) {
      onMouseMove(e);
    }
  };

  const handleMouseUp = (e) => {
    if (!hoveredEvent && !e.target.closest(".event-tooltip")) {
      onMouseUp(e);
    }
  };

  // ✅ Autotile drawing logic
  const drawBaseLayerAutotiles = (ctx, gridBase, imageMap) => {
    for (let y = 0; y < gridBase.length; y++) {
      for (let x = 0; x < gridBase[y].length; x++) {
        const tile = gridBase[y][x];
        if (tile.type === "water") {
          drawAutotile(ctx, tile, x, y, gridBase, imageMap);
        } else {
          const img = imageMap.water;
          if (!img) continue;
          ctx.drawImage(
            img,
            32,
            0,
            32,
            32,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }
  };

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBaseLayerAutotiles(ctx, gridBase, imageMap);

    drawOverlayLayer({
      ctx,
      gridOverlay,
      outdoorImage: outdoorImageRef.current,
      tileSize: TILE_SIZE,
      onImageLoad: drawGrid,
    });

    drawEvents({
      ctx,
      animatedEvents,
      tileSize: TILE_SIZE,
      onImageLoad: drawGrid,
    });

    if (startPos && currentPos && drawingTool !== "pencil") {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);

      if (drawingTool === "rectangle") {
        const xStart = Math.min(startPos.x, currentPos.x);
        const xEnd = Math.max(startPos.x, currentPos.x);
        const yStart = Math.min(startPos.y, currentPos.y);
        const yEnd = Math.max(startPos.y, currentPos.y);
        ctx.strokeRect(
          xStart * TILE_SIZE,
          yStart * TILE_SIZE,
          (xEnd - xStart + 1) * TILE_SIZE,
          (yEnd - yStart + 1) * TILE_SIZE
        );
      } else if (drawingTool === "circle") {
        const centerX = (startPos.x + currentPos.x) / 2;
        const centerY = (startPos.y + currentPos.y) / 2;
        const radius =
          (Math.max(
            Math.abs(currentPos.x - startPos.x),
            Math.abs(currentPos.y - startPos.y)
          ) /
            2) *
          TILE_SIZE;
        ctx.beginPath();
        ctx.arc(
          centerX * TILE_SIZE,
          centerY * TILE_SIZE,
          radius,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    drawEffects({
      ctx,
      season,
      snowParticles,
    });

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    ctx.restore();
  }, [
    gridBase,
    gridOverlay,
    animatedEvents,
    startPos,
    currentPos,
    season,
    snowParticles,
    drawingTool,
    imageMap,
  ]);

  useEffect(() => {
    let animationFrameId;
    const update = () => {
      if (season === "winter") {
        setSnowParticles((prev) =>
          prev.map((p) => {
            let newY = p.y + p.speed;
            if (newY > GRID_HEIGHT * TILE_SIZE) newY = 0;
            return { ...p, y: newY };
          })
        );
      }
      drawGrid();
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawGrid, season]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * TILE_SIZE}
        height={GRID_HEIGHT * TILE_SIZE}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={(e) => {
          if (!pinnedTooltip) {
            setHoveredEvent(null);
          }
          handleMouseUp(e);
        }}
      />
      {(hoveredEvent || pinnedTooltip) && (
        <EventTooltip
          event={pinnedTooltip ? pinnedTooltip.event : hoveredEvent}
          position={pinnedTooltip ? pinnedTooltip.position : tooltipPosition}
          pinned={!!pinnedTooltip}
          onTogglePin={() => {
            setPinnedTooltip(null);
          }}
          onUpdate={(updatedEvent) => {
            setAnimatedEvents((prev) =>
              prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
            );
            if (pinnedTooltip && pinnedTooltip.event.id === updatedEvent.id) {
              setPinnedTooltip({
                event: updatedEvent,
                position: pinnedTooltip.position,
              });
            }
          }}
        />
      )}
    </>
  );
};

export default MapCanvas;
