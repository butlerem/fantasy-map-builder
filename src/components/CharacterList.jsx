import React from "react";
import PropTypes from "prop-types";
import getFrameForEvent, { EVENT_DEFAULT_NAMES } from "../assets/eventSprites";
import { Shield, Sword, Sparkles, Skull, Star } from "lucide-react";

// Map roles/classes to icons
const roleIcons = {
  hero: Shield,
  fighter: Sword,
  healer: Sparkles,
  enemy: Skull,
  npc: Star,
};

const roleColors = {
  hero: "#27ae60", // Royal Green
  fighter: "#8e44ad", // Royal Purple
  healer: "#00bcd4", // Cyan
  enemy: "#c0392b", // Enemy Red
  npc: "#7f8c8d", // Grey
};

/**
 * Renders a list of characters with their sprite.
 */
const CharacterList = ({ characters, onCharacterClick }) => {
  return (
    <div className="character-list">
      <h3>Characters</h3>
      <div className="character-list-items">
        {characters.map((character, index) => {
          const displayRole = character.role || "npc";
          const sprite = getFrameForEvent(character.type, 1);
          const roleKey = displayRole.toLowerCase();
          const roleColor = roleColors[roleKey] || roleColors.npc;
          const spriteStyle = sprite && {
            width: "42px",
            height: "42px",
            backgroundImage: `url(${sprite.image.src})`,
            backgroundPosition: `-${sprite.sx}px -${sprite.sy}px`,
            backgroundSize: `${sprite.image.width}px ${sprite.image.height}px`,
            backgroundRepeat: "no-repeat",
          };

          const displayName =
            character.name || EVENT_DEFAULT_NAMES[character.type] || "Unnamed";

          const RoleIcon =
            roleIcons[displayRole.toLowerCase()] || roleIcons.default;

          return (
            <div
              key={character.id || index}
              className="character-list-item"
              onClick={() => onCharacterClick(character)}
              title={`${displayName} - ${displayRole}`}
            >
              <div className="character-entry">
                <div className="character-sprite" style={spriteStyle} />
                <div
                  className="role-icon-box"
                  style={{
                    backgroundColor: `${roleColor}22`, // translucent background
                    border: `0.2vmin solid ${roleColor}`,
                  }}
                >
                  <RoleIcon size={16} strokeWidth={2} color={roleColor} />
                </div>
                <div className="character-info">
                  <div className="character-name">{displayName}</div>
                  <div className="character-role">{displayRole}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CharacterList.propTypes = {
  characters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string.isRequired,
      role: PropTypes.string,
    })
  ).isRequired,
  onCharacterClick: PropTypes.func.isRequired,
};

export default CharacterList;
