import { Droppable } from 'react-beautiful-dnd';
import type { Character } from '@/types';
import { CharacterItem } from './CharacterItem';
import { TIER_COLORS } from '@/config';
import styles from './TierRow.module.css';

interface TierRowProps {
  tier: string;
  characters: Character[];
  onCharacterClick?: (character: Character) => void;
}

/**
 * TierRow component - displays a single tier row (S, A, B, C, or D)
 * 
 * Shows the tier label and a droppable area for character cards.
 * Characters can be dropped here from the unassigned pool or other tiers.
 */
export function TierRow({ tier, characters, onCharacterClick }: TierRowProps) {
  const tierColor = TIER_COLORS[tier as keyof typeof TIER_COLORS] || '#999';

  return (
    <div className={styles.tierRow}>
      {/* Tier Label */}
      <div
        className={styles.tierLabel}
        style={{ backgroundColor: tierColor }}
      >
        <span className={styles.tierText}>{tier}</span>
        <span className={styles.tierCount}>{characters.length}</span>
      </div>

      {/* Tier Content (Droppable) */}
      <Droppable droppableId={`tier-${tier.toLowerCase()}`} type="CHARACTER" direction="horizontal">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${styles.tierContent} ${
              snapshot.isDraggingOver ? styles.draggedOver : ''
            }`}
          >
            {characters.length === 0 ? (
              <div className={styles.empty}>
                <span>⬆️ Drop characters here</span>
              </div>
            ) : (
              <div className={styles.characterGrid}>
                {characters.map((char, index) => (
                  <CharacterItem
                    key={char.id}
                    character={char}
                    index={index}
                    onClick={onCharacterClick}
                  />
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
