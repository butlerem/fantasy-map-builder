import React, { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import getFrameForEvent, { EVENT_DEFAULT_NAMES } from "../assets/eventSprites";

const ROLES = ["hero", "villain", "healer", "fighter"];

/**
 * Displays a floating tooltip for an event with options to edit its name and cycle roles.
 */
export const EventTooltip = memo(
  ({ event, position, onUpdate, pinned, onTogglePin }) => {
    // State for toggling name edit mode
    const [isEditing, setIsEditing] = useState(false);
    // Current role index based on ROLES array
    const [roleIndex, setRoleIndex] = useState(
      ROLES.indexOf(event.role) >= 0 ? ROLES.indexOf(event.role) : 0
    );
    // Track whether the tooltip is hovered
    const [setIsHovered] = useState(false);

    // Default display name from event or fallback from EVENT_DEFAULT_NAMES
    const displayName = event.name || EVENT_DEFAULT_NAMES[event.type] || "";

    // Update role index when event.role changes
    useEffect(() => {
      const newIndex = ROLES.indexOf(event.role);
      setRoleIndex(newIndex >= 0 ? newIndex : 0);
    }, [event.role]);

    // Get sprite frame for the event type
    const eventSprite = getFrameForEvent(event.type, 1);
    const spriteStyle = eventSprite && {
      width: "40px",
      height: "40px",
      backgroundImage: `url(${eventSprite.image.src})`,
      backgroundPosition: `-${eventSprite.sx}px -${eventSprite.sy}px`,
      backgroundSize: `${eventSprite.image.width}px ${eventSprite.image.height}px`,
      backgroundRepeat: "no-repeat",
    };

    // Handle changes to the event name
    const handleNameChange = (e) => {
      onUpdate({ ...event, name: e.target.value });
    };

    // Exit editing mode on blur
    const handleNameBlur = () => {
      setIsEditing(false);
    };

    // Cycle through available roles
    const cycleRole = (direction) => {
      const newIndex = (roleIndex + direction + ROLES.length) % ROLES.length;
      setRoleIndex(newIndex);
      onUpdate({ ...event, role: ROLES[newIndex] });
    };

    return (
      <div
        className="event-tooltip"
        style={{
          top: position.y,
          left: position.x,
          pointerEvents: "auto",
          transform: "translate(10px, 10px)",
          transition: "none",
        }}
        role="dialog"
        aria-label={`Event details for ${displayName}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {pinned && (
          <button
            className="tooltip-pin"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin?.();
            }}
            aria-label="Unpin tooltip"
          >
            –
          </button>
        )}

        {/* Display event sprite or fallback image */}
        {spriteStyle ? (
          <div style={spriteStyle} />
        ) : (
          <img
            src={event.imageSrc}
            alt={`${displayName} avatar`}
            style={{ width: "40px", height: "40px" }}
          />
        )}

        {/* Toggle between input for editing name and display text */}
        {isEditing ? (
          <input
            className="tooltip-input"
            value={displayName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === "Enter" && handleNameBlur()}
            aria-label="Edit event name"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            style={{ cursor: "pointer", marginBottom: "4px" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
          >
            {displayName}
          </div>
        )}

        {/* Role selection controls */}
        <div className="role-cycler">
          <button onClick={() => cycleRole(-1)} aria-label="Previous role">
            {"<"}
          </button>
          <span style={{ margin: "0 5px" }}>{ROLES[roleIndex]}</span>
          <button onClick={() => cycleRole(1)} aria-label="Next role">
            {">"}
          </button>
        </div>
      </div>
    );
  }
);

EventTooltip.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.oneOf(ROLES),
    imageSrc: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  pinned: PropTypes.bool,
  onTogglePin: PropTypes.func,
};

EventTooltip.displayName = "EventTooltip";
