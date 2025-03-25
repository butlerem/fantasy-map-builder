import React from "react";
import PropTypes from "prop-types";
import getFrameForEvent from "../assets/eventSprites";

/**
 * Renders a list of characters with their sprite.
 */
const CharacterList = ({ characters, onCharacterClick }) => {
  return (
    <div className="character-list">
      <h3>Characters</h3>
      <div className="character-list-items">
        {characters.map((character, index) => {
          // Get sprite frame for the character event type
          const sprite = getFrameForEvent(character.type, 1);
          const spriteStyle = sprite && {
            width: "42px",
            height: "42px",
            backgroundImage: `url(${sprite.image.src})`,
            backgroundPosition: `-${sprite.sx}px -${sprite.sy}px`,
            backgroundSize: `${sprite.image.width}px ${sprite.image.height}px`,
            backgroundRepeat: "no-repeat",
          };

          return (
            <div
              key={character.id || index}
              className="character-list-item"
              onClick={() => onCharacterClick(character)}
              title={`${character.name} - ${character.role || "No role"}`}
            >
              <div className="character-sprite" style={spriteStyle} />
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
