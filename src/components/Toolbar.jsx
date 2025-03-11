import React from "react";

const Toolbar = ({ activeLayer, setActiveLayer, onClear, onSave, onLoad }) => {
  return (
    <div>
      <div>Active Layer: {activeLayer}</div>
      <button onClick={() => setActiveLayer("base")}>Base Layer</button>
      <button onClick={() => setActiveLayer("overlay")}>Overlay Layer</button>
      <button onClick={onClear}>Clear Canvas</button>
      <button onClick={onSave}>Save Map</button>
      <button onClick={onLoad}>Load Map</button>
    </div>
  );
};

export default Toolbar;
