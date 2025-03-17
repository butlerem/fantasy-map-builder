import React, { useContext } from "react";
import { MapContext } from "../context/MapContext";
import { FaPlay, FaPause, FaCopy, FaSave, FaArrowUp } from "react-icons/fa";

const Toolbar = () => {
  const {
    isLiveMode,
    setIsLiveMode,
    handleSave,
    handleLoad,
    clearCanvas,
    handleLoadSample,
  } = useContext(MapContext);

  const iconStyle = { marginRight: "8px" };

  return (
    <div className="toolbar">
      <button onClick={() => setIsLiveMode((prev) => !prev)}>
        {isLiveMode ? (
          <>
            <FaPause size={20} color="var(--white)" style={iconStyle} />
            Pause
          </>
        ) : (
          <>
            <FaPlay size={20} color="var(--white)" style={iconStyle} />
            Play
          </>
        )}
      </button>
      <button onClick={clearCanvas}>
        <FaCopy size={20} color="var(--white)" style={iconStyle} />
        Clear Canvas
      </button>
      <button onClick={handleSave}>
        <FaSave size={20} color="var(--white)" style={iconStyle} />
        Save Map
      </button>
      <button onClick={handleLoad}>
        <FaArrowUp size={20} color="var(--white)" style={iconStyle} />
        Load Map
      </button>
      <button onClick={() => handleLoadSample("sample1")}>Load Sample 1</button>
      <button onClick={() => handleLoadSample("sample2")}>Load Sample 2</button>
    </div>
  );
};

export default Toolbar;
