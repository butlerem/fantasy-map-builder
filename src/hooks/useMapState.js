/**
 * useMapState hook
 * Manages map and character list state, and provides functions to save/load
 * the composite app state to/from localStorage.
 */

import { useState, useEffect } from "react";
import { saveAppState, loadAppState } from "./storage";

const TILE_SIZE = 40;

export function useMapState() {
  // Map editing and UI state
  const [activeLayer, setActiveLayer] = useState("base");
  const [drawingTool, setDrawingTool] = useState("pencil");
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedTiles, setSelectedTiles] = useState({
    base: "grass",
    overlay: null,
    events: "boy",
  });
  const [pinnedTooltip, setPinnedTooltip] = useState(null);

  // Map data state
  const [gridBase, setGridBase] = useState([]);
  const [gridOverlay, setGridOverlay] = useState([]);
  const [animatedEvents, setAnimatedEvents] = useState([]);

  // Party (character list) state
  const [characters, setCharacters] = useState([]);

  const handleDismissWelcome = () => setShowWelcome(false);

  const handleSaveAll = () => {
    const mapData = { gridBase, gridOverlay, animatedEvents };
    const partyData = characters;
    saveAppState(mapData, partyData);
  };

  const handleLoadAll = () => {
    const savedState = loadAppState();
    if (savedState) {
      const { mapData, partyData } = savedState;
      if (mapData) {
        setGridBase(mapData.gridBase);
        setGridOverlay(mapData.gridOverlay);
        const reinitializedEvents = (mapData.animatedEvents || []).map(
          (event) => {
            const newEvent = { ...event };
            delete newEvent.targetX;
            delete newEvent.targetY;
            return {
              ...newEvent,
              lastMoveTime: performance.now() - 1000,
              frameTime: performance.now(),
              movementProgress: 0,
            };
          }
        );
        setAnimatedEvents(reinitializedEvents);
      }
      if (partyData) {
        setCharacters(partyData);
      }
    }
  };

  useEffect(() => {
    handleLoadAll();
  }, []);

  return {
    activeLayer,
    setActiveLayer,
    drawingTool,
    setDrawingTool,
    showWelcome,
    selectedTiles,
    setSelectedTiles,
    pinnedTooltip,
    setPinnedTooltip,
    handleDismissWelcome,
    gridBase,
    setGridBase,
    gridOverlay,
    setGridOverlay,
    animatedEvents,
    setAnimatedEvents,
    characters,
    setCharacters,
    handleSaveAll,
    handleLoadAll,
  };
}
