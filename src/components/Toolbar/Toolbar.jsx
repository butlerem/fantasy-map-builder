import React, { useContext } from "react";
import { MapContext } from "../../context/MapContext";
import {
  FaSun,
  FaPlay,
  FaPause,
  FaCopy,
  FaSave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { SeasonsContext } from "../../context/SeasonProvider";
import styles from "./Toolbar.module.scss"; // <-- use module

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

  return (
    <div className={styles.toolbar}>
      <button onClick={toggleSeason} className={styles.toolbarButton}>
        <FaSun size={15} />
        <span className={styles.buttonText}>Season</span>
      </button>

      <button
        onClick={() => setIsLiveMode((prev) => !prev)}
        className={styles.toolbarButton}
      >
        {isLiveMode ? (
          <>
            <FaPause size={12} />
            <span className={styles.buttonText}>Pause</span>
          </>
        ) : (
          <>
            <FaPlay size={12} />
            <span className={styles.buttonText}>Play</span>
          </>
        )}
      </button>

      <button onClick={clearCanvas} className={styles.toolbarButton}>
        <FaCopy size={12} />
        <span className={styles.buttonText}>Clear</span>
      </button>

      <button onClick={handleSave} className={styles.toolbarButton}>
        <FaSave size={12} />
        <span className={styles.buttonText}>Save Map</span>
      </button>

      <button onClick={handleLoad} className={styles.toolbarButton}>
        <FaArrowUp size={12} />
        <span className={styles.buttonText}>Load Map</span>
      </button>

      <button
        onClick={() => handleLoadSample("sample1")}
        className={styles.toolbarButton}
      >
        <FaArrowDown size={12} />
        <span className={styles.buttonText}>Sample</span>
      </button>
    </div>
  );
};

export default Toolbar;
