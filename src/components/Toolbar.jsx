import React from "react";

const Toolbar = ({
  activeLayer,
  setActiveLayer,
  isLiveMode,
  setIsLiveMode,
  onClear,
  onSave,
  onLoad,
}) => {
  return (
    <div>
      <div>Active Layer: {activeLayer}</div>
      <button onClick={() => setActiveLayer("base")}>Base Layer</button>
      <button onClick={() => setActiveLayer("overlay")}>Overlay Layer</button>
      <button onClick={() => setActiveLayer("events")}>Events Layer</button>
      <button onClick={() => setIsLiveMode((prev) => !prev)}>
        {isLiveMode ? "Exit Live Mode" : "Enter Live Mode"}
      </button>
      <button onClick={onClear}>Clear Canvas</button>
      <button onClick={onSave}>Save Map</button>
      <button onClick={onLoad}>Load Map</button>
    </div>
  );
};

export default Toolbar;
