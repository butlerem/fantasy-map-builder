import React, { useState } from "react";
import {
  FaSun,
  FaPlay,
  FaPause,
  FaCopy,
  FaSave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const WelcomeOverlay = () => {
  const [visible, setVisible] = useState(true);
  const title = "Map Builder";

  // Handles the dismissal of the overlay with a fade-out animation
  const handleDismiss = () => {
    const overlay = document.getElementById("welcome-overlay");
    if (overlay) {
      overlay.classList.add("fade-out");
    }
    setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  if (!visible) return null;

  return (
    <div id="welcome-overlay" className="welcome-overlay">
      <div className="welcome-content">
        <h2 className="welcome-title">{title}</h2>
        <div className="menu-options">
          {/* Animated triangle arrow */}
          <div className="menu-arrow"></div>
          <div className="menu-option">
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              <li>Use the Map Builder to create your own custom RPG map!</li>
            </ul>
          </div>
          <div className="menu-option">
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              <li>Click and drag to draw terrain and object tiles.</li>
            </ul>
          </div>
          <div className="menu-option">
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              <li>NPCs will avoid water and objects in Live Mode.</li>
            </ul>
          </div>
          <div className="menu-option">
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              <li>
                <FaSun size={15} color="#fff" style={{ marginRight: 6 }} />-
                Change season theme
              </li>
              <li>
                <FaPause size={12} color="#fff" style={{ marginRight: 6 }} />
                <FaPlay size={12} color="#fff" style={{ marginRight: 6 }} />-
                Toggle live mode
              </li>
              <li>
                <FaCopy size={12} color="#fff" style={{ marginRight: 6 }} />-
                Wipe the canvas
              </li>
              <li>
                <FaSave size={12} color="#fff" style={{ marginRight: 6 }} />
                <FaArrowUp size={12} color="#fff" style={{ marginRight: 6 }} />-
                Save and load your map
              </li>
              <li>
                <FaArrowDown
                  size={12}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                - Load a sample map
              </li>
            </ul>
          </div>
        </div>
        <button onClick={handleDismiss}>Start</button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
