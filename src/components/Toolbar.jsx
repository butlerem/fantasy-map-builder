import React, { useContext } from "react";
import { MapContext } from "../context/MapContext";
import {
  FaSun,
  FaPlay,
  FaPause,
  FaCopy,
  FaSave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { SeasonsContext } from "../context/SeasonProvider";

const Toolbar = () => {
  const {
    isLiveMode,
    setIsLiveMode,
    handleSave,
    handleLoad,
    clearCanvas,
    handleLoadSample,
  } = useContext(MapContext);

  const { toggleSeason } = useContext(SeasonsContext);

  const iconStyle = { marginRight: "8px" };

  return (
    <div className="toolbar">
      <button onClick={toggleSeason}>
        <FaSun size={15} color="var(--white)" style={iconStyle} />
        <span className="button-text">Season</span>
      </button>

      <button onClick={() => setIsLiveMode((prev) => !prev)}>
        {isLiveMode ? (
          <>
            <FaPause size={12} color="var(--white)" style={iconStyle} />
            <span className="button-text">Pause</span>
          </>
        ) : (
          <>
            <FaPlay size={12} color="var(--white)" style={iconStyle} />
            <span className="button-text">Play</span>
          </>
        )}
      </button>

      <button onClick={clearCanvas}>
        <FaCopy size={12} color="var(--white)" style={iconStyle} />
        <span className="button-text">Clear</span>
      </button>

      <button onClick={handleSave}>
        <FaSave size={12} color="var(--white)" style={iconStyle} />
        <span className="button-text">Save Map</span>
      </button>

      <button onClick={handleLoad}>
        <FaArrowUp size={12} color="var(--white)" style={iconStyle} />
        <span className="button-text">Load Map</span>
      </button>

      <button onClick={() => handleLoadSample("sample1")}>
        <FaArrowDown size={12} color="var(--white)" style={iconStyle} />
        <span className="button-text">Sample</span>
      </button>
    </div>
  );
};

export default Toolbar;
