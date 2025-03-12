// src/components/Toolbar.jsx
import React, { useContext } from "react";
import { MapContext } from "../context/MapContext";

const Toolbar = () => {
  const { isLiveMode, setIsLiveMode, handleSave, handleLoad, clearCanvas } =
    useContext(MapContext);

  return (
    <div>
      <button onClick={() => setIsLiveMode((prev) => !prev)}>
        {isLiveMode ? "Exit Live Mode" : "Enter Live Mode"}
      </button>
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={handleSave}>Save Map</button>
      <button onClick={handleLoad}>Load Map</button>
    </div>
  );
};

export default Toolbar;
