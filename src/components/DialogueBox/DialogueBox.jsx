import React, { useState, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import getFrameForEvent from "../../assets/eventSprites";

const WelcomeOverlay = () => {
  // Control whether the overlay is visible.
  const [visible, setVisible] = useState(true);
  // Track the current tutorial step.
  const [step, setStep] = useState(1);
  // Reference to the overlay element for fade-out.
  const overlayRef = useRef(null);

  const tutorialEvent = { type: "girl2" };
  const eventSprite = getFrameForEvent(tutorialEvent.type, 1);

  const spriteStyle = eventSprite
    ? {
        backgroundImage: `url(${eventSprite.image.src})`,
        backgroundPosition: `-${eventSprite.sx}px -${eventSprite.sy}px`,
        width: "40px",
        height: "40px",
      }
    : {};

  // Handler for the "Next"/"Begin" button click.
  const handleNext = () => {
    if (step === 1) {
      // Move to the next tutorial step.
      setStep(2);
    } else if (step === 2) {
      // Trigger fade-out animation and hide the overlay.
      if (overlayRef.current) {
        overlayRef.current.classList.add("fade-out");
      }
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  };

  // If the overlay is not visible then render nothing.
  if (!visible) return null;

  const textStep1 = `Welcome to the Map Builder! This tool lets you create your own custom maps.
Click and drag to draw terrain, objects, and events. Hover and click events to view and edit their profile.`;

  const textStep2 = `Use the toolbar to select the season theme, Play/Pause Live Mode, Clear/Save/Load 
maps, and Load a Sample Map.`;

  return (
    <div
      id="welcome-overlay"
      ref={overlayRef}
      className={`tutorial-overlay ${
        step === 2 ? "tutorial-overlay-step2" : ""
      }`}
    >
      <div className="tutorial-content">
        <div className="tutorial-sprite" style={spriteStyle}></div>
        <h3 className="tutorial-title">Tutorial</h3>
        <div
          className="tutorial-text"
          style={{ fontSize: "1em", whiteSpace: "pre-line" }}
        >
          {step === 1 && (
            <Typewriter
              words={[textStep1]}
              loop={1} // Type only once
              cursor
              typeSpeed={25}
              deleteSpeed={0}
              delaySpeed={1000}
            />
          )}
          {step === 2 && (
            <Typewriter
              words={[textStep2]}
              loop={1}
              cursor
              typeSpeed={25}
              deleteSpeed={0}
              delaySpeed={1000}
            />
          )}
        </div>
        <div className="tutorial-button-container">
          <div className="tutorial-arrow"></div>
          <button className="tutorial-button" onClick={handleNext}>
            {step === 1 ? "Next" : "Begin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
