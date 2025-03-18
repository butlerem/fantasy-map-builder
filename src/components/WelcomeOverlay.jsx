import React, { useState, useEffect } from "react";
import {
  FaSun,
  FaPlay,
  FaPause,
  FaCopy,
  FaSave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

function WelcomeOverlay({ onDismiss }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const fullText = "Map Builder";
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + fullText[currentIndex]);
      currentIndex++;
      if (currentIndex >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <div className={`welcome-overlay ${fadeOut ? "fade-out" : ""}`}>
      <div className="welcome-content">
        {/* Typing effect in action */}
        <h2>{typedText}</h2>

        <p>Create and edit your own RPG map.</p>

        {/* Remove bullet dots from the list */}
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li>
            <strong>Base Layer</strong>: Ground/terrain tiles (grass, roads,
            water, etc.).
          </li>
          <li>
            <strong>Object Layer</strong>: Buildings, trees, and other objects.
          </li>
          <li>
            <strong>Event Layer</strong>: NPCs, animals, or special events.
          </li>
        </ul>

        <p>Toolbar actions:</p>

        {/* Remove bullet dots from the list */}
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li>
            <FaSun size={15} color="var(--white)" style={{ marginRight: 6 }} />
            <strong>Season</strong>: Toggle between different season themes.
          </li>
          <li>
            <FaPlay size={12} color="var(--white)" style={{ marginRight: 4 }} />
            <FaPause
              size={12}
              color="var(--white)"
              style={{ marginRight: 6 }}
            />
            <strong>Play/Pause</strong>: Toggle live mode for animations.
          </li>
          <li>
            <FaCopy size={12} color="var(--white)" style={{ marginRight: 6 }} />
            <strong>Clear</strong>: Wipe the entire canvas.
          </li>
          <li>
            <FaSave size={12} color="var(--white)" style={{ marginRight: 6 }} />
            <strong>Save Map</strong>: Save your current map layout.
          </li>
          <li>
            <FaArrowUp
              size={12}
              color="var(--white)"
              style={{ marginRight: 6 }}
            />
            <strong>Load Map</strong>: Load a previously saved map.
          </li>
          <li>
            <FaArrowDown
              size={12}
              color="var(--white)"
              style={{ marginRight: 6 }}
            />
            <strong>Sample Map</strong>: Load a prepared example map.
          </li>
        </ul>

        <button onClick={handleDismiss}>Get Started</button>
      </div>
    </div>
  );
}

export default WelcomeOverlay;
