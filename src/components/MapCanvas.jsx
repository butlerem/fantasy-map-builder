import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { MapContext } from "../context/MapContext";
import { SeasonsContext } from "../context/SeasonProvider";
import { tileImages } from "../assets/tileImages";
import outdoorTileset from "../assets/maps/outdoor.png";
import { drawBaseLayer } from "../utils/drawing/drawBaseLayer";
import { drawOverlayLayer } from "../utils/drawing/drawOverlayLayer";
import { drawEvents } from "../utils/drawing/drawEvents";
import { drawEffects } from "../utils/drawing/drawEffects";
import { EventTooltip } from "./EventTooltip";
import CharacterList from "./CharacterList";
import { getGridCoords } from "../utils/getGridCoords";
import { useCanvasInteractions } from "../hooks/useCanvasInteractions";
import { useMouseHandlers } from "../hooks/useMouseHandlers";

/**
 * Grid dimensions and tile size constants
 */
const GRID_WIDTH = 18;
const GRID_HEIGHT = 16;
const TILE_SIZE = 40;

/**
 * MapCanvas component handles the main map rendering and interaction
 * Manages canvas drawing, event handling, and seasonal effects
 */
const MapCanvas = ({ activeLayer, selectedTile, drawingTool }) => {
  // Context hooks for map data and season state
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

  // Canvas and tileset refs for rendering
  const canvasRef = useRef(null);
  const outdoorImageRef = useRef(null);

  // Preload outdoor tileset for overlay rendering
  useEffect(() => {
    const img = new Image();
    img.src = outdoorTileset;
    outdoorImageRef.current = img;
  }, []);

  // State for tooltip and visual effects
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [pinnedTooltip, setPinnedTooltip] = useState(null);
  const [snowParticles, setSnowParticles] = useState([]);

  // Initialize snow particles for winter season with random properties
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

  // Canvas interaction hooks for mouse handling
  const {
    startPos,
    currentPos,
    handleMouseDown: canvasMouseDown,
    handleMouseMove: canvasMouseMove,
    handleMouseUp: canvasMouseUp,
  } = useCanvasInteractions(canvasRef, TILE_SIZE);

  // Handle tooltip hover and position calculation
  const handleHover = (e) => {
    if (pinnedTooltip) return;

    // Convert mouse coordinates to grid position
    const coords = getGridCoords(e, canvasRef.current, TILE_SIZE);
    const foundEvent = animatedEvents.find(
      (ev) => ev.x === coords.x && ev.y === coords.y
    );

    // Calculate tooltip position relative to canvas
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

  // Add click handler for events
  const handleEventClick = (e) => {
    const coords = getGridCoords(e, canvasRef.current, TILE_SIZE);
    const clickedEvent = animatedEvents.find(
      (ev) => ev.x === coords.x && ev.y === coords.y
    );

    if (clickedEvent) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setPinnedTooltip({
        event: clickedEvent,
        position: {
          x: e.clientX - canvasRect.left + 10,
          y: e.clientY - canvasRect.top + 10,
        }
      });
      e.stopPropagation(); // Prevent other mouse handlers
    } else if (!e.target.closest('.event-tooltip')) {
      // Only close if we didn't click inside the tooltip
      setPinnedTooltip(null);
    }
  };

  // Mouse event handlers for drawing and interaction
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

  // Modified mouse handlers to respect pinned tooltips
  const handleMouseDown = (e) => {
    const coords = getGridCoords(e, canvasRef.current, TILE_SIZE);
    const clickedEvent = animatedEvents.find(
      (ev) => ev.x === coords.x && ev.y === coords.y
    );
    
    if (clickedEvent || hoveredEvent || e.target.closest('.event-tooltip')) {
      handleEventClick(e);
      return; // Prevent drawing when clicking events/tooltips
    } else {
      onMouseDown(e);
    }
  };

  const handleMouseMove = (e) => {
    if (!pinnedTooltip) {
      handleHover(e);
    }
    
    // Only allow drawing if not hovering over an event or tooltip
    if (!hoveredEvent && !e.target.closest('.event-tooltip')) {
      onMouseMove(e);
    }
  };

  const handleMouseUp = (e) => {
    if (!hoveredEvent && !e.target.closest('.event-tooltip')) {
      onMouseUp(e);
    }
  };

  // Main drawing function for rendering all layers and effects
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base terrain layer
    drawBaseLayer({
      ctx,
      gridBase,
      tileImages,
      tileSize: TILE_SIZE,
      onImageLoad: drawGrid,
    });

    // Draw object overlay layer
    drawOverlayLayer({
      ctx,
      gridOverlay,
      outdoorImage: outdoorImageRef.current,
      tileSize: TILE_SIZE,
      onImageLoad: drawGrid,
    });

    // Draw animated events layer
    drawEvents({
      ctx,
      animatedEvents,
      tileSize: TILE_SIZE,
      onImageLoad: drawGrid,
    });

    // Draw shape preview for rectangle and circle tools
    if (startPos && currentPos && drawingTool !== "pencil") {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);

      if (drawingTool === "rectangle") {
        // Calculate rectangle bounds from mouse positions
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
        // Calculate circle center and radius from mouse positions
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

    // Draw seasonal effects and grid overlay
    drawEffects({
      ctx,
      season,
      snowParticles,
    });

    // Draw grid lines for visual reference
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
  ]);

  // Animation loop for updating particles and redrawing
  useEffect(() => {
    let animationFrameId;

    const update = () => {
      // Update snow particle positions in winter season
      if (season === "winter") {
        setSnowParticles((prevParticles) =>
          prevParticles.map((p) => {
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

  // Handle character selection from the list
  const handleCharacterClick = (character) => {
    const event = animatedEvents.find(ev => 
      ev.x === character.x && 
      ev.y === character.y && 
      ev.id === character.id
    );
    
    if (event) {
      setPinnedTooltip({
        event: event,
        position: {
          x: event.x * TILE_SIZE + TILE_SIZE/2,
          y: event.y * TILE_SIZE - TILE_SIZE/2
        }
      });
    }
  };

  return (
    <div className="main-content">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * TILE_SIZE}
          height={GRID_HEIGHT * TILE_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (!pinnedTooltip) {
              setHoveredEvent(null);
            }
            handleMouseUp();
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
      </div>
    
        <CharacterList 
          characters={animatedEvents}
          onCharacterClick={handleCharacterClick}
        />
    </div>
  );
};

export default MapCanvas;
