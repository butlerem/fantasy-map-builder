import React from "react";
import PropTypes from "prop-types";
import getFrameForEvent, {
  EVENT_DEFAULT_NAMES,
} from "../../assets/eventSprites";
import { Shield, Sword, Sparkles, Skull, Star } from "lucide-react";
import styles from "./CharacterList.module.scss";

const roleIcons = {
  hero: Shield,
  fighter: Sword,
  healer: Sparkles,
  enemy: Skull,
  npc: Star,
};

const roleColors = {
  hero: "#27ae60",
  fighter: "#8e44ad",
  healer: "#00bcd4",
  enemy: "#c0392b",
  npc: "#7f8c8d",
};

const CharacterList = ({ characters, onCharacterClick }) => {
  return (
    <div className={styles.characterListWrapper}>
      <div className={styles.characterListLabel}>Characters</div>

      <div className={styles.characterListPanel}>
        {/* Decorative corner bits */}
        <div className={`${styles.corner} ${styles.tl}`}></div>
        <div className={`${styles.corner} ${styles.tr}`}></div>
        <div className={`${styles.corner} ${styles.bl}`}></div>
        <div className={`${styles.corner} ${styles.br}`}></div>

        {/* Inset border */}
        <div className={styles.characterListInnerBorder}></div>

        {/* Character icons */}
        <div className={styles.characterListItems}>
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
              character.name ||
              EVENT_DEFAULT_NAMES[character.type] ||
              "Unnamed";

            const RoleIcon = roleIcons[roleKey] || roleIcons.default;

            return (
              <div
                key={character.id || index}
                className={styles.characterListItem}
                onClick={() => onCharacterClick(character)}
              >
                <div className={styles.characterEntry}>
                  <div className={styles.characterSprite} style={spriteStyle} />
                  <div
                    className={styles.roleIconBox}
                    style={{
                      backgroundColor: `${roleColor}22`,
                      border: `0.2vmin solid ${roleColor}`,
                    }}
                  >
                    <RoleIcon size={16} strokeWidth={2} color={roleColor} />
                  </div>
                  <div className={styles.characterInfo}>
                    <div className={styles.characterName}>{displayName}</div>
                    <div className={styles.characterRole}>{displayRole}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
